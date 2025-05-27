using MagicalMusic.CORE.Models;
using MagicalMusic.DATA;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Runtime.Serialization.DataContracts;

namespace MagicalMusic.API.Controllers
{
    [ApiController]
    [Route("api/messages")]
    public class MessagesController : ControllerBase
    {
        private readonly DataContext _context;

        public MessagesController(DataContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] Message message)
        {
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetMessages()
        {
            var messages = await _context.Messages
                .OrderByDescending(m => m.SentAt)
                .ToListAsync();
            return Ok(messages);
        }
    }

}
