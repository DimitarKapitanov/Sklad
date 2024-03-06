namespace Application.DTOs.WarehouseDTOs
{
    public class WarehouseOrderProductDto
    {
        public Guid Id { get; set; }
        public Guid OrderId { get; set; }
        public Guid ProductId { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public double Quantity { get; set; }
        public Guid UnitId { get; set; }
        public string UnitAcronym { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public decimal TotalPrice { get; set; }
    }
}