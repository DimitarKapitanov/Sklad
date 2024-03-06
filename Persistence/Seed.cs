using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context, UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            if (!roleManager.Roles.Any())
            {
                var roles = new[] { "Admin", "Manager", "Employee" };
                foreach (var role in roles)
                {
                    if (!roleManager.RoleExistsAsync(role).Result)
                        await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            if (!userManager.Users.Any())
            {
                var users = new List<AppUser>
                {
                    new() {
                        UserName = "bob",
                        Email = "bob@abv.bg",
                        DisplayName = "Bob",
                    },
                    new() {
                        UserName = "tom",
                        Email = "tom@abv.bg",
                        DisplayName = "Tom",
                    },
                    new() {
                        UserName = "pena",
                        Email = "pena@abv.bg",
                        DisplayName = "Pena",
                    },
                    new() {
                        UserName = "admin",
                        Email = "admin@admin.com",
                        DisplayName = "Admin",
                    }
                };
                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Pa$$w0rd");
                    if (user.UserName == "admin")
                    {
                        await userManager.AddToRoleAsync(user, "Admin");
                    }
                    else if (user.UserName == "bob")
                    {
                        await userManager.AddToRoleAsync(user, "Manager");
                    }
                    else
                    {
                        await userManager.AddToRoleAsync(user, "Employee");
                    }
                }
            }

            if (!context.Units.Any())
            {
                var units = new List<Unit>
                {
                    new() {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                        Acronym = "kg",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new() {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                        Acronym = "pack",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new() {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000003"),
                        Acronym = "ml",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new() {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000004"),
                        Acronym = "l",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },

                };
                await context.Units.AddRangeAsync(units);

            }

            if (!context.Companies.Any() && !context.Partners.Any())
            {

                var companies = new List<Company>();

                var partners = new List<Partner>();

                var deliveryAddresses = new List<DeliveryAddress>();

                for (int i = 1; i <= 100; i++)
                {
                    string bulstatBase = i.ToString();
                    if (bulstatBase.Length < 9)
                    {
                        bulstatBase = bulstatBase.PadRight(9, '0');
                    }
                    else if (bulstatBase.Length < 10)
                    {
                        bulstatBase = bulstatBase.PadRight(10, '0');
                    }
                    else if (bulstatBase.Length < 13)
                    {
                        bulstatBase = bulstatBase.PadRight(13, '0');
                    }

                    var companyId = Guid.NewGuid();

                    var company = new Company
                    {
                        Id = companyId,
                        Name = $"Company {i}",
                        City = $"City {i}",
                        Address = $"Address {i}",
                        Bulstat = bulstatBase,
                        Phone = $"088888888{i.ToString().PadLeft(2, '0')}",
                        Email = $"email{i}@email{i}.bg",
                        CompanyOwnerName = $"Owner {i}",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                        IsClient = i % 2 == 0,
                        IsSupplier = i % 2 != 0,
                    };

                    var partner = new Partner
                    {
                        Id = Guid.NewGuid(),
                        Phone = $"088888888{i.ToString().PadLeft(2, '0')}",
                        Email = $"partner{i}@abv.bg",
                        CompanyId = companyId,
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    };

                    for (int j = 1; j <= 5; j++)
                    {
                        var deliveryAddress = new DeliveryAddress
                        {
                            Id = Guid.NewGuid(),
                            PartnerId = partner.Id,
                            Address = $"Address {j} for partner {partner.Id}",
                            City = $"City {j}",
                            CreatedOn = DateTime.UtcNow,
                            ModifiedOn = DateTime.UtcNow,
                            IsDeleted = false,
                        };

                        deliveryAddresses.Add(deliveryAddress);
                    }

                    companies.Add(company);
                    partners.Add(partner);
                }

                await context.Companies.AddRangeAsync(companies);
                await context.Partners.AddRangeAsync(partners);
                await context.DeliveryAddress.AddRangeAsync(deliveryAddresses);
            }

            if (!context.Deliveries.Any())
            {
                var partners = context.Partners.Where(x => x.Company.IsSupplier).ToList();
                var Users = context.Users.Select(x => x.Id).ToList();
                var deliveries = new List<Deliveries>();
                var random = new Random();

                for (int i = 0; i < partners.Count; i++)
                {
                    for (int j = 0; j < 100; j++)
                    {
                        var createdOn = DateTime.UtcNow.AddDays(-random.Next(90));
                        var modifiedOn = createdOn.AddDays(random.Next(2));

                        var delivery = new Deliveries
                        {
                            Id = Guid.NewGuid(),
                            PartnerId = partners[i].Id,
                            UserId = Users[0],
                            CreatedOn = createdOn,
                            ModifiedOn = modifiedOn,
                            IsDeleted = false,
                        };

                        deliveries.Add(delivery);
                    }
                }

                await context.Deliveries.AddRangeAsync(deliveries);
            }

            if (!context.DeliveredProducts.Any())
            {
                var products = context.Products.ToList();
                var deliveries = context.Deliveries.ToList();
                var deliveryProducts = new List<DeliveredProduct>();
                var random = new Random();

                foreach (var delivery in deliveries)
                {
                    for (int i = 0; i < 10; i++)
                    {
                        var product = products[random.Next(products.Count)];
                        var deliveredProduct = new DeliveredProduct
                        {
                            Id = Guid.NewGuid(),
                            Category = product.Category,
                            Description = product.Description,
                            Name = product.Name,
                            Price = product.Price,
                            DeliveryPrice = product.DeliveryPrice,
                            UnitId = product.UnitId,
                            DeliveriesId = delivery.Id,
                            Quantity = random.Next(1, 100),
                            CreatedOn = DateTime.UtcNow,
                            ModifiedOn = DateTime.UtcNow,
                            IsDeleted = false,
                        };

                        deliveryProducts.Add(deliveredProduct);
                    }
                }

                await context.DeliveredProducts.AddRangeAsync(deliveryProducts);
            }

            if (!context.Orders.Any())
            {
                var partners = context.Partners.Where(x => x.Company.IsClient).ToList();
                var orders = new List<Order>();
                var warehouses = context.Warehouses.ToList();
                var random = new Random();

                for (int i = 0; i < partners.Count; i++)
                {
                    for (int j = 0; j < 100; j++)
                    {
                        var randomWarehouseIndex = random.Next(warehouses.Count);
                        var warehouse = warehouses[randomWarehouseIndex];

                        var createdOn = DateTime.UtcNow.AddDays(-random.Next(90));
                        var modifiedOn = createdOn.AddDays(random.Next(2));

                        var order = new Order
                        {
                            Id = Guid.NewGuid(),
                            PartnerId = partners[i].Id,
                            WarehouseId = warehouse.Id,
                            IsCompleted = j < 50,
                            CreatedOn = createdOn,
                            ModifiedOn = modifiedOn,
                            CompletedDate = j < 50 ? modifiedOn : null,
                            IsDeleted = false,
                        };

                        orders.Add(order);
                    }
                }

                await context.Orders.AddRangeAsync(orders);
            }

            if (!context.OrderProducts.Any())
            {
                var orders = context.Orders.ToList();
                var products = context.Products.ToList();
                var units = context.Units.ToList();
                var orderProducts = new List<OrderProduct>();
                var random = new Random();

                foreach (var order in orders)
                {
                    for (int i = 0; i < 10; i++)
                    {
                        var randomProductIndex = random.Next(products.Count);
                        var product = products[randomProductIndex];

                        var unit = units.FirstOrDefault(u => u.Acronym == "kg" || u.Acronym == "pack" || u.Acronym == "ml");
                        if (unit == null) continue;
                        var price = Math.Round(random.NextDouble() * (5000.00 - 0.10) + 0.10, 2);
                        var quantity = random.Next(1, 201);

                        var orderProduct = new OrderProduct
                        {
                            Id = Guid.NewGuid(),
                            OrderId = order.Id,
                            ProductId = product.Id,
                            Quantity = quantity,
                            Price = (decimal)price,
                            TotalPrice = (decimal)(quantity * price),
                            UnitId = product.Unit.Id,
                            UnitAcronym = product.Unit.Acronym,
                            Name = product.Name,
                            Category = product.Category,
                            Description = product.Description,
                            CreatedOn = order.CreatedOn,
                            ModifiedOn = order.ModifiedOn,
                            IsDeleted = false,
                        };

                        orderProducts.Add(orderProduct);
                    }
                }

                await context.OrderProducts.AddRangeAsync(orderProducts);
            }

            if (!context.Warehouses.Any())
            {
                var userIds = context.Users.Select(user => user.Id).ToList();

                var warehouses = new List<Warehouse>
                {
                    new() {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                        Name = "Главен склад",
                        ContactPersonId = userIds[0],
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new() {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                        Name = "Мобилен склад",
                        ContactPersonId = userIds[1],
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new() {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000003"),
                        Name = "Warehouse 3",
                        ContactPersonId = userIds[2],
                        Description = "Description 3",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    }
                };
                await context.Warehouses.AddRangeAsync(warehouses);
            }

            if (!context.Products.Any())
            {
                var products = new List<Product>
                {
                    new() {
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
                    new() {
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
                    new() {
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
                    new() {
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
                    new() {
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
                    new() {
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
                    new() {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000007"),
                        Name = "Banana",
                        Category = "fruits",
                        Description = "Banana",
                        Quantity = 100,
                        Price = 1.50m,
                        DeliveryPrice = 0.50m,
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                        UnitId = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                    },
                    new() {
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
                    new() {
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
                    new() {
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
                    new() {
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
                    new() {
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
                    new() {
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
                    new() {
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
                    new() {
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
                    new() {
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

                for (int i = 0; i < 2000; i++)
                {
                    var categories = new string[] { "Месо", "Зеленчуци", "Плодове", "Млечни продукти", "Хлебни изделия", "Напитки", "Сладкиши", "Замразени храни",
                    "Консерви", "Домакински", "Козметика", "Хигиена","Детски","Алкохолни напитки", "Кафе","Чай","Подправки", "Специални",
                    "Био", "Сезонни","Сурови","Вегетариански","Веган","Без глутен","Без лактоза","Без захар","Без ГМО","Без консерванти", "Без палмово масло",
                    "Без изкуствени оцветители", "Без изкуствени аромати", "Без изкуствени подсладители", "Без изкуствени подобрители", "Без изкуствени подправки",
                    "Без изкуствени добавки", "Без изкуствени консерванти", "Без изкуствени овкусители", "Други",};

                    products.Add(new Product
                    {
                        Id = Guid.NewGuid(),
                        Name = "Product " + i,
                        Category = categories[i % categories.Length],
                        Description = "Description " + i,
                        Quantity = 100,
                        Price = 1.50m,
                        DeliveryPrice = 0.50m,
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                        UnitId = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                    });
                }
                await context.Products.AddRangeAsync(products);
            };

            await context.SaveChangesAsync();
        }
    }
}