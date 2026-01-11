namespace WebApiAngular.Server.Controllers
{
	using System.IdentityModel.Tokens.Jwt;
	using System.Security.Claims;
	using System.Text;

	using Microsoft.AspNetCore.Authorization;
	using Microsoft.AspNetCore.Mvc;
	using Microsoft.IdentityModel.Tokens;

	using WebApiAngular.Domain.Errors;
	using WebApiAngular.Server.Helpers;

	[ApiController]
	[Route("api/[controller]")]
	public class AuthController : HelperControllerBase
	{
		private readonly IConfiguration _config;

		public AuthController(IConfiguration config)
		{
			_config = config;
		}

		[HttpPost("login")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized, Type = typeof(ResponseError[]))]
		public IActionResult Login([FromBody] LoginRequest request)
		{
			Thread.Sleep(2000);

			// 1. Validate User (Replace this with your Database check)
			if (request.Username != "admin" || request.Password != "password")
			{
				return GetErrorActionResult(ErrorCode.InvalidCredentials);
			}

			// 2. Generate the JWT
			var token = GenerateToken(request.Username);

			// 3. Set the Cookie
			var cookieOptions = new CookieOptions
			{
				HttpOnly = true,   // Security: Prevents JS access
				Secure = true,     // Security: Sent only over HTTPS
				SameSite = SameSiteMode.Lax, // Needed for cross-port dev (localhost:4200 vs 5001)
				Expires = DateTime.UtcNow.AddHours(8)
			};

#if DEBUG
			cookieOptions.Secure = false;
#endif

			Response.Cookies.Append("AuthToken", token, cookieOptions);

			return Ok();
		}

		private string GenerateToken(string username)
		{
			var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
			var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha512);

			var claims = new[]
			{
				new Claim(ClaimTypes.Name, username),
				new Claim(ClaimTypes.Role, "Admin")
			};

			var token = new JwtSecurityToken(
				issuer: _config["Jwt:Issuer"],
				audience: _config["Jwt:Audience"],
				claims: claims,
				expires: DateTime.Now.AddHours(8),
				signingCredentials: credentials);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}

		[HttpPost("logout")]
		public IActionResult Logout()
		{
			// This tells the browser to remove the AuthToken cookie immediately
			Response.Cookies.Delete("AuthToken", new CookieOptions
			{
				HttpOnly = true,
				Secure = true,
				SameSite = SameSiteMode.Lax
			});

			return Ok();
		}

		[Authorize]
		[HttpGet("current-user")]
		public IActionResult GetCurrentUser()
		{
			// This pulls the name and role we stored in the JWT claims earlier
			return Ok(new
			{
				username = User.Identity?.Name,
				roles = User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value)
			});
		}
	}

	public record LoginRequest(string Username, string Password);
}
