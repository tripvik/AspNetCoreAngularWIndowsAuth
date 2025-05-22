using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AspNetCoreAngularWIndowsAuth.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetWeatherForecast")]
        public IEnumerable<WeatherForecast> Get()
        {
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }


        [HttpGet("username")]
        [Authorize]
        public IActionResult GetUsername()
        {
            if (User.Identity != null && User.Identity.IsAuthenticated)
            {
                return Ok(new { username = User.Identity.Name });
            }
            return Unauthorized();
        }

        [HttpGet("claims")]
        [Authorize]
        public IActionResult GetUserClaims()
        {
            if (User.Identity != null && User.Identity.IsAuthenticated)
            {
                var claims = User.Claims.Select(c => new { type = c.Type, value = c.Value }).ToList();
                return Ok(claims);
            }

            return Unauthorized();
        }
    }
}
