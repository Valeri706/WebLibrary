using Microsoft.EntityFrameworkCore;
using WebLibrary.Backend.Database;
using WebLibrary.Backend.Database.Entity;
using WebLibrary.Backend.Repository.Base;

namespace WebLibrary.Backend.Repository.Interfaces;

public interface IAuthorRepository :  ICrudRepository<Author>
{
    public DbSet<Author> Authors { get; }
}