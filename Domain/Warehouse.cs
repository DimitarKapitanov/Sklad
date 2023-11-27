using Domain.Model;

namespace Domain
{
    public class Warehouse : BaseDeletableModel<string>
    {
        public Warehouse()
        {
            this.Id = Guid.NewGuid().ToString();
        }
        public string Name { get; set; }

        public string ContactPersonId { get; set; }
        
        //[ForeignKey("ContactPersonId")]
        // public User User { get; set; }

        public string Description { get; set; }

        public virtual ICollection<WarehouseProduct> WarehouseProducts { get; set; }

    }
}