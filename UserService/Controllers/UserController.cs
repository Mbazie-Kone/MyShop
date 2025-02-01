using Microsoft.AspNetCore.Mvc;

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
