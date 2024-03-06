using Application.DTOs.ProductDTOs;

namespace Application.DTOs.PartnerDTOs
{
    public class PartnerDeliveriesProductsDto
    {
        public Guid Id { get; set; }
        public DateTime CreatedOn { get; set; }
        public Guid PartnerId { get; set; }
        public string PartnerName { get; set; }
        public string City { get; set; }
        public string CompanyOwnerName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Bulstat { get; set; }
        public string ContactPersonName { get; set; }
        public bool IsSupplier { get; set; }
        public ICollection<DeliveredPartnerProductDto> DeliveryProductDtos { get; set; } = new List<DeliveredPartnerProductDto>();
    }
}