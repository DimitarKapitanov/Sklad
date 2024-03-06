namespace Application.DTOs.ProductDTOs
{
    public class DeliveredPartnerProductDto
    {
        public string Name { get; set; }

        public string Category { get; set; }

        public double Quantity { get; set; }

        public Guid UnitId { get; set; }

        public string UnitAcronym { get; set; }

        public string Description { get; set; }

        public decimal Price { get; set; }

        public decimal DeliveryPrice { get; set; }

        public DateTime CreatedOn { get; set; }

        public DateTime ModifiedOn { get; set; }
    }
}