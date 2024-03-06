namespace Application.DTOs.ProductDTOs
{
    public class DeliveredProductDto
    {
        public string Name { get; set; }

        public string Category { get; set; }

        public double Quantity { get; set; }

        public Guid UnitId { get; set; }

        public string Description { get; set; }

        public decimal Price { get; set; }

        public decimal DeliveryPrice { get; set; }

        public Guid DeliveriesId { get; set; }

        public string CompanyName { get; set; }

        public string City { get; set; }

        public string Address { get; set; }

        public string Bulstat { get; set; }

        public string Phone { get; set; }

        public string Email { get; set; }

        public string CompanyOwnerName { get; set; }
        public DateTime CreatedOn { get; set; }

        public DateTime ModifiedOn { get; set; }
    }
}