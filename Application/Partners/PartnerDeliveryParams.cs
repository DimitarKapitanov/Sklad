using Application.Core;

namespace Application.Partners
{
    public class PartnerDeliveryParams : PagingParams
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Search { get; set; }
        public string SearchBy { get; set; }
    }
}