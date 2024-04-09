namespace Application.DTOs.OrderDTOs
{
    public class CreateOrderDto
    {
        public Guid Id { get; set; }
        public Guid PartnerId { get; set; }
        public Guid DeliveryAddressId { get; set; }
        public Guid WarehouseId { get; set; }
        public List<OrderProductDto> OrderProducts { get; set; } = new List<OrderProductDto>();
    }
}