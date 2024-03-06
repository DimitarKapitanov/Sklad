using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
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

        public string Category { get; set; }

        public double Quantity { get; set; }

        public Guid UnitId { get; set; }

        public string UnitAcronym { get; set; }

        public string Description { get; set; }
        
        public decimal Price { get; set; }

        public decimal TotalPrice { get; set; }

        public virtual Product Product { get; set; }
    }
}