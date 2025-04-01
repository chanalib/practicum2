using Microsoft.AspNetCore.Mvc;
using MagicalMusic.CORE.Models;
using MagicalMusic.CORE.DTOs;
using MagicalMusic.CORE.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace MagicalMusic.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SongController : ControllerBase
    {
        private readonly ISongService _songService;
        public SongController(ISongService songService)
        {
            _songService = songService;
        }


        [HttpGet]
        public async Task<IEnumerable<Song>> GetAll()
        {
            return await _songService.GetAllAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Song>> GetById(int id)
        {
            var song = await _songService.GetByIdAsync(id);
            if (song == null) return NotFound();
            return song;
        }

        //  [Authorize(Roles = "Admin")]

        [HttpGet("byCreator/{creatorId}")]
        public async Task<IActionResult> GetSongsByCreatorId(int creatorId)
        {
            var songs = await _songService.GetByCreatorIdAsync(creatorId);

            if (songs == null || !songs.Any())
            {
                return NotFound("No songs found for this creator.");
            }

            return Ok(songs);
        }

        [HttpPost]
        public async Task<ActionResult<Song>> Add([FromBody] SongDTO songDto)
        {
            //if (  string.IsNullOrEmpty(songDto.Name)|| songDto == null)
            //{
            //    return BadRequest("Song data and Name are required.");
            //}

            var song = await _songService.AddAsync(songDto);
            return CreatedAtAction(nameof(GetById), new { id = song.Id }, song);
        }





        //  [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SongDTO song)
        {
            Song s = await _songService.UpdateAsync(id, song);
            if (s == null)
            {
                return NotFound();
            }
            return Ok(s);
        }

        //   [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _songService.DeleteAsync(id);
            return NoContent();
        }
    }
}
