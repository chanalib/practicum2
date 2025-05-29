using MagicalMusic.CORE.Models;
using MagicalMusic.CORE.Repositories;
using MagicalMusic.DATA;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MagicalMusic.DATA.Repositories
{
    public class SongRepository : ISongRepository
    {
        private readonly DataContext _context;
        public SongRepository(DataContext context)
        {
            _context = context;
        }

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

        // הוסף כאן:
        public async Task<IEnumerable<Song>> GetByCreatorIdAsync(int creatorId)
        {
            return await _context.Songs
                .Where(s => s.CreatorId == creatorId) // ← זה התיקון הקריטי
                .Include(s => s.Creator)
                .ToListAsync();
        }

    }
}
