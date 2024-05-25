using Microsoft.EntityFrameworkCore;
using WebLibrary.Backend.Database.Entity;

namespace WebLibrary.Backend.Repository.Interfaces;

public interface IUserRepository : ICrudRepository<User>
{
    public DbSet<User> Users { get; }
}