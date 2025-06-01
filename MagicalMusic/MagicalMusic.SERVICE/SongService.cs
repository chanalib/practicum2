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
        private readonly S3Service _s3Service;


        public SongService(ISongRepository songRepository, IMapper mapper, S3Service s3Service)
        {
            _songRepository = songRepository;
            _mapper = mapper;
            _s3Service = s3Service;

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

        public async Task<SongDTO?> UpdateAsync(SongDTO dto)
        {
            var existing = await _songRepository.GetByIdAsync(dto.Id);
            if (existing == null) return null;

            var updatedEntity = _mapper.Map(dto, existing);
            var updated = await _songRepository.UpdateAsync(updatedEntity);
            return _mapper.Map<SongDTO>(updated);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var song = await _songRepository.GetByIdAsync(id);
            if (song == null) return false;

            await _songRepository.DeleteAsync(song);
            if (!string.IsNullOrEmpty(song.Key))
            {
                await _s3Service.DeleteFileAsync(song.Key); // מחיקת קובץ מה־S3
            }
            return true;
        }

        public async Task<IEnumerable<SongDTO>> GetSongsByIdsAsync(List<int> ids)
        {
            var songs = await _songRepository.GetSongsByIdsAsync(ids);
            return songs.Select(song => new SongDTO
            {
                Id = song.Id,
                Name = song.Name,
                CreatorId = song.CreatorId,
                MusicStyle = song.MusicStyle,
                SongLength = song.SongLength,
                S3Url = song.S3Url,
                Key = song.Key
                // הוסף עוד שדות אם קיימים ב־DTO שלך
            });
        }



    }
}
