namespace Application.DTOs.WarehouseDTOs
{
    public class WarehouseOrderDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string ContactPersonId { get; set; }

        public string Description { get; set; }

        public ICollection<OrderByWarehouseDto> OrdersByWarehouse { get; set; } = new List<OrderByWarehouseDto>();
    }
}