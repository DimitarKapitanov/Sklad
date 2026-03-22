using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

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
                        Id = Guid.NewGuid(),
                        Acronym = "кг",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new() {
                        Id = Guid.NewGuid(),
                        Acronym = "пакет",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new() {
                        Id = Guid.NewGuid(),
                        Acronym = "мл",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new() {
                        Id = Guid.NewGuid(),
                        Acronym = "л",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new() {
                        Id = Guid.NewGuid(),
                        Acronym = "бр",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },

                };
                await context.Units.AddRangeAsync(units);
                await context.SaveChangesAsync();
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
                await context.SaveChangesAsync();
            }

            if (!context.Warehouses.Any())
            {
                var userIds = context.Users.Select(user => user.Id).ToList();

                var warehouses = new List<Warehouse>
                {
                    new() {
                        Id = Guid.NewGuid(),
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
                await context.SaveChangesAsync();
            }

            var allNeededCategoryNames = new HashSet<string> {
                "Камини", "Готварски печки", "Други/Аксесоари", "C", "Консумативи",
                "drinks", "fruits", "vegetables", "meat", "ready meals",
                "Месо", "Зеленчуци", "Плодове", "Млечни продукти", "Хлебни изделия", "Напитки", "Сладкиши", "Замразени храни",
                "Консерви", "Домакински", "Козметика", "Хигиена", "Детски", "Алкохолни напитки", "Кафе", "Чай", "Подправки", "Специални",
                "Био", "Сезонни", "Сурови", "Вегетариански", "Веган", "Без глутен", "Без лактоза", "Без захар", "Без ГМО", "Без консерванти",
                "Без палмово масло", "Без изкуствени оцветители", "Без изкуствени аромати", "Без изкуствени подсладители",
                "Без изкуствени подобрители", "Без изкуствени подправки", "Без изкуствени добавки", "Без изкуствени консерванти",
                "Без изкуствени овкусители", "Други"
            };
            var existingCatNames = context.Categories.Select(c => c.Name).ToHashSet();
            foreach (var name in allNeededCategoryNames.Where(n => !existingCatNames.Contains(n)))
            {
                context.Categories.Add(new Category { Id = Guid.NewGuid(), Name = name, CreatedOn = DateTime.UtcNow, ModifiedOn = DateTime.UtcNow, IsDeleted = false });
            }
            await context.SaveChangesAsync();
            var categoryLookup = new Dictionary<string, Guid>();
            foreach (var cat in await context.Categories.ToListAsync())
            {
                categoryLookup.TryAdd(cat.Name, cat.Id);
            }

            if (!context.Products.Any())
            {
                var units = context.Units.ToList();
                var products = new List<Product>
                {
                    new() {
                        Id = Guid.NewGuid(),
                        Name = "UPS ЗА ПОМПА",
                        CategoryId = categoryLookup["Други/Аксесоари"],
                        Description = "UPS ЗА ПОМПА",
                        Quantity = 15,
                        Price = 132.9379m,
                        DeliveryPrice = 120.8527m,
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                        UnitId = units.FirstOrDefault(u => u.Acronym == "бр").Id,
                    },
                    new() {
                        Id = Guid.NewGuid(),
                        Name = "БЕЛИ КУБЧЕТА",
                        CategoryId = categoryLookup["Други/Аксесоари"],
                        Description = "БЕЛИ КУБЧЕТА",
                        Quantity = 8,
                        Price = 1.3750m,
                        DeliveryPrice = 1.2500m,
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                        UnitId = units.FirstOrDefault(u => u.Acronym == "бр").Id,
                    },
                    new() {
                       Id = Guid.NewGuid(),
                       Name = "БОЙЛЕР",
                       CategoryId = categoryLookup["Други/Аксесоари"],
                       Description = "БОЙЛЕР",
                       Quantity = 3,
                       Price = 322.2010m,
                       DeliveryPrice = 292.9100m,
                       CreatedOn = DateTime.UtcNow,
                       ModifiedOn = DateTime.UtcNow,
                       IsDeleted = false,
                       UnitId = units.FirstOrDefault(u => u.Acronym == "бр").Id,
                    },
                    new() {
                       Id = Guid.NewGuid(),
                       Name = "БУНКЕР ЗА ПЕЛЕТИ",
                       CategoryId = categoryLookup["Камини"],
                       Description = "БУНКЕР ЗА ПЕЛЕТИ",
                       Quantity = 1,
                       Price = 164.0650m,
                       DeliveryPrice = 149.1500m,
                       CreatedOn = DateTime.UtcNow,
                       ModifiedOn = DateTime.UtcNow,
                       IsDeleted = false,
                       UnitId = units.FirstOrDefault(u => u.Acronym == "бр").Id,
                    },
                     new() {
                       Id = Guid.NewGuid(),
                       Name = "ВЕРМИКУЛИТНО ПЛОЧА",
                       CategoryId = categoryLookup["Камини"],
                       Description = "ВЕРМИКУЛИТНО ПЛОЧА",
                       Quantity = 2,
                       Price = 61.6715m,
                       DeliveryPrice = 56.0650m,
                       CreatedOn = DateTime.UtcNow,
                       ModifiedOn = DateTime.UtcNow,
                       IsDeleted = false,
                       UnitId = units.FirstOrDefault(u => u.Acronym == "бр").Id,
                    },
                     new() {
                       Id = Guid.NewGuid(),
                       Name = "ВЪЖЕ",
                       CategoryId = categoryLookup["Други/Аксесоари"],
                       Description = "ВЪЖЕ",
                       Quantity = 8,
                       Price = 2.3733m,
                       DeliveryPrice = 2.1575m,
                       CreatedOn = DateTime.UtcNow,
                       ModifiedOn = DateTime.UtcNow,
                       IsDeleted = false,
                       UnitId = units.FirstOrDefault(u => u.Acronym == "бр").Id,
                    },
                    new() {
                       Id = Guid.NewGuid(),
                       Name = "ГАРНИТУРА ЗА НИПЕЛ",
                       CategoryId = categoryLookup["Други/Аксесоари"],
                       Description = "ГАРНИТУРА ЗА НИПЕЛ",
                       Quantity = 45,
                       Price = 0.2862m,
                       DeliveryPrice = 0.3148m,
                       CreatedOn = DateTime.UtcNow,
                       ModifiedOn = DateTime.UtcNow,
                       IsDeleted = false,
                       UnitId = units.FirstOrDefault(u => u.Acronym == "бр").Id,
                    },
                    new() {
                       Id = Guid.NewGuid(),
                       Name = "ГОРИВНА КОШНИЦА",
                       CategoryId = categoryLookup["Камини"],
                       Description = "ГОРИВНА КОШНИЦА",
                       Quantity = 2,
                       Price = 112.2000m,
                       DeliveryPrice = 102.0000m,
                       CreatedOn = DateTime.UtcNow,
                       ModifiedOn = DateTime.UtcNow,
                       IsDeleted = false,
                       UnitId = units.FirstOrDefault(u => u.Acronym == "бр").Id,
                    },
                    new() {
                       Id = Guid.NewGuid(),
                       Name = "ГОТВАРСКА ПЕЧКА",
                       CategoryId = categoryLookup["Готварски печки"],
                       Description = "ГОТВАРСКА ПЕЧКА",
                       Quantity = 1,
                       Price = 656.0000m,
                       DeliveryPrice = 721.6000m,
                       CreatedOn = DateTime.UtcNow,
                       ModifiedOn = DateTime.UtcNow,
                       IsDeleted = false,
                       UnitId = units.FirstOrDefault(u => u.Acronym == "бр").Id,
                    },
                    new() {
                       Id = Guid.NewGuid(),
                       Name = "ГОТВАРСКА ПЕЧКА ПРИТИ",
                       CategoryId = categoryLookup["Готварски печки"],
                       Description = "ГОТВАРСКА ПЕЧКА ПРИТИ",
                       Quantity = 1,
                       Price = 483.1530m,
                       DeliveryPrice = 439.2300m,
                       CreatedOn = DateTime.UtcNow,
                       ModifiedOn = DateTime.UtcNow,
                       IsDeleted = false,
                       UnitId = units.FirstOrDefault(u => u.Acronym == "бр").Id,
                    },
                    new() {
                       Id = Guid.NewGuid(),
                       Name = "ДАТЧИЦИ",
                       CategoryId = categoryLookup["Други/Аксесоари"],
                       Description = "ДАТЧИЦИ",
                       Quantity = 2,
                       Price = 15.0370m,
                       DeliveryPrice = 13.6700m,
                       CreatedOn = DateTime.UtcNow,
                       ModifiedOn = DateTime.UtcNow,
                       IsDeleted = false,
                       UnitId = units.FirstOrDefault(u => u.Acronym == "бр").Id,
                    },
                    new() {
                       Id = Guid.NewGuid(),
                       Name = "ДЕКАБА ЕЛЕМЕНТИ",
                       CategoryId = categoryLookup["Други/Аксесоари"],
                       Description = "ДЕКАБА ЕЛЕМЕНТИ",
                       Quantity = 410,
                       Price = 5.7747m,
                       DeliveryPrice = 5.2498m,
                       CreatedOn = DateTime.UtcNow,
                       ModifiedOn = DateTime.UtcNow,
                       IsDeleted = false,
                       UnitId = units.FirstOrDefault(u => u.Acronym == "бр").Id,
                    },
                    new() {
                       Id = Guid.NewGuid(),
                       Name = "ДИМООТВОД",
                       CategoryId = categoryLookup["Други/Аксесоари"],
                       Description = "ДИМООТВОД",
                       Quantity = 25,
                       Price = 15.8690m,
                       DeliveryPrice = 14.4264m,
                       CreatedOn = DateTime.UtcNow,
                       ModifiedOn = DateTime.UtcNow,
                       IsDeleted = false,
                       UnitId = units.FirstOrDefault(u => u.Acronym == "бр").Id,
                    },
                    new() {
                       Id = Guid.NewGuid(),
                       Name = "ДИСПЛЕЙ",
                       CategoryId = categoryLookup["Други/Аксесоари"],
                       Description = "ДИСПЛЕЙ",
                       Quantity = 2,
                       Price = 117.3315m,
                       DeliveryPrice = 106.6650m,
                       CreatedOn = DateTime.UtcNow,
                       ModifiedOn = DateTime.UtcNow,
                       IsDeleted = false,
                       UnitId = units.FirstOrDefault(u => u.Acronym == "бр").Id,
                    },
                    new() {
                       Id = Guid.NewGuid(),
                       Name = "ДРЪЖКА",
                       CategoryId = categoryLookup["Други/Аксесоари"],
                       Description = "ДРЪЖКА",
                       Quantity = 5,
                       Price = 7.8034m,
                       DeliveryPrice = 7.0940m,
                       CreatedOn = DateTime.UtcNow,
                       ModifiedOn = DateTime.UtcNow,
                       IsDeleted = false,
                       UnitId = units.FirstOrDefault(u => u.Acronym == "бр").Id,
                    },
                new() {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                    Name = "Coca Cola",
                    CategoryId = categoryLookup["drinks"],
                    Description = "Coca Cola",
                    Quantity = 10,
                    Price = 1.99m,
                    DeliveryPrice = 0.99m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = units.First(u => u.Acronym == "мл").Id,
                },
                new() {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                    Name = "Pepsi",
                    CategoryId = categoryLookup["drinks"],
                    Description = "Pepsi",
                    Quantity = 10,
                    Price = 1.50m,
                    DeliveryPrice = 0.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = units.First(u => u.Acronym == "мл").Id,

                },
                new() {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000003"),
                    Name = "Fanta",
                    CategoryId = categoryLookup["drinks"],
                    Description = "Fanta",
                    Quantity = 10,
                    Price = 1.50m,
                    DeliveryPrice = 0.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = units.First(u => u.Acronym == "мл").Id,
                },
                new() {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000004"),
                    Name = "Coca Cola",
                    CategoryId = categoryLookup["drinks"],
                    Description = "Coca Cola",
                    Quantity = 10,
                    Price = 1.99m,
                    DeliveryPrice = 0.99m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = units.First(u => u.Acronym == "л").Id,
                },
                new() {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000005"),
                    Name = "Pepsi",
                    CategoryId = categoryLookup["drinks"],
                    Description = "Pepsi",
                    Quantity = 10,
                    Price = 1.50m,
                    DeliveryPrice = 0.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = units.First(u => u.Acronym == "л").Id,
                },
                new() {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000006"),
                    Name = "Fanta",
                    CategoryId = categoryLookup["drinks"],
                    Description = "Fanta",
                    Quantity = 10,
                    Price = 1.50m,
                    DeliveryPrice = 0.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = units.First(u => u.Acronym == "л").Id,
                },
                new() {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000007"),
                    Name = "Banana",
                    CategoryId = categoryLookup["fruits"],
                    Description = "Banana",
                    Quantity = 100,
                    Price = 1.50m,
                    DeliveryPrice = 0.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = units.First(u => u.Acronym == "кг").Id,
                },
                new() {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000008"),
                    Name = "Apple",
                    CategoryId = categoryLookup["fruits"],
                    Description = "Apple",
                    Quantity = 100,
                    Price = 1.50m,
                    DeliveryPrice = 0.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = units.First(u => u.Acronym == "кг").Id,
                },
                new() {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000009"),
                    Name = "Tomato",
                    CategoryId = categoryLookup["vegetables"],
                    Description = "Tomato",
                    Quantity = 100,
                    Price = 1.50m,
                    DeliveryPrice = 0.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = units.First(u => u.Acronym == "кг").Id,
                },
                new() {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000010"),
                    Name = "Potato",
                    CategoryId = categoryLookup["vegetables"],
                    Description = "Potato",
                    Quantity = 100,
                    Price = 1.50m,
                    DeliveryPrice = 0.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = units.First(u => u.Acronym == "кг").Id,
                },
                new() {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000011"),
                    Name = "Pork tenderloin",
                    CategoryId = categoryLookup["meat"],
                    Description = "Pork tenderloin",
                    Quantity = 100,
                    Price = 5.50m,
                    DeliveryPrice = 1.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = units.First(u => u.Acronym == "кг").Id,
                },
                new() {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000012"),
                    Name = "Chicken",
                    CategoryId = categoryLookup["meat"],
                    Description = "Chicken",
                    Quantity = 100,
                    Price = 4.50m,
                    DeliveryPrice = 1.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = units.First(u => u.Acronym == "кг").Id,
                },
                new() {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000013"),
                    Name = "Beef",
                    CategoryId = categoryLookup["meat"],
                    Description = "Beef",
                    Quantity = 100,
                    Price = 6.50m,
                    DeliveryPrice = 1.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = units.First(u => u.Acronym == "кг").Id,
                },
                new() {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000014"),
                    Name = "Lasagna",
                    CategoryId = categoryLookup["ready meals"],
                    Description = "Lasagna",
                    Quantity = 50,
                    Price = 3.50m,
                    DeliveryPrice = 1.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = units.First(u => u.Acronym == "пакет").Id,
                },
                new() {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000015"),
                    Name = "Pizza",
                    CategoryId = categoryLookup["ready meals"],
                    Description = "Pizza",
                    Quantity = 50,
                    Price = 3.50m,
                    DeliveryPrice = 1.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = units.First(u => u.Acronym == "пакет").Id,
                },
                new() {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000016"),
                    Name = "Pasta",
                    CategoryId = categoryLookup["ready meals"],
                    Description = "Pasta",
                    Quantity = 50,
                    Price = 3.50m,
                    DeliveryPrice = 1.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                    UnitId = units.First(u => u.Acronym == "пакет").Id,
                }
                };

                for (int i = 0; i < 2000; i++)
                {
                    var categoryNames = new string[] { "Месо", "Зеленчуци", "Плодове", "Млечни продукти", "Хлебни изделия", "Напитки", "Сладкиши", "Замразени храни",
                    "Консерви", "Домакински", "Козметика", "Хигиена","Детски","Алкохолни напитки", "Кафе","Чай","Подправки", "Специални",
                    "Био", "Сезонни","Сурови","Вегетариански","Веган","Без глутен","Без лактоза","Без захар","Без ГМО","Без консерванти", "Без палмово масло",
                    "Без изкуствени оцветители", "Без изкуствени аромати", "Без изкуствени подсладители", "Без изкуствени подобрители", "Без изкуствени подправки",
                    "Без изкуствени добавки", "Без изкуствени консерванти", "Без изкуствени овкусители", "Други",};

                    products.Add(new Product
                    {
                        Id = Guid.NewGuid(),
                        Name = "Product " + i,
                        CategoryId = categoryLookup[categoryNames[i % categoryNames.Length]],
                        Description = "Description " + i,
                        Quantity = 100,
                        Price = 1.50m,
                        DeliveryPrice = 0.50m,
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                        UnitId = units.First(u => u.Acronym == "кг").Id,
                    });
                }
                await context.Products.AddRangeAsync(products);
            };

            await context.SaveChangesAsync();

            if (!context.Deliveries.Any())
            {
                var partners = context.Partners.Include(x => x.Company).Where(x => x.Company.IsSupplier).ToList();
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
                await context.SaveChangesAsync();
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
                            CategoryId = product.CategoryId,
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
                await context.SaveChangesAsync();
            }

            if (!context.Orders.Any())
            {
                var partners = context.Partners.Include(x => x.Company).Where(x => x.Company.IsClient).ToList();
                var orders = new List<Order>();
                var warehouses = context.Warehouses.ToList();
                var random = new Random();

                if (partners.Count > 0 && warehouses.Count > 0)
                {
                    for (int i = 0; i < 1000; i++)
                    {
                        var partner = partners[i % partners.Count];
                        var warehouse = warehouses[random.Next(warehouses.Count)];
                        var deliveryAddress = context.DeliveryAddress.FirstOrDefault(x => x.PartnerId == partner.Id).Id;
                    var createdOn = DateTime.UtcNow.AddDays(-random.Next(90));
                    var modifiedOn = createdOn.AddDays(random.Next(2));
                    var order = new Order
                    {
                        Id = Guid.NewGuid(),
                        PartnerId = partner.Id,
                        WarehouseId = warehouse.Id,
                        DeliveryAddressId = deliveryAddress,
                        IsCompleted = i < 500,
                        CreatedOn = createdOn,
                        ModifiedOn = modifiedOn,
                        CompletedDate = i < 500 ? modifiedOn : null,
                        IsDeleted = false,
                    };

                    orders.Add(order);
                    }
                }

                await context.Orders.AddRangeAsync(orders);
                await context.SaveChangesAsync();
            }

            if (!context.OrderProducts.Any())
            {
                var orders = context.Orders.ToList();
                var products = context.Products.Include(p => p.Unit).Include(p => p.Category).ToList();
                var orderProducts = new List<OrderProduct>();
                var random = new Random();

                foreach (var order in orders)
                {
                    for (int i = 0; i < 10; i++)
                    {
                        var product = products[random.Next(products.Count)];
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
                            UnitId = product.UnitId,
                            UnitAcronym = product.Unit.Acronym,
                            Name = product.Name,
                            CategoryId = product.CategoryId,
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

            await context.SaveChangesAsync();
        }
    }
}