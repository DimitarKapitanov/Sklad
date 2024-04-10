using Domain.Model;

namespace Domain
{
    public class TestTable : BaseDeletableModel<Guid>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int Age { get; set; }
    }
}