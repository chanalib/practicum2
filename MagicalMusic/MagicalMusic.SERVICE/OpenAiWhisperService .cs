using MagicalMusic.CORE.Models;
using MagicalMusic.CORE.Services;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Text.Json;

namespace MagicalMusic.API.Services
{
   

    public class OpenAiWhisperService : IOpenAiWhisperService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public OpenAiWhisperService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _apiKey = config["OpenAI:ApiKey"] ?? throw new ArgumentNullException("Missing OpenAI:ApiKey in configuration.");
        }

        public async Task<string> TranscribeAsync(string filePath, string language)
        {
            using var fileStream = File.OpenRead(filePath);
            using var form = new MultipartFormDataContent();

            var fileContent = new StreamContent(fileStream);
            var contentType = filePath.EndsWith(".wav", StringComparison.OrdinalIgnoreCase) ? "audio/wav" : "audio/mpeg";
            fileContent.Headers.ContentType = new MediaTypeHeaderValue(contentType);

            form.Add(fileContent, "file", Path.GetFileName(filePath));
            form.Add(new StringContent("whisper-1"), "model");

            // הוספת פרמטר שפה לבקשה
            form.Add(new StringContent(language), "language");

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

            var response = await _httpClient.PostAsync("https://api.openai.com/v1/audio/transcriptions", form);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"Whisper API error: {error}");
            }

            var json = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<TranscriptionResponse>(json);

            return result?.Text ?? throw new Exception("Failed to parse Whisper response.");
        }
    }
}
