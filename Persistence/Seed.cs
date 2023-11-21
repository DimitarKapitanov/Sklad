using Domain;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context)
        {
            if (!context.Units.Any())
            {
                var units = new List<Unit>{
                    new Unit
                    {
                        Name = "kilogram",
                        Acronym = "kg",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new Unit
                    {
                        Name = "pack",
                        Acronym = "pack",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new Unit
                    {
                        Name = "mililiter",
                        Acronym = "ml",
                        Type = "can 330",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new Unit
                    {
                        Name = "liter",
                        Acronym = "l",
                        Type = "bottle 1L",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new Unit
                    {
                        Name = "liter",
                        Acronym = "l",
                        Type = "bottle 2L",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new Unit
                    {
                        Name = "liter",
                        Acronym = "l",
                        Type = "bottle 3L",
                        CreatedOn = DateTime.UtcNow,
                        ModifiedOn = DateTime.UtcNow,
                        IsDeleted = false,
                    },
                    new Unit
                    {
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
                    Categoy = "drinks",
                    Description = "Coca Cola",
                    Quantity = 10,
                    Unit = new Unit {
                        Name = "mililiter",
                        Acronym = "ml",
                        Type = "can 330"
                    },
                    Price = 1.99m,
                    DeliveryPrice = 0.99m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                },
                new Product
                {
                    Name = "Pepsi",
                    Categoy = "drinks",
                    Description = "Pepsi",
                    Quantity = 10,
                    Unit = new Unit
                    {
                        Name = "mililiter",
                        Acronym = "ml",
                        Type = "can 330"
                    },
                    Price = 1.50m,
                    DeliveryPrice = 0.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                },
                new Product
                {
                    Name = "Fanta",
                    Categoy = "drinks",
                    Description = "Fanta",
                    Quantity = 10,
                    Unit = new Unit
                    {
                        Name = "mililiter",
                        Acronym = "ml",
                        Type = "can 330"
                    },
                    Price = 1.50m,
                    DeliveryPrice = 0.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                },
                new Product
                {
                    Name = "Coca Cola",
                    Categoy = "drinks",
                    Description = "Coca Cola",
                    Quantity = 10,
                    Unit = new Unit
                    {
                        Name = "liter",
                        Acronym = "l",
                        Type = "bottle 1L"
                    },
                    Price = 1.99m,
                    DeliveryPrice = 0.99m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                },
                new Product
                {
                    Name = "Pepsi",
                    Categoy = "drinks",
                    Description = "Pepsi",
                    Quantity = 10,
                    Unit = new Unit
                    {
                        Name = "liter",
                        Acronym = "l",
                        Type = "bottle 1L"
                    },
                    Price = 1.50m,
                    DeliveryPrice = 0.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                },
                new Product
                {
                    Name = "Fanta",
                    Categoy = "drinks",
                    Description = "Fanta",
                    Quantity = 10,
                    Unit = new Unit
                    {
                        Name = "liter",
                        Acronym = "l",
                        Type = "bottle 2L"
                    },
                    Price = 1.50m,
                    DeliveryPrice = 0.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                },
                new Product
                {
                    Name = "Banan",
                    Categoy = "fruits",
                    Description = "Banan",
                    Quantity = 100,
                    Unit = new Unit
                    {
                        Name = "kilogram",
                        Acronym = "kg",
                    },
                    Price = 1.50m,
                    DeliveryPrice = 0.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                },
                new Product
                {
                    Name = "Apple",
                    Categoy = "fruits",
                    Description = "Apple",
                    Quantity = 100,
                    Unit = new Unit
                    {
                        Name = "kilogram",
                        Acronym = "kg",
                    },
                    Price = 1.50m,
                    DeliveryPrice = 0.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                },
                new Product
                {
                    Name = "Tomato",
                    Categoy = "vegetables",
                    Description = "Tomato",
                    Quantity = 100,
                    Unit = new Unit
                    {
                        Name = "kilogram",
                        Acronym = "kg",
                    },
                    Price = 1.50m,
                    DeliveryPrice = 0.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                },
                new Product
                {
                    Name = "Potato",
                    Categoy = "vegetables",
                    Description = "Potato",
                    Quantity = 100,
                    Unit = new Unit
                    {
                        Name = "kilogram",
                        Acronym = "kg",
                    },
                    Price = 1.50m,
                    DeliveryPrice = 0.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                },
                new Product
                {
                    Name = "Pork tenderloin",
                    Categoy = "meat",
                    Description = "Pork tenderloin",
                    Quantity = 100,
                    Unit = new Unit
                    {
                        Name = "kilogram",
                        Acronym = "kg",
                    },
                    Price = 5.50m,
                    DeliveryPrice = 1.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                },
                new Product
                {
                    Name = "Chicken",
                    Categoy = "meat",
                    Description = "Chicken",
                    Quantity = 100,
                    Unit = new Unit
                    {
                        Name = "pack",
                        Acronym = "pack",
                    },
                    Price = 4.50m,
                    DeliveryPrice = 1.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                },
                new Product
                {
                    Name = "Beef",
                    Categoy = "meat",
                    Description = "Beef",
                    Quantity = 100,
                    Unit = new Unit
                    {
                        Name = "kilogram",
                        Acronym = "kg",
                    },
                    Price = 6.50m,
                    DeliveryPrice = 1.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                },
                new Product
                {
                    Name = "Lasagna",
                    Categoy = "ready meals",
                    Description = "Lasagna",
                    Quantity = 50,
                    Unit = new Unit
                    {
                        Name = "pack",
                        Acronym = "pack",
                    },
                    Price = 3.50m,
                    DeliveryPrice = 1.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                },
                new Product
                {
                    Name = "Pizza",
                    Categoy = "ready meals",
                    Description = "Pizza",
                    Quantity = 50,
                    Unit = new Unit
                    {
                        Name = "pack",
                        Acronym = "pack",
                    },
                    Price = 3.50m,
                    DeliveryPrice = 1.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                },
                new Product
                {
                    Name = "Pasta",
                    Categoy = "ready meals",
                    Description = "Pasta",
                    Quantity = 50,
                    Unit = new Unit
                    {
                        Name = "pack",
                        Acronym = "pack",
                    },
                    Price = 3.50m,
                    DeliveryPrice = 1.50m,
                    CreatedOn = DateTime.UtcNow,
                    ModifiedOn = DateTime.UtcNow,
                    IsDeleted = false,
                }
            };

            await context.Products.AddRangeAsync(products);
            await context.SaveChangesAsync();
        }
    }
}