﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace UserService.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserServiceController : ControllerBase
    {
        [HttpGet]
        [Route("find")]
        [Produces("application/json")]
        public IActionResult GetUsers()
        {
            return Ok("Hello World");
        }
    }
}
