﻿using MagicalMusic.CORE.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MagicalMusic.CORE.Services
{
    public interface ISongService
    {
        Task<SongDTO> AddAsync(SongDTO dto);
        Task<IEnumerable<SongDTO>> GetAllAsync();
        Task<SongDTO?> GetByIdAsync(int id);

        // הוסף כאן:
        Task<IEnumerable<SongDTO>> GetByCreatorIdAsync(int creatorId);
    }
}
