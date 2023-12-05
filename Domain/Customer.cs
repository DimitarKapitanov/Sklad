using Domain.Model;

namespace Domain
{
    public class Customer : BaseDeletableModel<Guid>
    {
        public Customer()
        {
            this.Id = Guid.NewGuid();
        }
        
        public Guid CompanyId { get; set; }

        public virtual Company Company { get; set; }
        
        public string Phone { get; set; }
        
        public string Email { get; set; }   

        public ICollection<DeliveryAddress> DeliveryAddresses { get; set; }
        
        public virtual ICollection<Order> Orders { get; set; }
    }
}