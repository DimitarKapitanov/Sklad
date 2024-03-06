using System.ComponentModel.DataAnnotations.Schema;
using Domain.Model;

namespace Domain
{
    public class Company : BaseDeletableModel<Guid>
    {
        public Company()
        {
            this.Id = Guid.NewGuid();
        }

        public string Name { get; set; }

        public string City { get; set; }

        public string Address { get; set; }

        public string Bulstat { get; set; }

        public string Phone { get; set; }

        public string Email { get; set; }

        public string CompanyOwnerName { get; set; }

        public bool IsClient { get; set; }

        public bool IsSupplier { get; set; }

        public virtual Partner Partner { get; set; }
    }
}