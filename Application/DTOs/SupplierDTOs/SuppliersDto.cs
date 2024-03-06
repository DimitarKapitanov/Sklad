namespace Application.DTOs.SuppliersDTOs
{
    public class SupplierDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        public string City { get; set; }

        public string Address { get; set; }

        public string Bulstat { get; set; }

        public string Phone { get; set; }

        public string Email { get; set; }

        public string CompanyOwnerName { get; set; }

        public bool IsClient { get; set; }

        public bool IsSupplier { get; set; }
        public Guid PartnerId { get; set; }
        public string PartnerPhone { get; set; }
        public string PartnerEmail { get; set; }
    }
}