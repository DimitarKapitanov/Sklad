using Domain.Model;

namespace Domain
{
    public class Unit : BaseDeletableModel<string>
    {
        public Unit()
        {
            this.Id = Guid.NewGuid().ToString();
        }

        public string Acronym { get; set; }
        public virtual ICollection<Product> Products { get; set; }
    }
}