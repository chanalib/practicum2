using MagicalMusic.CORE.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MagicalMusic.CORE.Repositories
{
    public interface ISongRepository
    {
        Task<Song> AddAsync(Song song);
        Task<IEnumerable<Song>> GetAllAsync();
        Task<Song?> GetByIdAsync(int id);

        // הוסף כאן:
        Task<IEnumerable<Song>> GetByCreatorIdAsync(int creatorId);
    }
}
