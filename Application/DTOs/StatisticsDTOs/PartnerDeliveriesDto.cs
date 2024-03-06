namespace Application.DTOs.StatisticsDTOs
{
    public class PartnerDeliveriesDto
    {
        // Partner information for the delivery
        public Guid Id { get; set; }
        public DateTime CreatedOn { get; set; }
        public string PartnerName { get; set; }
        public string City { get; set; }
        public string CompanyOwnerName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Bulstat { get; set; }
        public string ContactPersonName { get; set; }
        public bool IsSupplier { get; set; }

        // Delivery list
        public ICollection<DeliveriesDto> Deliveries { get; set; } = new List<DeliveriesDto>();
    }
}