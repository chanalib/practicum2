﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MagicalMusic.CORE.DTOs
{
    public class SongDTO
    {
        public string Name { get; set; }

        public string MusicStyle { get; set; }

        public TimeSpan SongLength { get; set; }

        public DateTime ReleaseDate { get; set; }

        public string ImageUrl { get; set; }

        public int CreatorId { get; set; }
    }
}
