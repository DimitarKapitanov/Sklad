using System.ComponentModel.DataAnnotations.Schema;
using Domain.Model;

namespace Domain
{
    public class OrderProduct : BaseDeletableModel<Guid>
    {
        public Guid OrderId { get; set; }
        public virtual Order Order { get; set; }
        [ForeignKey("Product.Id")]
        public Guid ProductId { get; set; }

        public string Name { get; set; }

        public Guid CategoryId { get; set; }
        public virtual Category Category { get; set; }

        public double Quantity { get; set; }

        public Guid UnitId { get; set; }

        public string UnitAcronym { get; set; }

        public string Description { get; set; }

        public decimal Price { get; set; }

        public decimal TotalPrice { get; set; }

        public virtual Product Product { get; set; }
    }
}