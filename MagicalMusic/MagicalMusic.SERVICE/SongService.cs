using AutoMapper;
using MagicalMusic.CORE.DTOs;
using MagicalMusic.CORE.Models;
using MagicalMusic.CORE.Repositories;
using MagicalMusic.CORE.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MagicalMusic.SERVICE
{
    public class SongService : ISongService
    {
        private readonly ISongRepository _songRepository;
        private readonly IMapper _mapper;

        public SongService(ISongRepository songRepository, IMapper mapper)
        {
            _songRepository = songRepository;
            _mapper = mapper;
        }

        public async Task<SongDTO> AddAsync(SongDTO dto)
        {
            var entity = _mapper.Map<Song>(dto);
            var added = await _songRepository.AddAsync(entity);
            return _mapper.Map<SongDTO>(added);
        }

        public async Task<IEnumerable<SongDTO>> GetAllAsync()
        {
            var songs = await _songRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<SongDTO>>(songs);
        }

        public async Task<SongDTO?> GetByIdAsync(int id)
        {
            var song = await _songRepository.GetByIdAsync(id);
            return song != null ? _mapper.Map<SongDTO>(song) : null;
        }

        // הוסף כאן:
        public async Task<IEnumerable<SongDTO>> GetByCreatorIdAsync(int creatorId)
        {
            var songs = await _songRepository.GetByCreatorIdAsync(creatorId);
            return _mapper.Map<IEnumerable<SongDTO>>(songs);
        }
    }
}
