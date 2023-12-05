using Domain.Model;

namespace Domain
{
    public class Unit : BaseDeletableModel<Guid>
    {
        public Unit()
        {
            this.Id = Guid.NewGuid();
        }

        public string Acronym { get; set; }
        public virtual ICollection<Product> Products { get; set; }
    }
}