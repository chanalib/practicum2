using MagicalMusic.CORE.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MagicalMusic.CORE.Repositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllAsync();
        Task<User> GetByIdAsync(int id);
        Task<User> AddAsync(User user);
        Task<User> UpdateAsync(int id, User user);
        Task DeleteAsync(int id);
        Task<User> GetByEmailAsync(string email); // הוספת המתודה GetByEmailAsync
                                                  // User GetUserByCredentials(string userName, string userPassword); // ניתן להוריד מתודה זו
    }
}
