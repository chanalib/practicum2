using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MagicalMusic.CORE.Models
{
    public class UserProfile
    {
        public int Id { get; set; } // מפתח ראשי
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Avatar { get; set; }

        public int TotalLikedSongs { get; set; }
        public List<string> FavoriteGenres { get; set; } = new List<string>();
        public int ListeningTime { get; set; } // בדקות
        public DateTime JoinDate { get; set; }
        public DateTime LastActive { get; set; }
    }

}
