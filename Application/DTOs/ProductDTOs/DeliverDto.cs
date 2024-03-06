namespace Application.DTOs.ProductDTOs
{
    public class DeliverDto
    {
        public Guid DeliveryCompanyId { get; set; }
        public ICollection<ProductDto> Products { get; set; }
    }
}