namespace WebApiAngular.Server.Controllers
{
	using Microsoft.AspNetCore.Authorization;
	using Microsoft.AspNetCore.Mvc;

	using WebApiAngular.Domain.Errors;

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
		[ProducesResponseType(StatusCodes.Status200OK, Type = typeof(WeatherForecast[]))]
		[ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(ResponseError[]))]
		public IActionResult Get([FromQuery] string? local = null)
		{
			//Thread.Sleep(2000);

			var username = User.Identity?.Name;

			return Ok(Enumerable.Range(1, 5).Select(index => new WeatherForecast
			{
				Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
				TemperatureC = Random.Shared.Next(-20, 55),
				Summary = _Summaries[Random.Shared.Next(_Summaries.Length)]
			})
			.ToArray());
		}
	}
}
