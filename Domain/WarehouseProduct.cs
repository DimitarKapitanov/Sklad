using Domain.Model;

namespace Domain
{
    public class WarehouseProduct : BaseDeletableModel<Guid>
    {
        public Guid WarehouseId { get; set; }

        public virtual Warehouse Warehouse { get; set; }

        public Guid ProductId { get; set; }

        public virtual Product Product { get; set; }

        public int Quantity { get; set; }
        
    }
}