using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Threading.Tasks;

namespace MagicalMusic.SERVICE
{
    public class S3Service
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;

        public S3Service(IAmazonS3 s3Client, IConfiguration configuration)
        {
            _s3Client = s3Client;
            _bucketName = configuration["AWS:BucketName"]!;
        }

        public async Task<(string Url, string Key)> UploadFileAsync(Stream fileStream, string fileName)
        {
            var transferUtility = new TransferUtility(_s3Client);

            var key = $"songs/{Guid.NewGuid()}_{fileName}";

            var uploadRequest = new TransferUtilityUploadRequest
            {
                InputStream = fileStream,
                BucketName = _bucketName,
                Key = key,
                ContentType = "audio/mpeg"
            };

            await transferUtility.UploadAsync(uploadRequest);

            return ($"https://{_bucketName}.s3.amazonaws.com/{key}", key);
        }


        public async Task<GetObjectResponse> GetFileAsync(string key)
        {
            try
            {
                var request = new GetObjectRequest
                {
                    BucketName = _bucketName,
                    Key = key
                };

                var response = await _s3Client.GetObjectAsync(request);
                return response;
            }
            catch (AmazonS3Exception)
            {
                return null;
            }
        }
        public string GetPresignedUrl(string key, bool forceDownload = false)
        {
            var fileName = Path.GetFileName(key);
            var encodedFileName = Uri.EscapeDataString(fileName);

            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = key,
                Expires = DateTime.UtcNow.AddMinutes(10),
                ResponseHeaderOverrides = new ResponseHeaderOverrides
                {
                    ContentDisposition = forceDownload
                        ? $"attachment; filename*=UTF-8''{encodedFileName}" // שורה זו גורמת להורדה
                        : $"inline; filename*=UTF-8''{encodedFileName}",
                    ContentType = "audio/mpeg"
                }
            };

            return _s3Client.GetPreSignedURL(request);
        }
        public async Task DeleteFileAsync(string key)
        {
            try
            {
                var deleteRequest = new DeleteObjectRequest
                {
                    BucketName = _bucketName,
                    Key = key
                };

                await _s3Client.DeleteObjectAsync(deleteRequest);
            }
            catch (AmazonS3Exception ex)
            {
                // אפשר להוסיף לוג או טיפול בחריגה לפי הצורך
                throw new Exception("Failed to delete file from S3.", ex);
            }
        }




    }
}

