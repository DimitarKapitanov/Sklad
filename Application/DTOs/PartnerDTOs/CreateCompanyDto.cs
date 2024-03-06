using Application.DTOs.DeliveryAddressDTOs;

namespace Application.DTOs.PartnerDTOs
{
    public class CreateCompanyDto
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
    }
}