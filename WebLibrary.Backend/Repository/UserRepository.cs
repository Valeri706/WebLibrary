using Microsoft.EntityFrameworkCore;
using WebLibrary.Backend.Database;
using WebLibrary.Backend.Database.Entity;
using WebLibrary.Backend.Repository.Base;
using WebLibrary.Backend.Repository.Interfaces;

namespace WebLibrary.Backend.Repository;

public sealed class UserRepository(EntityContext context) : 
    BaseCrudRepository<User>(context, context.Users), IUserRepository
{
    public DbSet<User> Users { get; } = context.Users;
}