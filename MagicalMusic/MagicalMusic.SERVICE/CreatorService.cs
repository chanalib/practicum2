using AutoMapper;
using MagicalMusic.CORE.DTOs;
using MagicalMusic.CORE.Models;
using MagicalMusic.CORE.Repositories;
using MagicalMusic.CORE.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace MagicalMusic.SERVICE
{
    public class CreatorService : ICreatorService
    {
        private readonly ICreatorRepository _creatorRepository;
        private readonly IMapper _mapper;

        public CreatorService(ICreatorRepository creatorRepository, IMapper mapper)
        {
            _creatorRepository = creatorRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CreatorDTO>> GetAllAsync()
        {
            var creators = await _creatorRepository.GetAllAsync();

            return creators.Select(c => new CreatorDTO
            {
                Id = c.Id, // <<< חובה
                Name = c.Name,
                SongCount = c.Song?.Count ?? 0
            });

        }
        public async Task<Creator> GetByIdAsync(int id) => await _creatorRepository.GetByIdAsync(id);
        public async Task<Creator> AddAsync(CreatorDTO creatorDto)
        {
            var creator = new Creator
            {
                Name = creatorDto.Name
                // אינך מוסיף שירים כאן – זה מתבצע במקום אחר
            };

            return await _creatorRepository.AddAsync(creator);
        }

        public async Task<Creator> UpdateAsync(int id, CreatorDTO creatorDto)
        {
            var existing = await _creatorRepository.GetByIdAsync(id);
            if (existing == null)
                return null;

            existing.Name = creatorDto.Name;
            // שוב, אינך משנה את השירים כאן

            await _creatorRepository.UpdateAsync(id, existing);
            return existing;
        }

        public async Task DeleteAsync(int id) => await _creatorRepository.DeleteAsync(id);

    }
}
