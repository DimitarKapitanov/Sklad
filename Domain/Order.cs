using Domain.Model;

namespace Domain
{
    public class Order : BaseDeletableModel<Guid>
    {
        public Order()
        {
            this.Id = Guid.NewGuid();
        }
        
        public Guid CustomerId { get; set; }
        
        public virtual Customer Customer { get; set; }

        public Guid WarehouseId { get; set; }

        public virtual Warehouse Warehouse { get; set; }

        public bool IsCompleted { get; set; }

        public DateTime CompletedDate { get; set; }
        public virtual ICollection<Product> Products { get; set; }
    }
}