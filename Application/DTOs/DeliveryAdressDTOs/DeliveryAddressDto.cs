using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.DeliveryAddressDTOs
{
    public class DeliveryAddressDto
    {
        public Guid Id { get; set; }
        public Guid PartnerId { get; set; }

        public string City { get; set; }

        public string Address { get; set; }
    }
}