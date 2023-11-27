using Domain.Model;

namespace Domain
{
    public class Customer : BaseDeletableModel<string>
    {
        public Customer()
        {
            this.Id = Guid.NewGuid().ToString();
        }
        
        public string CompanyId { get; set; }

        public virtual Company Company { get; set; }
        
        public string Phone { get; set; }
        
        public string Email { get; set; }   

        public ICollection<DeliveryAddress> DeliveryAddresses { get; set; }
        
        public virtual ICollection<Order> Orders { get; set; }
    }
}