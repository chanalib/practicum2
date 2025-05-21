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


        //לקבלת כל השירים
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
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] SongDTO songDto)
        {
            var created = await _songService.AddAsync(songDto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        //  [Authorize(Roles = "Admin")]

        //[HttpGet("byCreator/{creatorId}")]
        //public async Task<IActionResult> GetSongsByCreatorId(int creatorId)
        //{
        //    var songs = await _songService.GetByCreatorIdAsync(creatorId);

        //    if (songs == null || !songs.Any())
        //    {
        //        return NotFound("No songs found for this creator.");
        //    }

        //    return Ok(songs);
        //}



        //  [Authorize(Roles = "Admin")]
        //[HttpPut("{id}")]
        //public async Task<IActionResult> Update(int id, [FromBody] SongDTO song)
        //{
        //    Song s = await _songService.UpdateAsync(id, song);
        //    if (s == null)
        //    {
        //        return NotFound();
        //    }
        //    return Ok(s);
        //}

        ////   [Authorize(Roles = "Admin")]
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> Delete(int id)
        //{
        //    await _songService.DeleteAsync(id);
        //    return NoContent();
        //}
    }
}
