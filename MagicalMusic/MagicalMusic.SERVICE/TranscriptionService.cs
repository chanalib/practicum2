using Microsoft.Extensions.Logging;
using System.Diagnostics;

public class TranscriptionService
{
    private readonly ILogger<TranscriptionService> _logger;

    public TranscriptionService(ILogger<TranscriptionService> logger)
    {
        _logger = logger;
    }

    public async Task<string> TranscribeAudioFullAsync(string audioFilePath)
    {
        _logger.LogInformation("Running Whisper local transcription...");
        string scriptPath = @"C:\transcribe.py";

        var startInfo = new ProcessStartInfo
        {
            FileName = "python",
            Arguments = $"\"{scriptPath}\" \"{audioFilePath}\"",
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false,
            CreateNoWindow = true
        };

        using var process = new Process { StartInfo = startInfo };
        process.Start();

        var output = await process.StandardOutput.ReadToEndAsync();
        var error = await process.StandardError.ReadToEndAsync();

        process.WaitForExit();

        if (process.ExitCode != 0)
        {
            _logger.LogError("Whisper script failed: " + error);
            _logger.LogInformation("Current directory: " + Directory.GetCurrentDirectory());

            throw new Exception("Whisper local transcription failed. Details: " + error);
        }


        _logger.LogInformation("Whisper local transcription completed.");
        return output.Trim();
    }
}
