using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;

namespace Application.Orders
{
    public class OrderParams : PagingParams
    {
        public string Username { get; set; }
    }
}