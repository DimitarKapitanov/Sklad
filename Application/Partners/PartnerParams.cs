using Application.Core;

namespace Application.Partners
{
    public class PartnerParams : PagingParams
    {
        public bool IsClient { get; set; }
        public bool IsSupplier { get; set; }
        public string Search { get; set; }
    }
}