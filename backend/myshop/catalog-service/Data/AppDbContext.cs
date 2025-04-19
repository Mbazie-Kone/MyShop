using catalog_service.Models;
using Microsoft.EntityFrameworkCore;

namespace catalog_service.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Product> Products => Set<Product>();
        public DbSet<Image> Images => Set<Image>();
    }
}
