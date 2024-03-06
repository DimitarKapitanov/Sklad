using System.ComponentModel.DataAnnotations.Schema;
using Domain.Model;

namespace Domain
{
    public class Partner : BaseDeletableModel<Guid>
    {
        public Guid CompanyId { get; set; }
        [ForeignKey("CompanyId")]
        public virtual Company Company { get; set; }

        public string Phone { get; set; }

        public string Email { get; set; }

        public ICollection<DeliveryAddress> DeliveryAddresses { get; set; }

        public virtual ICollection<Order> Orders { get; set; }
        public virtual ICollection<Deliveries> Deliveries { get; set; }
    }
}