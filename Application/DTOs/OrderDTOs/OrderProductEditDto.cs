namespace Application.DTOs.OrderDTOs
{
    public class OrderProductEditDto
    {
        public Guid Id { get; set; }
        public Guid OrderId { get; set; }
        public Guid ProductId { get; set; }
        public double Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime ModifiedOn { get; set; }
    }
}