using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MagicalMusic.CORE.Models
{
    public class Creator
    {

        public int Id { get; set; }

        public string Name { get; set; }
        public int SongCount { get; set; } // הוספה חדשה


        public List<Song> Song { get; set; }
    }
}
