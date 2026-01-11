namespace WebApiAngular.Domain.Errors
{
	public class ResponseError
	{
		public ResponseError(string code, string? description, string? errorDataInformation = null)
		{
			Code = code;
			Description = description;
			ErrorDataInformation = errorDataInformation;
		}

		public string Code { get; set; }

		public string? Description { get; set; }

		public string? ErrorDataInformation { get; set; }
	}
}
