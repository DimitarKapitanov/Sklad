using Application.Core;

namespace Application.Partners
{
    public class PartnerOrderParams : PagingParams
    {
        public bool IsActive { get; set; }
        public bool IsCompleted { get; set; }
        public string Search { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string SearchBy { get; set; }
    }
}