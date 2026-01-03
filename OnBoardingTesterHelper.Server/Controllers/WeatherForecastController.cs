using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace OnBoardingTesterHelper.Server.Controllers
{
	[Authorize]
	[ApiController]
	[Route("api/[controller]")]
	public class WeatherForecastController : ControllerBase
	{
		private static readonly string[] _Summaries =
		[
			"Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
		];

		[HttpGet]
		public IEnumerable<WeatherForecast> Get()
		{
			var username = User.Identity?.Name;

			return Enumerable.Range(1, 5).Select(index => new WeatherForecast
			{
				Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
				TemperatureC = Random.Shared.Next(-20, 55),
				Summary = _Summaries[Random.Shared.Next(_Summaries.Length)]
			})
			.ToArray();
		}
	}
}
