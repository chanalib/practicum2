using MagicalMusic.CORE.DTOs;
using MagicalMusic.CORE.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MagicalMusic.CORE.Services
{
    public interface ISongService
    {
        Task<SongDTO> AddAsync(SongDTO dto);
        Task<IEnumerable<SongDTO>> GetAllAsync();
        Task<SongDTO?> GetByIdAsync(int id);

        //public Task<IEnumerable<Song>> GetByCreatorIdAsync(int creatorId);
        //public Task<Song> UpdateAsync(int id, SongDTO song);
        //public Task DeleteAsync(int id);
    }
}
