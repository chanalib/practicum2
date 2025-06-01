using MagicalMusic.CORE.DTOs;
using MagicalMusic.CORE.Models;
using MagicalMusic.CORE.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

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
        public async Task<IActionResult> GetAll()
        {
            var songs = await _songService.GetAllAsync();
            return Ok(songs);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var song = await _songService.GetByIdAsync(id);
            if (song == null) return NotFound();
            return Ok(song);
        }

        [HttpGet("creator/{creatorId}")]
        public async Task<IActionResult> GetByCreatorId(int creatorId)
        {
            var songs = await _songService.GetByCreatorIdAsync(creatorId);
            if (songs == null)
                return Ok(new List<Song>()); // או Ok(Enumerable.Empty<Song>());
            if (!songs.Any())
                return Ok(new List<Song>());
            return Ok(songs);

        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] SongDTO songDto)
        {
            var created = await _songService.AddAsync(songDto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // עדכון שיר קיים
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SongDTO songDto)
        {
            if (id != songDto.Id)
                return BadRequest("ID mismatch.");

            var updated = await _songService.UpdateAsync(songDto);
            if (updated == null)
                return NotFound();

            return Ok(updated);
        }

        // מחיקת שיר
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _songService.DeleteAsync(id);
            if (!deleted)
                return NotFound();

            return NoContent();
        }

        [HttpGet("playlist")]
        public async Task<IActionResult> GetSongsByIds([FromQuery] List<int> ids)
        {
            if (ids == null || !ids.Any())
                return BadRequest("Missing song IDs.");

            var songs = await _songService.GetSongsByIdsAsync(ids);
            return Ok(songs);
        }


    }
}
