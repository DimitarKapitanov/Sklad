using Domain.Model;

namespace Domain
{
    public class Deliveries : BaseDeletableModel<Guid>
    {
        public Guid PartnerId { get; set; }
        public virtual Partner Partner { get; set; }
        public string UserId { get; set; }
        public virtual AppUser User { get; set; }
        public virtual ICollection<DeliveredProduct> DeliveredProducts { get; set; }
    }
}