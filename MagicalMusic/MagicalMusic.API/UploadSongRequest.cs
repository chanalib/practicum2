using Microsoft.AspNetCore.Http;
using System;

namespace MagicalMusic.API
{
    public class UploadSongRequest
    {
        public IFormFile File { get; set; }

        public string Name { get; set; }

        public string MusicStyle { get; set; }

        public TimeSpan SongLength { get; set; }

        public DateTime ReleaseDate { get; set; }

        public int CreatorId { get; set; }
    }
}
