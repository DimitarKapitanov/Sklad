using Application.Core;

namespace Application.Statistics
{
    public class StatisticsParams : PagingParams
    {
        public string Search { get; set; }
        public string SearchByUsername { get; set; }
        public string Category { get; set; }
        public Guid WarehouseId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public Guid PartnerId { get; set; }
    }
}