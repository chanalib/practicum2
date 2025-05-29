using Microsoft.AspNetCore.Mvc;
using MagicalMusic.API.Services;
using MagicalMusic.CORE.DTOs;
using MagicalMusic.CORE.Services;

namespace MagicalMusic.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AiController : ControllerBase
    {
        private readonly IOpenAiWhisperService _openAiWhisperService;
        private readonly ILogger<AiController> _logger;

        public AiController(IOpenAiWhisperService openAiWhisperService, ILogger<AiController> logger)
        {
            _openAiWhisperService = openAiWhisperService;
            _logger = logger;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] IFormFile audioFile, [FromForm] string language = "he")
        {
            _logger.LogInformation("Upload request received");

            if (audioFile == null || audioFile.Length == 0)
            {
                _logger.LogWarning("No audio file was provided.");
                return BadRequest("No audio file was provided.");
            }

            string[] allowedExtensions = { ".mp3", ".wav", ".m4a", ".ogg", ".flac", ".webm", ".mp4", ".mpeg", ".mpga", ".oga" };
            var fileExt = Path.GetExtension(audioFile.FileName).ToLowerInvariant();
            var contentType = audioFile.ContentType?.ToLowerInvariant();

            _logger.LogInformation("File name: {FileName}, Extension: {Ext}, Content-Type: {ContentType}", audioFile.FileName, fileExt, contentType);

            if (!allowedExtensions.Contains(fileExt))
            {
                _logger.LogWarning("Unsupported file extension: {Ext}", fileExt);
                return BadRequest($"Unsupported audio format. Allowed formats: {string.Join(", ", allowedExtensions)}");
            }

            if (audioFile.Length > 25 * 1024 * 1024)
            {
                _logger.LogWarning("File too large: {Size} bytes", audioFile.Length);
                return BadRequest("File size exceeds the 25MB limit");
            }

            var tempDir = Path.Combine(Path.GetTempPath(), "AudioTranscriptions");
            Directory.CreateDirectory(tempDir);

            var tempFilePath = Path.Combine(tempDir, $"{Guid.NewGuid()}{fileExt}");

            try
            {
                using (var stream = System.IO.File.Create(tempFilePath))
                {
                    await audioFile.CopyToAsync(stream);
                }

                _logger.LogInformation("File saved temporarily to: {TempFile}", tempFilePath);

                // כאן מעבירים את פרמטר השפה ל-Service
                var transcript = await _openAiWhisperService.TranscribeAsync(tempFilePath, language);

                _logger.LogInformation("Transcription successful");

                return Ok(new TranscriptionResultDto
                {
                    FileName = audioFile.FileName,
                    Text = transcript
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to transcribe audio file.");
                return StatusCode(500, new { error = ex.Message });
            }
            finally
            {
                try
                {
                    if (System.IO.File.Exists(tempFilePath))
                    {
                        System.IO.File.Delete(tempFilePath);
                        _logger.LogInformation("Temporary file deleted: {TempFile}", tempFilePath);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to delete temporary file: {TempFile}", tempFilePath);
                }
            }
        }
    }
}
