using MagicalMusic.CORE.Models;
using MagicalMusic.DATA;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace MagicalMusic.CORE.Repositories
{
    public class UserProfileRepository
    {
        private readonly DataContext _context;

        public UserProfileRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<UserProfile> GetUserProfileAsync(int userId)
        {
            return await _context.UserProfiles.FirstOrDefaultAsync(u => u.Id == userId);
        }

        public async Task UpdateUserProfileAsync(UserProfile userProfile)
        {
            _context.UserProfiles.Update(userProfile);
            await _context.SaveChangesAsync();
        }
    }
}
