using Application.DTOs.ProductDTOs;

namespace Application.DTOs.StatisticsDTOs
{
    public class DeliveriesDto
    {
        public Guid Id { get; set; }
        public string PartnerName { get; set; }
        public Guid PartnerId { get; set; }
        public string UserId { get; set; }
        public string ContactPersonName { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime ModifiedOn { get; set; }

        // Products in the delivery
        public ICollection<DeliveredPartnerProductDto> DeliveredProducts { get; set; } = new List<DeliveredPartnerProductDto>();
    }
}