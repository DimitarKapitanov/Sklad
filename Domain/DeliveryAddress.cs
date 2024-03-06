using Domain.Model;

namespace Domain
{
    public class DeliveryAddress : BaseDeletableModel<Guid>
    {
        public DeliveryAddress()
        {
            this.Id = Guid.NewGuid();
        }

        public Guid PartnerId { get; set; }

        public virtual Partner Partner { get; set; }

        public string City { get; set; }

        public string Address { get; set; }
    }
}