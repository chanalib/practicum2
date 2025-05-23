using MagicalMusic.CORE.Models;
using MagicalMusic.CORE.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;
using MagicalMusic.CORE;
using MagicalMusic.DATA;


namespace MagicalMusic.DATA.Repositories
{
    public class SongRepository : ISongRepository
    {
        private readonly DataContext _context;
        public SongRepository(DataContext context) 
        { _context = context; }



        public async Task<Song> AddAsync(Song song)
        {


            _context.Songs.Add(song);
            await _context.SaveChangesAsync();
            return song;
        }

        public async Task<IEnumerable<Song>> GetAllAsync()
        {
            return await _context.Songs.Include(s => s.Creator).ToListAsync();
        }


        public async Task<Song?> GetByIdAsync(int id)
        {
            return await _context.Songs.FindAsync(id);
        }
   
    }
}
