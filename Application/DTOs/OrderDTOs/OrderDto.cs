namespace Application.DTOs.OrderDTOs
{
    public class OrderDto
    {
        public Guid Id { get; set; }
        public int OrderNumber { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? CompletedDate { get; set; }
        public DateTime OrderCreated { get; set; }
        public Guid PartnerId { get; set; }
        public string PartnerName { get; set; }
        public string City { get; set; }
        public string CompanyOwnerName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Vat { get; set; }
        public Guid DeliveryAddressId { get; set; }
        public Guid WarehouseId { get; set; }
        public string WarehouseName { get; set; }
        public string ContactPersonId { get; set; }
        public IList<OrderProductDto> OrderProductDto { get; set; } = new List<OrderProductDto>();
    }
}