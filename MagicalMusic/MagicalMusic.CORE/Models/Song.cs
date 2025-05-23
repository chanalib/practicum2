using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MagicalMusic.CORE.Models
{
    public class Song
    {

        public int Id { get; set; }

        public string Name { get; set; }

        public string MusicStyle { get; set; }

        public int SongLength { get; set; }

        public DateTime ReleaseDate { get; set; }

        public string S3Url { get; set; }
        public int creatorId { get; set; }

        public Creator Creator { get; set; }

        public ICollection<User> Users { get; set; }
        public string Key { get; set; }  // שדה חדש למפתח ה-S3
        public string? ArtistName { get; set; }      // שם האמן
        public string? Description { get; set; }     // תיאור השיר


    }
}
