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
        public string GetPresignedUrl(string key)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = key,
                Expires = DateTime.UtcNow.AddMinutes(10)
            };

            return _s3Client.GetPreSignedURL(request);
        }

    }
}


//public async Task<Stream> DownloadFileAsync(string fileName)
//{
//    var request = new GetObjectRequest
//    {
//        BucketName = _bucketName,
//        Key = fileName
//    };


//    var response = await _s3Client.GetObjectAsync(request);
//    return response.ResponseStream;
//}


//public async Task<bool> DeleteFileAsync(string fileName)
//{
//    try
//    {
//        var request = new DeleteObjectRequest
//        {
//            BucketName = _bucketName,
//            Key = fileName
//        };

//        var response = await _s3Client.DeleteObjectAsync(request);
//        return response.HttpStatusCode == HttpStatusCode.NoContent; // בדוק אם המחיקה הצליחה
//    }
//    catch (Exception ex)
//    {
//        // אפשר ללוג את השגיאה כאן אם תרצה
//        return false;
//    }
//}

//// ✅ פונקציה לקבלת רשימת הקבצים ב-S3
//public async Task<List<string>> ListFilesAsync()
//{
//    var request = new ListObjectsV2Request
//    {
//        BucketName = _bucketName
//    };

//    var response = await _s3Client.ListObjectsV2Async(request);
//    var fileNames = new List<string>();

//    foreach (var obj in response.S3Objects)
//    {
//        fileNames.Add(obj.Key);
//    }

//    return fileNames;
//}
//public async Task<string> GetPreSignedUrlAsync(string fileName)
//{
//    var request = new GetPreSignedUrlRequest
//    {
//        BucketName = _bucketName,
//        Key = $"Audio/{fileName}",
//        Verb = HttpVerb.GET,
//        Expires = DateTime.UtcNow.AddMinutes(10),
//        ContentType = "audio/mpeg"
//    };

//    return _s3Client.GetPreSignedURL(request);
//}

//public async Task<List<string>> GetByCreatorIdAsync(int creatorId)
//{
//    var songs = new List<string>();

//    // הנחה שהשירים נשמרים בתיקייה עם שם היוצר
//    var creatorFolder = $"Audio/{creatorId}/"; // או כל מבנה תיקיות אחר שאתה משתמש בו

//    // קבלת רשימת הקבצים בתיקייה של היוצר
//    var listResponse = await _s3Client.ListObjectsAsync(new ListObjectsRequest
//    {
//        BucketName = _bucketName,
//        Prefix = creatorFolder
//    });

//    foreach (var obj in listResponse.S3Objects)
//    {
//        songs.Add(obj.Key); // הוספת שם הקובץ לרשימה
//    }

//    return songs;
//}
//// פונקציה לבדיקה עצמית של חיבור תקין ל-S3
//public async Task<bool> TestS3ConnectionAsync()
//{
//    try
//    {
//        var testKey = "test.txt"; // ודא שקובץ זה קיים ב-S3 שלך
//        var response = await _s3Client.GetObjectAsync(_bucketName, testKey);
//        return response.HttpStatusCode == HttpStatusCode.OK;
//    }
//    catch (AmazonS3Exception ex)
//    {
//        Console.WriteLine($"S3 Error: {ex.Message}");
//        return false;
//    }
//    catch (Exception ex)
//    {
//        Console.WriteLine($"General Error: {ex.Message}");
//        return false;
//    }
//}