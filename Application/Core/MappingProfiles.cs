using Application.DTOs;
using Application.DTOs.PartnerDTOs;
using Application.DTOs.DeliveryAddressDTOs;
using Application.DTOs.OrderDTOs;
using Application.DTOs.ProductDTOs;
using Application.DTOs.StatisticsDTOs;
using Application.DTOs.SuppliersDTOs;
using Application.DTOs.WarehouseDTOs;
using AutoMapper;
using Domain;
using Application.DTOs.CategoryDTOs;
using Application.Categories;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Unit, UnitDto>();

            CreateMap<UnitDto, Unit>();
            CreateMap<DeliveryAddressDto, DeliveryAddress>();
            CreateMap<DeliveryAddress, DeliveryAddressDto>();
            CreateMap<OrderProduct, OrderProductDto>();
            CreateMap<OrderProductDto, OrderProduct>();
            CreateMap<UploadedProductsDto, Product>();
            CreateMap<OrderProduct, OrderProduct>();
            CreateMap<Product, GetProductDto>()
            .ForMember(d => d.UnitDto, o => o.MapFrom(s => s.Unit))
            .ForMember(d => d.Category, o => o.MapFrom(s => s.Category.Name));
            CreateMap<Warehouse, WarehouseDto>()
            .ForMember(d => d.UserName, o => o.MapFrom(s => s.User.UserName));
            CreateMap<WarehouseDto, Warehouse>();
            CreateMap<Warehouse, WarehouseOrderDto>();

            CreateMap<Product, ProductDto>()
                .ForMember(d => d.UnitDto, o => o.MapFrom(s => s.Unit))
                .ForMember(d => d.CategoryId, o => o.MapFrom(s => s.Category.Id))
                .ForMember(d => d.CategoryName, o => o.MapFrom(s => s.Category.Name));

            CreateMap<ProductDto, Product>()
            .ForMember(d => d.Unit, o => o.MapFrom(s => s.UnitDto))
            .ForMember(d => d.CategoryId, o => o.MapFrom(s => s.CategoryId));

            CreateMap<OrderDto, Order>()
                .ForMember(d => d.DeliveryAddressId, o => o.MapFrom(s => s.DeliveryAddressId));

            CreateMap<Order, OrderDto>()
                .ForMember(d => d.OrderProductDto, o => o.MapFrom(s => s.OrderProducts))
                .ForMember(d => d.PartnerName, o => o.MapFrom(s => s.Partner.Company.Name))
                .ForMember(d => d.CompanyOwnerName, o => o.MapFrom(s => s.Partner.Company.CompanyOwnerName))
                .ForMember(d => d.City, o => o.MapFrom(s => s.Partner.Company.City))
                .ForMember(d => d.Email, o => o.MapFrom(s => s.Partner.Email))
                .ForMember(d => d.Phone, o => o.MapFrom(s => s.Partner.Phone))
                .ForMember(d => d.Address, o => o.MapFrom(s => s.Partner.Company.Address))
                .ForMember(d => d.Vat, o => o.MapFrom(s => s.Partner.Company.Bulstat))
                .ForMember(d => d.DeliveryAddressId, o => o.MapFrom(s => s.DeliveryAddressId))
                .ForMember(d => d.WarehouseName, o => o.MapFrom(s => s.Warehouse.Name))
                .ForMember(d => d.CompletedDate, o => o.MapFrom(s => s.CompletedDate))
                .ForMember(d => d.OrderCreated, o => o.MapFrom(s => s.CreatedOn))
                .ForMember(d => d.ContactPersonId, o => o.MapFrom(s => s.Warehouse.ContactPersonId));

            CreateMap<Order, GetOrdersDto>()
                .ForMember(d => d.PartnerName, o => o.MapFrom(s => s.Partner.Company.Name))
                .ForMember(d => d.CompanyOwnerName, o => o.MapFrom(s => s.Partner.Company.CompanyOwnerName))
                .ForMember(d => d.City, o => o.MapFrom(s => s.Partner.Company.City))
                .ForMember(d => d.Email, o => o.MapFrom(s => s.Partner.Email))
                .ForMember(d => d.Phone, o => o.MapFrom(s => s.Partner.Phone))
                .ForMember(d => d.Address, o => o.MapFrom(s => s.Partner.Company.Address))
                .ForMember(d => d.Bulstat, o => o.MapFrom(s => s.Partner.Company.Bulstat))
                .ForMember(d => d.DeliveryAddress, o => o.MapFrom(s => s.DeliveryAddress.Address))
                .ForMember(d => d.WarehouseName, o => o.MapFrom(s => s.Warehouse.Name))
                .ForMember(d => d.ContactPersonId, o => o.MapFrom(s => s.Warehouse.ContactPersonId))
                .ForMember(d => d.ContactPersonName, o => o.MapFrom(s => s.Warehouse.User.DisplayName))
                .ForMember(d => d.ContactPersonPhoneNumber, o => o.MapFrom(s => s.Warehouse.User.PhoneNumber))
                .ForMember(d => d.OrderCreated, o => o.MapFrom(s => s.CreatedOn))
                .ForMember(d => d.CompletedDate, o => o.MapFrom(s => s.CompletedDate))
                .ForMember(d => d.CompletedBy, o => o.MapFrom(s => s.CompletedBy))
                .ForMember(d => d.CreatedBy, o => o.MapFrom(s => s.CreatedBy));

            CreateMap<Order, GetOrderByIdDto>()
                .ForMember(d => d.PartnerName, o => o.MapFrom(s => s.Partner.Company.Name))
                .ForMember(d => d.CompanyOwnerName, o => o.MapFrom(s => s.Partner.Company.CompanyOwnerName))
                .ForMember(d => d.City, o => o.MapFrom(s => s.Partner.Company.City))
                .ForMember(d => d.Email, o => o.MapFrom(s => s.Partner.Email))
                .ForMember(d => d.Phone, o => o.MapFrom(s => s.Partner.Phone))
                .ForMember(d => d.Address, o => o.MapFrom(s => s.Partner.Company.Address))
                .ForMember(d => d.Bulstat, o => o.MapFrom(s => s.Partner.Company.Bulstat))
                .ForMember(d => d.DeliveryCity, o => o.MapFrom(s => s.DeliveryAddress.City))
                .ForMember(d => d.DeliveryAddress, o => o.MapFrom(s => s.DeliveryAddress.Address))
                .ForMember(d => d.WarehouseName, o => o.MapFrom(s => s.Warehouse.Name))
                .ForMember(d => d.ContactPersonId, o => o.MapFrom(s => s.Warehouse.ContactPersonId))
                .ForMember(d => d.ContactPersonName, o => o.MapFrom(s => s.Warehouse.User.DisplayName))
                .ForMember(d => d.ContactPersonPhoneNumber, o => o.MapFrom(s => s.Warehouse.User.PhoneNumber))
                .ForMember(d => d.CompletedDate, o => o.MapFrom(s => s.CompletedDate))
                .ForMember(d => d.OrderCreated, o => o.MapFrom(s => s.CreatedOn))
                .ForMember(d => d.OrderProductDtos, o => o.MapFrom(s => s.OrderProducts.Where(x => x.IsDeleted == false)));

            CreateMap<Order, SoldProductDto>()
                .ForMember(d => d.PartnerName, o => o.MapFrom(s => s.Partner.Company.Name))
                .ForMember(d => d.CompanyOwnerName, o => o.MapFrom(s => s.Partner.Company.CompanyOwnerName))
                .ForMember(d => d.City, o => o.MapFrom(s => s.Partner.Company.City))
                .ForMember(d => d.Email, o => o.MapFrom(s => s.Partner.Email))
                .ForMember(d => d.Phone, o => o.MapFrom(s => s.Partner.Phone))
                .ForMember(d => d.Address, o => o.MapFrom(s => s.Partner.Company.Address))
                .ForMember(d => d.Bulstat, o => o.MapFrom(s => s.Partner.Company.Bulstat))
                .ForMember(d => d.DeliveryCity, o => o.MapFrom(s => s.DeliveryAddress.City))
                .ForMember(d => d.DeliveryAddress, o => o.MapFrom(s => s.DeliveryAddress.Address))
                .ForMember(d => d.WarehouseName, o => o.MapFrom(s => s.Warehouse.Name))
                .ForMember(d => d.IsCompleted, o => o.MapFrom(s => s.IsCompleted))
                .ForMember(d => d.CompletedDate, o => o.MapFrom(s => s.CompletedDate))
                .ForMember(d => d.CreatedOn, o => o.MapFrom(s => s.CreatedOn))
                .ForMember(d => d.PartnerId, o => o.MapFrom(s => s.PartnerId))
                .ForMember(d => d.WarehouseId, o => o.MapFrom(s => s.WarehouseId))
                .ForMember(d => d.ContactPersonId, o => o.MapFrom(s => s.Warehouse.ContactPersonId))
                .ForMember(d => d.OrderProductDtos, o => o.MapFrom(s => s.OrderProducts));

            CreateMap<DeliveredProduct, DeliveredProductDto>()
                .ForMember(d => d.CompanyName, o => o.MapFrom(s => s.Deliveries.Partner.Company.Name))
                .ForMember(d => d.CompanyOwnerName, o => o.MapFrom(s => s.Deliveries.Partner.Company.CompanyOwnerName))
                .ForMember(d => d.City, o => o.MapFrom(s => s.Deliveries.Partner.Company.City))
                .ForMember(d => d.Email, o => o.MapFrom(s => s.Deliveries.Partner.Company.Email))
                .ForMember(d => d.Phone, o => o.MapFrom(s => s.Deliveries.Partner.Company.Phone))
                .ForMember(d => d.Address, o => o.MapFrom(s => s.Deliveries.Partner.Company.Address))
                .ForMember(d => d.Bulstat, o => o.MapFrom(s => s.Deliveries.Partner.Company.Bulstat))
                .ForMember(d => d.CreatedOn, o => o.MapFrom(s => s.CreatedOn))
                .ForMember(d => d.ModifiedOn, o => o.MapFrom(s => s.ModifiedOn));

            CreateMap<ProductDto, DeliveredProduct>()
                .ForMember(d => d.Unit, o => o.MapFrom(s => s.UnitDto))
                .ForMember(d => d.UnitId, o => o.MapFrom(s => s.UnitId))
                .ForMember(d => d.CategoryId, o => o.MapFrom(s => s.CategoryId));

            CreateMap<Order, OrderByWarehouseDto>()
                .ForMember(d => d.WarehouseOrderProductDtos, o => o.MapFrom(s => s.OrderProducts))
                .ForMember(d => d.PartnerName, o => o.MapFrom(s => s.Partner.Company.Name))
                .ForMember(d => d.CompanyOwnerName, o => o.MapFrom(s => s.Partner.Company.CompanyOwnerName))
                .ForMember(d => d.City, o => o.MapFrom(s => s.Partner.Company.City))
                .ForMember(d => d.Email, o => o.MapFrom(s => s.Partner.Email))
                .ForMember(d => d.Phone, o => o.MapFrom(s => s.Partner.Phone))
                .ForMember(d => d.Address, o => o.MapFrom(s => s.Partner.Company.Address))
                .ForMember(d => d.Vat, o => o.MapFrom(s => s.Partner.Company.Bulstat))
                .ForMember(d => d.DeliveryAddress, o => o.MapFrom(s => s.DeliveryAddress.Address))
                .ForMember(d => d.IsCompleted, o => o.MapFrom(s => s.IsCompleted))
                .ForMember(d => d.CompletedDate, o => o.MapFrom(s => s.CompletedDate))
                .ForMember(d => d.CreatedOn, o => o.MapFrom(s => s.CreatedOn))
                .ForMember(d => d.PartnerId, o => o.MapFrom(s => s.PartnerId))
                .ForMember(d => d.WarehouseId, o => o.MapFrom(s => s.WarehouseId))
                .ForMember(d => d.WarehouseName, o => o.MapFrom(s => s.Warehouse.Name));

            CreateMap<OrderProduct, WarehouseOrderProductDto>();

            CreateMap<Warehouse, WarehouseOrderDto>()
                .ForMember(d => d.OrdersByWarehouse, o => o.MapFrom(s => s.Orders));


            CreateMap<CreateCompanyDto, Company>();
            CreateMap<CreatePartnerDto, Partner>()
                .ForMember(d => d.Company, o => o.MapFrom(s => s.CreateCompanyDto));

            CreateMap<Partner, PartnerDto>()
                .ForMember(d => d.Name, o => o.MapFrom(s => s.Company.Name))
                .ForMember(d => d.CompanyOwnerName, o => o.MapFrom(s => s.Company.CompanyOwnerName))
                .ForMember(d => d.City, o => o.MapFrom(s => s.Company.City))
                .ForMember(d => d.Email, o => o.MapFrom(s => s.Email))
                .ForMember(d => d.Phone, o => o.MapFrom(s => s.Phone))
                .ForMember(d => d.Address, o => o.MapFrom(s => s.Company.Address))
                .ForMember(d => d.Bulstat, o => o.MapFrom(s => s.Company.Bulstat))
                .ForMember(d => d.OrderId, o => o.MapFrom(s => s.Orders.Select(x => x.Id)))
                .ForMember(d => d.IsClient, o => o.MapFrom(s => s.Company.IsClient))
                .ForMember(d => d.IsSupplier, o => o.MapFrom(s => s.Company.IsSupplier))
                .ForMember(d => d.DeliveryAddress, o => o.MapFrom(s => s.DeliveryAddresses));

            CreateMap<Company, SupplierDto>();
            CreateMap<AppUser, Profiles.Profile>()
             .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url));

            CreateMap<Deliveries, PartnerDeliveriesProductsDto>()
                .ForMember(d => d.PartnerName, o => o.MapFrom(s => s.Partner.Company.Name))
                .ForMember(d => d.CompanyOwnerName, o => o.MapFrom(s => s.Partner.Company.CompanyOwnerName))
                .ForMember(d => d.City, o => o.MapFrom(s => s.Partner.Company.City))
                .ForMember(d => d.Email, o => o.MapFrom(s => s.Partner.Email))
                .ForMember(d => d.Phone, o => o.MapFrom(s => s.Partner.Phone))
                .ForMember(d => d.Address, o => o.MapFrom(s => s.Partner.Company.Address))
                .ForMember(d => d.Bulstat, o => o.MapFrom(s => s.Partner.Company.Bulstat))
                .ForMember(d => d.ContactPersonName, o => o.MapFrom(s => s.Partner.Deliveries.Select(c => c.User.DisplayName).FirstOrDefault()))
                .ForMember(d => d.DeliveryProductDtos, o => o.MapFrom(s => s.DeliveredProducts))
                .ForMember(d => d.CreatedOn, o => o.MapFrom(s => s.CreatedOn))
                .ForMember(d => d.IsSupplier, o => o.MapFrom(s => s.Partner.Company.IsSupplier))
                .ForMember(d => d.DeliveryProductDtos, o => o.MapFrom(s => s.DeliveredProducts));

            CreateMap<DeliveredProduct, DeliveredPartnerProductDto>();
            CreateMap<Partner, PartnerDeliveriesDto>();
            CreateMap<Deliveries, DeliveriesDto>()
            .ForMember(d => d.PartnerName, o => o.MapFrom(s => s.Partner.Company.Name))
            .ForMember(d => d.ContactPersonName, o => o.MapFrom(s => s.User.DisplayName));

            CreateMap<Category, CategoryDto>();
            CreateMap<CreateCategoryDto, Category>();
            CreateMap<EditCategoryDto, Category>();
        }
    }
}