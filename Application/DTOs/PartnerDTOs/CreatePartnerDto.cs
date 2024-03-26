using Application.DTOs.DeliveryAddressDTOs;

namespace Application.DTOs.PartnerDTOs
{
    public class CreatePartnerDto
    {
        public Guid Id { get; set; }

        public Guid CompanyId { get; set; }

        public CreateCompanyDto CreateCompanyDto { get; set; }

        public string Phone { get; set; }

        public string Email { get; set; }

        public ICollection<DeliveryAddressDto> DeliveryAddresses { get; set; } = new List<DeliveryAddressDto>();
    }
}