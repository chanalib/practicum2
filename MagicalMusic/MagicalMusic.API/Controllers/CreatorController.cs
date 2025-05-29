﻿using MagicalMusic.CORE.DTOs;
using MagicalMusic.CORE.Models;
using MagicalMusic.CORE.Services;
using Microsoft.AspNetCore.Mvc;
using MagicalMusic.SERVICE;


namespace MagicalMusic.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CreatorController : ControllerBase
    {
        private readonly ICreatorService _creatorService;
        public CreatorController(ICreatorService creatorService)
        {
            _creatorService = creatorService;
        }


        [HttpGet]
        public async Task<IEnumerable<CreatorDTO>> GetAll()
        {
            return await _creatorService.GetAllAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Creator>> GetById(int id)
        {
            var Creator = await _creatorService.GetByIdAsync(id);
            if (Creator == null) return NotFound();
            return Creator;
        }

        [HttpPost]
        public async Task<ActionResult<Creator>> Add([FromBody] CreatorDTO creatorDTO)
        {

            var creator = await _creatorService.AddAsync(creatorDTO);
            return CreatedAtAction(nameof(GetById), new { id = creator.Id }, creator);

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreatorDTO Creator)
        {

            Creator s = await _creatorService.UpdateAsync(id, Creator);
            if (s == null)
            {
                return NotFound();
            }
            return Ok(s);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _creatorService.DeleteAsync(id);
            return NoContent();
        }
    }
}
