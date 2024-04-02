using Application.Core;

namespace Application.Products
{
    public class ProductParams : PagingParams
    {
        public bool IsZeroQuantity { get; set; }
        public bool IsDeleted { get; set; }
        public int DecreasingQuantity { get; set; }
        public string CategoryName { get; set; }
        public string Search { get; set; }
    }
}