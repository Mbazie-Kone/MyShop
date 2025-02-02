using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace UserService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserServiceController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetUsers()
        {
            return Ok("Hello World");
        }
    }
}
