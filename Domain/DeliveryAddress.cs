using Domain.Model;

namespace Domain
{
    public class DeliveryAddress : BaseDeletableModel<Guid>
    {
        public DeliveryAddress()
        {
            this.Id = Guid.NewGuid();
        }
        
        public Guid CustomerId { get; set; }

        public virtual Customer Customer { get; set; }
        
        public string City { get; set; }

        public string Address { get; set; } 
    }
}