namespace Application.DTOs.ProductDTOs
{
    public class ProductDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        public string Category { get; set; }

        public double Quantity { get; set; }

        public Guid UnitId { get; set; }

        public UnitDto UnitDto { get; set; }

        public string Description { get; set; }

        public decimal Price { get; set; }

        public decimal DeliveryPrice { get; set; }

        public bool IsDeleted { get; set; }

        public DateTime? DeletedOn { get; set; }

        public DateTime CreatedOn { get; set; }

        public DateTime? ModifiedOn { get; set; }
        public Guid DeliveryCompanyId { get; set; }
    }
}