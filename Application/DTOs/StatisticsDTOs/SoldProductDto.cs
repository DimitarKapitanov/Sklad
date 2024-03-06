using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs.OrderDTOs;

namespace Application.DTOs.StatisticsDTOs
{
    public class SoldProductDto
    {
        public Guid Id { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CompletedDate { get; set; }
        public DateTime CreatedOn { get; set; }
        public Guid PartnerId { get; set; }
        public string PartnerName { get; set; }
        public string City { get; set; }
        public string CompanyOwnerName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Bulstat { get; set; }
        public string DeliveryCity { get; set; }
        public string DeliveryAddress { get; set; }
        public Guid WarehouseId { get; set; }
        public string WarehouseName { get; set; }
        public string ContactPersonId { get; set; }
        public ICollection<OrderProductDto> OrderProductDtos { get; set; } = new List<OrderProductDto>();
    }
}