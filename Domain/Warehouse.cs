using System.ComponentModel.DataAnnotations.Schema;
using Domain.Model;

namespace Domain
{
    public class Warehouse : BaseDeletableModel<Guid>
    {
        public Warehouse()
        {
            this.Id = Guid.NewGuid();
        }
        public string Name { get; set; }

        public string ContactPersonId { get; set; }
        
        [ForeignKey("ContactPersonId")]
        public AppUser User { get; set; }

        public string Description { get; set; }

        public virtual ICollection<Order> Orders { get; set; }
    }
}