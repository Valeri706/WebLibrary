using Microsoft.EntityFrameworkCore;
using WebLibrary.Backend.Database.Entity;

namespace WebLibrary.Backend.Database;

public class EntityContext(DbContextOptions<EntityContext> options, IConfiguration configuration) : DbContext(options)
{
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Author> Authors { get; set; } = null!;
    public DbSet<Category> Categories { get; set; } = null!;
    public DbSet<Book> Books { get; set; } = null!;
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseIdentityColumns();
        base.OnModelCreating(modelBuilder);
    }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(configuration.GetConnectionString("Database"));
    }
}