using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.ProductDTOs
{
    public class GetProductDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        public string Category { get; set; }

        public double Quantity { get; set; }

        public Guid UnitId { get; set; }

        public UnitDto Unit { get; set; }

        public string Description { get; set; }

        public decimal Price { get; set; }

        public decimal DeliveryPrice { get; set; }

        public bool IsDeleted { get; set; }

        public DateTime? DeletedOn { get; set; }

        public DateTime CreatedOn { get; set; }

        public DateTime? ModifiedOn { get; set; }
    }
}