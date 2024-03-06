using Application.Core;

namespace Application.DTOs.WarehouseDTOs
{
    public class WarehouseWithOrdersDto
    {
        public WarehouseOrderDto Warehouse { get; set; }
        public PageList<OrderByWarehouseDto> Orders { get; set; }
    }
}