using System.ComponentModel.DataAnnotations;

namespace Domain.Model
{
    public abstract class BaseModel<TKey> : IAuditInfo
    {
        protected BaseModel()
        {
            this.CreatedOn = DateTime.UtcNow;
            this.ModifiedOn = DateTime.UtcNow;
        }
        [Key]
        public TKey Id { get; set; }

        public DateTime CreatedOn { get; set; }

        public DateTime? ModifiedOn { get; set; }
    }
}