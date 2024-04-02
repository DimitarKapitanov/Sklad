using Domain.Model;

namespace Domain
{
    public class Category : BaseDeletableModel<Guid>
    {
        public string Name { get; set; }

        public virtual ICollection<Product> Products { get; set; }
        public virtual ICollection<DeliveredProduct> DeliveredProducts { get; set; }
        public virtual ICollection<OrderProduct> OrderProducts { get; set; }
    }
}