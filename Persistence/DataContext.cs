using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }

        public DbSet<Deliveries> Deliveries { get; set; }

        public DbSet<DeliveredProduct> DeliveredProducts { get; set; }

        public DbSet<Unit> Units { get; set; }

        public DbSet<Company> Companies { get; set; }

        public DbSet<Partner> Partners { get; set; }

        public DbSet<DeliveryAddress> DeliveryAddress { get; set; }

        public DbSet<Order> Orders { get; set; }

        public DbSet<OrderProduct> OrderProducts { get; set; }

        public DbSet<Warehouse> Warehouses { get; set; }

        public DbSet<Photo> Photos { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            foreach (var relationship in builder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.Restrict;
            }

            base.OnModelCreating(builder);

            builder.Entity<Product>()
                .Property(p => p.Price).HasPrecision(18, 4);

            builder.Entity<Product>()
                .HasIndex(u => new { u.Name, u.UnitId }).IsUnique();

            builder.Entity<Product>()
                .Property(p => p.DeliveryPrice).HasPrecision(18, 4);

            builder.Entity<OrderProduct>()
                .Property(p => p.Price).HasPrecision(18, 4);

            builder.Entity<OrderProduct>()
                .Property(p => p.TotalPrice).HasPrecision(18, 4);

            builder.Entity<DeliveredProduct>()
                .Property(p => p.Price).HasPrecision(18, 4);

            builder.Entity<DeliveredProduct>()
                .Property(p => p.DeliveryPrice).HasPrecision(18, 4);

            builder.Entity<Warehouse>()
                .HasIndex(u => u.Name).IsUnique();
        }
    }
}