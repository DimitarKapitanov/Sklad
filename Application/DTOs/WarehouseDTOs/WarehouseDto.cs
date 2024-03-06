namespace Application.DTOs.WarehouseDTOs
{
    public class WarehouseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        public string ContactPersonId { get; set; }
        public string UserName { get; set; }
        public string Description { get; set; }
    }
}