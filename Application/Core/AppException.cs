namespace Application.Core
{
    public class AppException
    {
        public AppException(int statusCod, string message, string details = null)
        {
            StatusCod = statusCod;
            Message = message;
            Details = details;
        }

        public int StatusCod { get; set; }
        public string Message { get; set; }
        public string Details { get; set; }
    }
}