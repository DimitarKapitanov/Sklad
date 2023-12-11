using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context, UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var users = new List<AppUser>
                {
                    new AppUser
                    {
                        UserName = "bob",
                        Email = "bob@abv.bg",
                        DisplayName = "Bob",
                    },
                    new AppUser
                    {
                        UserName = "tom",
                        Email = "tom@abv.bg",
                        DisplayName = "Tom",
                    },
                    new AppUser
                    {
                        UserName = "pena",
                        Email = "pena@abv.bg",
                        DisplayName = "Pena",
                    },
                };
                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Pa$$w0rd");
                }
            }
            if (!context.Units.Any())
            {
                var units = new List<Unit>
                {
                    new Unit
                    {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                        Acronym = "kg",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new Unit
                    {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                        Acronym = "pack",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new Unit
                    {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000003"),
                        Acronym = "ml",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new Unit
                    {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000004"),
                        Acronym = "l",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },

                };
                await context.Units.AddRangeAsync(units);

            }

            if (!context.Companies.Any())
            {
                var companies = new List<Company>
                {
                    new Company
                    {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                        Name = "Company 1",
                        Address = "Address 1",
                        Bulstat = "123456789",
                        Phone = "0888888888",
                        Email = "email1@email1.bg",
                        CompanyOwnerName = "Owner 1",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new Company
                    {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                        Name = "Company 2",
                        Address = "Address 2",
                        Bulstat = "234567891",
                        Phone = "0888888888",
                        Email = "email2@email2.bg",
                        CompanyOwnerName = "Owner 2",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new Company
                    {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000003"),
                        Name = "Company 3",
                        Address = "Address 3",
                        Bulstat = "345678912",
                        Phone = "0888888888",
                        Email = "email3@email3.bg",
                        CompanyOwnerName = "Owner 3",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    }
                };
                await context.Companies.AddRangeAsync(companies);
            }

            if (!context.Orders.Any())
                if (!context.Customers.Any())
                {
                    var customers = new List<Customer>
                {
                    new Customer
                    {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                        Phone = "0888888888",
                        Email = "customer1@abv.bg",
                        CompanyId = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new Customer
                    {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                        Phone = "0888888888",
                        Email = "customer2@abv.bg",
                        CompanyId = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new Customer
                    {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000003"),
                        Phone = "0888888888",
                        Email = "customer3@abv.bg",
                        CompanyId = Guid.Parse("00000000-0000-0000-0000-000000000003"),
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    }
                };
                    await context.Customers.AddRangeAsync(customers);
                }

            if (!context.WarehouseProducts.Any())
            {
                var WarehouseProduct = new List<WarehouseProduct>
                {
                    new WarehouseProduct
                    {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                        ProductId = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                        WarehouseId = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                        Quantity = 10,
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new WarehouseProduct
                    {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                        ProductId = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                        WarehouseId = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                        Quantity = 10,
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new WarehouseProduct
                    {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000003"),
                        ProductId = Guid.Parse("00000000-0000-0000-0000-000000000003"),
                        WarehouseId = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                        Quantity = 10,
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    }
                };
                await context.WarehouseProducts.AddRangeAsync(WarehouseProduct);
            }

            if (!context.Warehouses.Any())
            {
                var warehouses = new List<Warehouse>
                {
                    new Warehouse
                    {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                        Name = "Главен склад",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new Warehouse
                    {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                        Name = "Мобилен склад",
                        ContactPersonId = "00000000-0000-0000-0000-000000000001",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new Warehouse
                    {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000003"),
                        Name = "Warehouse 3",
                        ContactPersonId = "00000000-0000-0000-0000-000000000001",
                        Description = "Description 3",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    }
                };
                await context.Warehouses.AddRangeAsync(warehouses);
            }

            if (!context.DeliveryAddress.Any())
            {
                var deliveryAddresses = new List<DeliveryAddress>
                {
                    new DeliveryAddress
                    {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                        Address = "Address 1",
                        City = "City 1",
                        CustomerId = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new DeliveryAddress
                    {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                        Address = "Address 2",
                        City = "City 2",
                        CustomerId = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new DeliveryAddress
                    {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000003"),
                        Address = "Address 3",
                        City = "City 3",
                        CustomerId = Guid.Parse("00000000-0000-0000-0000-000000000003"),
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new DeliveryAddress
                    {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000004"),
                        Address = "Address 2",
                        City = "City 2",
                        CustomerId = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new DeliveryAddress
                    {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000005"),
                        Address = "Address 3",
                        City = "City 3",
                        CustomerId = Guid.Parse("00000000-0000-0000-0000-000000000003"),
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    }
                };
                await context.DeliveryAddress.AddRangeAsync(deliveryAddresses);
            }

            if (context.Products.Any()) return;

            var products = new List<Product>
            {
                new Product
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                    Name = "Coca Cola",
                    Category = "drinks",
                    Description = "Coca Cola",
                    Quantity = 10,
                    Price = 1.99m,
                    DeliveryPrice = 0.99m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = Guid.Parse("00000000-0000-0000-0000-000000000003"),
                },
                new Product
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                    Name = "Pepsi",
                    Category = "drinks",
                    Description = "Pepsi",
                    Quantity = 10,
                    Price = 1.50m,
                    DeliveryPrice = 0.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = Guid.Parse("00000000-0000-0000-0000-000000000003"),
                },
                new Product
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000003"),
                    Name = "Fanta",
                    Category = "drinks",
                    Description = "Fanta",
                    Quantity = 10,
                    Price = 1.50m,
                    DeliveryPrice = 0.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = Guid.Parse("00000000-0000-0000-0000-000000000003"),
                },
                new Product
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000004"),
                    Name = "Coca Cola",
                    Category = "drinks",
                    Description = "Coca Cola",
                    Quantity = 10,
                    Price = 1.99m,
                    DeliveryPrice = 0.99m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = Guid.Parse("00000000-0000-0000-0000-000000000004"),
                },
                new Product
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000005"),
                    Name = "Pepsi",
                    Category = "drinks",
                    Description = "Pepsi",
                    Quantity = 10,
                    Price = 1.50m,
                    DeliveryPrice = 0.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = Guid.Parse("00000000-0000-0000-0000-000000000004"),
                },
                new Product
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000006"),
                    Name = "Fanta",
                    Category = "drinks",
                    Description = "Fanta",
                    Quantity = 10,
                    Price = 1.50m,
                    DeliveryPrice = 0.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = Guid.Parse("00000000-0000-0000-0000-000000000004"),
                },
                new Product
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000007"),
                    Name = "Banan",
                    Category = "fruits",
                    Description = "Banan",
                    Quantity = 100,
                    Price = 1.50m,
                    DeliveryPrice = 0.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                },
                new Product
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000008"),
                    Name = "Apple",
                    Category = "fruits",
                    Description = "Apple",
                    Quantity = 100,
                    Price = 1.50m,
                    DeliveryPrice = 0.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                },
                new Product
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000009"),
                    Name = "Tomato",
                    Category = "vegetables",
                    Description = "Tomato",
                    Quantity = 100,
                    Price = 1.50m,
                    DeliveryPrice = 0.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                },
                new Product
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000010"),
                    Name = "Potato",
                    Category = "vegetables",
                    Description = "Potato",
                    Quantity = 100,
                    Price = 1.50m,
                    DeliveryPrice = 0.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                },
                new Product
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000011"),
                    Name = "Pork tenderloin",
                    Category = "meat",
                    Description = "Pork tenderloin",
                    Quantity = 100,
                    Price = 5.50m,
                    DeliveryPrice = 1.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                },
                new Product
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000012"),
                    Name = "Chicken",
                    Category = "meat",
                    Description = "Chicken",
                    Quantity = 100,
                    Price = 4.50m,
                    DeliveryPrice = 1.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                },
                new Product
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000013"),
                    Name = "Beef",
                    Category = "meat",
                    Description = "Beef",
                    Quantity = 100,
                    Price = 6.50m,
                    DeliveryPrice = 1.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                },
                new Product
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000014"),
                    Name = "Lasagna",
                    Category = "ready meals",
                    Description = "Lasagna",
                    Quantity = 50,
                    Price = 3.50m,
                    DeliveryPrice = 1.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                },
                new Product
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000015"),
                    Name = "Pizza",
                    Category = "ready meals",
                    Description = "Pizza",
                    Quantity = 50,
                    Price = 3.50m,
                    DeliveryPrice = 1.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                },
                new Product
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000016"),
                    Name = "Pasta",
                    Category = "ready meals",
                    Description = "Pasta",
                    Quantity = 50,
                    Price = 3.50m,
                    DeliveryPrice = 1.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                }
            };

            await context.Products.AddRangeAsync(products);
            await context.SaveChangesAsync();
        }
    }
}