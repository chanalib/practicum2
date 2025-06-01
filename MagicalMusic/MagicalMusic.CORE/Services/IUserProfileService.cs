using MagicalMusic.CORE.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MagicalMusic.CORE.Services
{
    public interface IUserProfileService
    {
        Task<UserProfile> GetAsync(int id);
        Task<UserProfile> UpdateAsync(int id, UserProfile updated);
    }

}
