namespace WebApiAngular.Server.Helpers
{
	using Microsoft.AspNetCore.Mvc;

	using WebApiAngular.Domain.Errors;

	public class HelperControllerBase : ControllerBase
	{
		protected IActionResult GetErrorActionResult(ErrorCode? errorCode)
		{
			ResponseError? responseError = null;
			if (errorCode is not null
				&& string.IsNullOrWhiteSpace(errorCode.Code) == false)
				responseError = new ResponseError(
					errorCode.Code,
					errorCode.Message,
					errorCode.ErrorDataInformation);

			return StatusCode(
				(int?)errorCode?.StatusCode ?? StatusCodes.Status400BadRequest, responseError);
		}

	}
}
