using Domain.Model;

namespace Domain
{
    public class DeliveryAddress : BaseDeletableModel<string>
    {
        public DeliveryAddress()
        {
            this.Id = Guid.NewGuid().ToString();
        }
        
        public string CustomerId { get; set; }

        public virtual Customer Customer { get; set; }
        
        public string City { get; set; }

        public string Address { get; set; } 
    }
}