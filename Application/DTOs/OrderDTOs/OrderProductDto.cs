namespace Application.DTOs.OrderDTOs
{
    public class OrderProductDto
    {
        public Guid Id { get; set; }
        public Guid OrderId { get; set; }
        public Guid ProductId { get; set; }
        public string Name { get; set; }
        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; }
        public double Quantity { get; set; }
        public Guid UnitId { get; set; }
        public string UnitAcronym { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public decimal TotalPrice { get; set; }
    }
}