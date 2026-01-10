using System.Text;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();

#region Authentication Configs

builder.Services.AddAuthentication(options =>
{
	options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
	options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddCookie(options =>
{
	options.Cookie.Name = "AuthToken"; // Consistent name
	options.Cookie.HttpOnly = true;
	options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
	options.Cookie.SameSite = SameSiteMode.Lax; // Lax is better for local Dev with different ports
	options.Events.OnRedirectToLogin = context =>
	{
		context.Response.StatusCode = StatusCodes.Status401Unauthorized;
		return Task.CompletedTask;
	};
})
.AddJwtBearer(options =>
{
	options.TokenValidationParameters = new TokenValidationParameters
	{
		ValidateIssuer = true,
		ValidateAudience = true,
		ValidateLifetime = true,
		ValidateIssuerSigningKey = true,
		ValidIssuer = builder.Configuration["Jwt:Issuer"],
		ValidAudience = builder.Configuration["Jwt:Audience"],
		IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
	};
	options.Events = new JwtBearerEvents
	{
		OnMessageReceived = context =>
		{
			// MUST match the Cookie.Name above
			context.Token = context.Request.Cookies["AuthToken"];
			return Task.CompletedTask;
		}
	};
});

#endregion Authentication Configs

#region CORS Configs

const string MyCorsPolicy = "AppDefaultCorsPolicy";

var allowedOrigins = builder.Configuration
	.GetSection("CorsSettings:AllowedOrigins")
	.Get<string[]>() ?? Array.Empty<string>();

builder.Services.AddCors(options =>
{
	options.AddPolicy(MyCorsPolicy, policy =>
	{
		if (allowedOrigins != null && allowedOrigins.Length > 0)
		{
			policy.WithOrigins(allowedOrigins)
				  .AllowAnyHeader()
				  .AllowAnyMethod()
				  .AllowCredentials()
				  .SetPreflightMaxAge(TimeSpan.FromMinutes(10));
		}
		else
		{
			// Only throw if NOT in development, or handle gracefully
			if (builder.Environment.IsDevelopment() == false)
				throw new InvalidOperationException("CORS Settings missing!");
		}
	});
});

#endregion CORS Configs

builder.Services.AddControllers();
var app = builder.Build();

// 2. Middleware Order is Critical
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseCors(MyCorsPolicy); // Must be after UseRouting and before UseAuthentication

app.UseAuthentication(); // Add this! You had UseAuthorization but were missing Authentication
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
	app.MapOpenApi();
	app.MapScalarApiReference();
}

app.MapControllers();
app.MapFallbackToFile("/index.html");
app.Run();
