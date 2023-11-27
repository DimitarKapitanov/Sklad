using Domain.Model;

namespace Domain
{
    public class WarehouseProduct : BaseDeletableModel<string>
    {
        public string WarehouseId { get; set; }

        public virtual Warehouse Warehouse { get; set; }

        public string ProductId { get; set; }

        public virtual Product Product { get; set; }

        public int Quantity { get; set; }
        
    }
}