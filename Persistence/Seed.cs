using Domain;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context)
        {
            if (!context.Units.Any())
            {
                var units = new List<Unit>
                {
                    new Unit
                    {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                        Name = "kilogram",
                        Acronym = "kg",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new Unit
                    {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                        Name = "pack",
                        Acronym = "pack",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new Unit
                    {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000003"),
                        Name = "mililiter",
                        Acronym = "ml",
                        Type = "can 330",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new Unit
                    {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000004"),
                        Name = "liter",
                        Acronym = "l",
                        Type = "bottle 1L",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new Unit
                    {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000005"),
                        Name = "liter",
                        Acronym = "l",
                        Type = "bottle 2L",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new Unit
                    {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000006"),
                        Name = "liter",
                        Acronym = "l",
                        Type = "bottle 3L",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new Unit
                    {
                        Id = Guid.Parse("00000000-0000-0000-0000-000000000007"),
                        Name = "liter",
                        Acronym = "l",
                        Type = "bottle 0.750L",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    }
                };
                await context.Units.AddRangeAsync(units);

            }
            if (context.Products.Any()) return;

            var products = new List<Product>
            {
                new Product
                {
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