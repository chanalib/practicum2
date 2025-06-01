using MagicalMusic.CORE.Models;
using MagicalMusic.CORE.Repositories;
using System.Threading.Tasks;

namespace MagicalMusic.SERVICE
{
    public class UserProfileService
    {
        private readonly UserProfileRepository _repository;

        public UserProfileService(UserProfileRepository repository)
        {
            _repository = repository;
        }

        public async Task<UserProfile> GetUserProfileAsync(int userId)
        {
            return await _repository.GetUserProfileAsync(userId);
        }

        public async Task UpdateUserProfileAsync(UserProfile userProfile)
        {
            await _repository.UpdateUserProfileAsync(userProfile);
        }
    }
}
