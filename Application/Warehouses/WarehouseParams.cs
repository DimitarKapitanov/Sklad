using Application.Core;

namespace Application.Warehouses
{
    public class WarehouseParams : PagingParams
    {
        public bool IsComplied { get; set; }

        public bool Active { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string WarehouseId { get; set; }

        public string Search { get; set; }
    }
}