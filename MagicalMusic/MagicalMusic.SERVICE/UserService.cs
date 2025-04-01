using AutoMapper;
using MagicalMusic.CORE.DTOs;
using MagicalMusic.CORE.Models;
using MagicalMusic.CORE.Repositories;
using MagicalMusic.CORE.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MagicalMusic.SERVICE
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;


        public UserService(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<User>> GetAllAsync() => await _userRepository.GetAllAsync();
        public async Task<User> GetByIdAsync(int id) => await _userRepository.GetByIdAsync(id);
        public async Task<User> AddAsync(UserDTO userDto)
        {
            var user = new User
            {
                Name = $"{userDto.Name}", // שילוב השמות
                Email = userDto.Email,
                Password = userDto.Password,

               Role = "user"
            };

            return await _userRepository.AddAsync(user);
        }

        public async Task<User> UpdateAsync(int id, UserDTO userDto)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return null;

            user.Name = $"{userDto.Name}"; // עדכון השם
            user.Email = userDto.Email;
            user.Password = userDto.Password;
           

            return await _userRepository.UpdateAsync(id, user);
        }

        public async Task DeleteAsync(int id) => await _userRepository.DeleteAsync(id);
        public User Authenticate(string email, string userPassword)
        {
            // בדיקה אם המשתמש קיים במאגר הנתונים
            var user = _userRepository.GetByEmailAsync(email).Result; // קבלת המשתמש לפי מייל
            if (user != null && BCrypt.Net.BCrypt.Verify(userPassword, user.Password)) // בדוק אם הסיסמה נכונה
            {
                user.Role = "user"; // משתמש רגיל
                return user;
            }

            // אם המשתמש לא נמצא במערכת → הוא "צופה"
            return new User
            {
                Name = email,
                Password = userPassword,
                Role = "viewer" // תפקיד "צופה"
            };
        }


    }
}
