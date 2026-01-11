namespace WebApiAngular.Domain.Errors
{
	public sealed class ErrorCode
	{
		public static readonly ErrorCode RandomError = new(nameof(RandomError), "An error occur.", StatusCodeEnum.Problem);
		public static readonly ErrorCode RandomBadRequest = new(nameof(RandomBadRequest), "Bad request, error not detected.", StatusCodeEnum.BadRequest);

		public static readonly ErrorCode InvalidCredentials = new(nameof(InvalidCredentials), "Invalid username or password.", StatusCodeEnum.Unauthorized);
		public static readonly ErrorCode UnauthorizedUser = new(nameof(UnauthorizedUser), "The user is unauthorized for this action.", StatusCodeEnum.Unauthorized);


		public ErrorCode(string code, string message, StatusCodeEnum statusCode, string? errorDataInformation = null)
		{
			Code = code;
			Message = message;
			StatusCode = statusCode;
			ErrorDataInformation = errorDataInformation;
		}

		public string Code { get; set; }

		public string Message { get; set; }

		public StatusCodeEnum StatusCode { get; set; }

		public string? ErrorDataInformation { get; set; }
	}
}
