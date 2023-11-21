using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class UnitController : BaseApiController
    {
        private readonly DataContext _context;

        public UnitController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Unit>>> GetUnits()
        {
            return await _context.Units.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Unit>> GetUnit(Guid id)
        {
            var unit = await _context.Units.FindAsync(id);
            return unit;
        }
    }
}