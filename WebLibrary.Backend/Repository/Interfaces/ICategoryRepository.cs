using Microsoft.EntityFrameworkCore;
using WebLibrary.Backend.Database.Entity;

namespace WebLibrary.Backend.Repository.Interfaces;

public interface ICategoryRepository : ICrudRepository<Category>
{
    public DbSet<Category> Categories { get; }
}