﻿using catalog_service.Data;
using catalog_service.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace catalog_service.Controllers
{
    [Route("api/catalog")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ImageController(AppDbContext context)
        {
            _context = context;
        }

        // GET:

        // Get all images
        public async Task<ActionResult<IEnumerable<Image>>> GetImages()
        {
            return await _context.Images.Include(i => i.Product).ToListAsync();
        }
    }
}
