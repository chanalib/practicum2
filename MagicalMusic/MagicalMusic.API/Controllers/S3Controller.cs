using Amazon.S3.Model;
using Amazon.S3;
using MagicalMusic.CORE.Services;
using MagicalMusic.SERVICE;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;
using MagicalMusic.CORE.DTOs;
using System;
using System.Linq;

namespace MagicalMusic.API.Controllers
{
    [ApiController]
    [Route("api/s3")]
    public class S3Controller : ControllerBase
    {
        private readonly S3Service _s3Service;

        public S3Controller(S3Service s3Service)
        {
            _s3Service = s3Service;
        }

        // להעלאת קובץ
        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadFile([FromForm] UploadSongRequest request, [FromServices] ISongService songService)
        {
            if (request.File == null || request.File.Length == 0)
                return BadRequest("File is empty.");

            var allowedExtensions = new[] { ".mp3", ".wav" };
            var fileExtension = Path.GetExtension(request.File.FileName).ToLower();

            if (!allowedExtensions.Contains(fileExtension))
                return BadRequest("רק קבצי MP3 או WAV מותרים.");

            using var stream = request.File.OpenReadStream();

            var (url, key) = await _s3Service.UploadFileAsync(stream, request.File.FileName);

            var songDto = new SongDTO
            {
                Name = request.Name,
                MusicStyle = request.MusicStyle,
                SongLength = (int)request.SongLength.TotalSeconds,
                ReleaseDate = request.ReleaseDate,
                CreatorId = request.CreatorId,
                S3Url = url,
                Key = key
            };

            var savedSong = await songService.AddAsync(songDto);

            return Ok(new
            {
                Song = savedSong,
                S3Url = url
            });
        }


        // API להורדת קובץ
        [HttpGet("download")]
        public async Task<IActionResult> DownloadFile([FromQuery] string key)
        {
            if (string.IsNullOrWhiteSpace(key))
                return BadRequest("Key is required.");

            var response = await _s3Service.GetFileAsync(key);
            if (response == null || response.ResponseStream == null || response.Headers.ContentLength == 0)
                return NotFound("File not found or empty.");

            var contentType = response.Headers.ContentType ?? "application/octet-stream";
            var fileName = Path.GetFileName(key);

            return File(response.ResponseStream, contentType, fileName);
        }


        [HttpGet("presigned-url")]
        public IActionResult GetPresignedUrl([FromQuery] string key, [FromQuery] bool download = false)
        {
            var url = _s3Service.GetPresignedUrl(key, download);
            return Ok(url);
        }

    }
}

