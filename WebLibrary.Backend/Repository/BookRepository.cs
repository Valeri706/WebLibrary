using Microsoft.EntityFrameworkCore;
using WebLibrary.Backend.Database;
using WebLibrary.Backend.Database.Entity;
using WebLibrary.Backend.Repository.Base;
using WebLibrary.Backend.Repository.Interfaces;

namespace WebLibrary.Backend.Repository;

public sealed class BookRepository(EntityContext context) : 
    BaseCrudRepository<Book>(context, context.Books), IBookRepository
{
    public DbSet<Book> Books { get; } = context.Books;
}