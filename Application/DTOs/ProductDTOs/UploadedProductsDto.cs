namespace Application.DTOs.ProductDTOs
{
    public class UploadedProductsDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid CategoryId { get; set; }
        public double Quantity { get; set; }
        public Guid UnitId { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public decimal DeliveryPrice { get; set; }
    }
}