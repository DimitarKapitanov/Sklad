using Domain.Model;

namespace Domain
{
    public class DataSeed : BaseDeletableModel<Guid>
    {
        public bool IsSeeded { get; set; }
    }
}