using Domain.Model;

namespace Domain
{
    public class Product : BaseDeletableModel<Guid>
    {
        public Product()
        {
            this.Id = Guid.NewGuid();
        }
        public string Name { get; set; }

        public string Categoy { get; set; }

        public double Quantity { get; set; }

        public Guid UnitId { get; set; }
        public virtual Unit Unit { get; set; }
        
        public string Description { get; set; }

        public decimal Price { get; set; }

        public decimal DeliveryPrice { get; set; }
    }
}