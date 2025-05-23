using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MagicalMusic.CORE.DTOs
{
    public class SongDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public string MusicStyle { get; set; }

        public int SongLength { get; set; }

        public DateTime ReleaseDate { get; set; }

        public int CreatorId { get; set; }
        public string S3Url { get; set; }
        public string Key { get; set; }  // שדה חדש למפתח ה-S3
        public string? ArtistName { get; set; }
        public string? Description { get; set; }


    }
}
