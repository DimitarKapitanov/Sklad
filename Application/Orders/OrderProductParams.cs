using Application.Core;

namespace Application.Orders
{
    public class OrderProductParams : PagingParams
    {
        public bool IsCompleted { get; set; }

        public bool IsActive { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public Guid WarehouseId { get; set; }

        public string Search { get; set; }
    }
}