using System.ComponentModel.DataAnnotations.Schema;
using Domain.Model;

namespace Domain
{
    public class Order : BaseDeletableModel<Guid>
    {
        public Order()
        {
            this.Id = Guid.NewGuid();
        }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OrderNumber { get; set; }

        public Guid PartnerId { get; set; }

        public virtual Partner Partner { get; set; }

        public Guid WarehouseId { get; set; }

        public virtual Warehouse Warehouse { get; set; }

        public bool IsCompleted { get; set; }
        public Guid DeliveryAddressId { get; set; }
        public virtual DeliveryAddress DeliveryAddress { get; set; }

        public DateTime? CompletedDate { get; set; }

        public string CompletedBy { get; set; }

        [ForeignKey("CompletedBy")]
        public virtual AppUser CompletedByUser { get; set; }

        public string CreatedBy { get; set; }

        [ForeignKey("CreatedBy")]
        public virtual AppUser CreatedByUser { get; set; }

        public virtual ICollection<OrderProduct> OrderProducts { get; set; }
    }
}