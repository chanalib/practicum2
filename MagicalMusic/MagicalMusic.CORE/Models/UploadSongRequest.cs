using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace MagicalMusic.CORE.Models
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
