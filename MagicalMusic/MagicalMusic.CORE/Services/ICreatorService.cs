using MagicalMusic.CORE.DTOs;
using MagicalMusic.CORE.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace MagicalMusic.CORE.Services
{
    public interface ICreatorService
    {
        Task<IEnumerable<CreatorDTO>> GetAllAsync();
        Task<Creator> GetByIdAsync(int id);
        Task<Creator> AddAsync(CreatorDTO creatorDto);
        Task<Creator> UpdateAsync(int id, CreatorDTO creatorDto);
        Task DeleteAsync(int id);
    }
}
