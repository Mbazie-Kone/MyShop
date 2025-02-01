using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserService.Data;

namespace UserService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        //GET
        [HttpGet]
        public IActionResult Get()
        {

            return Ok("Hello World");
        }

    }
}
