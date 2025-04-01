using Amazon.S3.Model;
using Amazon.S3;
using MagicalMusic.CORE.Services;
using MagicalMusic.SERVICE;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;
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

        // API להעלאת קובץ
        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadFile([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("File is empty.");

            using var stream = file.OpenReadStream();
            var url = await _s3Service.UploadFileAsync(stream, file.FileName);

            return Ok(new { Url = url });
        }

        // API להורדת קובץ
        [HttpGet("download/{fileName}")]
        public async Task<IActionResult> DownloadFile(string fileName)
        {
            var stream = await _s3Service.DownloadFileAsync(fileName);
            return File(stream, "audio/mpeg", fileName); // שונה ל-"audio/mpeg" עבור קבצי MP3
        }

        [HttpDelete("delete/{fileName}")]
        public async Task<IActionResult> DeleteFile(string fileName)
        {
            var success = await _s3Service.DeleteFileAsync(fileName);
            if (!success)
                return NotFound("File not found.");

            return Ok("File deleted successfully.");
        }

        // API לקבלת רשימת קבצים
        [HttpGet("files")]
        public async Task<IActionResult> ListFiles()
        {
            var files = await _s3Service.ListFilesAsync();
            return Ok(files);
        }

        [HttpGet("byCreator/{creatorId}")]
        public async Task<IActionResult> GetSongsByCreatorId(int creatorId)
        {
            var songs = await _s3Service.GetByCreatorIdAsync(creatorId);

            if (songs == null || !songs.Any())
            {
                return NotFound("No songs found for this creator.");
            }

            return Ok(songs);
        }

        [HttpGet("presigned-url")]
        public async Task<IActionResult> GetPresignedUrl([FromQuery] string fileName)
        {
            if (string.IsNullOrEmpty(fileName))
                return BadRequest("שם הקובץ נדרש");

            try
            {
                string url = await _s3Service.GetPreSignedUrlAsync(fileName);
                return Ok(new { url });
            }
            catch (AmazonS3Exception ex)
            {
                return StatusCode(500, $"שגיאה ביצירת URL עם הרשאות: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"שגיאה כללית: {ex.Message}");
            }
        }
    }
}
