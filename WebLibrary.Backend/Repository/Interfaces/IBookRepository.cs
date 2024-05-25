using Microsoft.EntityFrameworkCore;
using WebLibrary.Backend.Database.Entity;

namespace WebLibrary.Backend.Repository.Interfaces;

public interface IBookRepository : ICrudRepository<Book>
{
    public DbSet<Book> Books { get; }
}