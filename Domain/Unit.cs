using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Model;

namespace Domain
{
    public class Unit : BaseDeletableModel<Guid>
    {
        public Unit()
        {
            this.Id = Guid.NewGuid();
        }

        public string Name { get; set; }

        public string Acronym { get; set; }

        public string Type { get; set; }
        public virtual ICollection<Product> Products { get; set; }
    }
}