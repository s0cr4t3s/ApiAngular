namespace WebApiAngular.Server.Controllers
{
	using Microsoft.AspNetCore.Authorization;
	using Microsoft.AspNetCore.Mvc;

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
		[EndpointSummary("Get the weather xpto.")]
		[ProducesResponseType(typeof(WeatherForecast[]), StatusCodes.Status200OK)]
		public IEnumerable<WeatherForecast> Get([FromQuery] string? local = null)
		{
			Thread.Sleep(2000);

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
