using Microsoft.EntityFrameworkCore;
using WebLibrary.Backend.Database;
using WebLibrary.Backend.Database.Entity;
using WebLibrary.Backend.Repository.Base;
using WebLibrary.Backend.Repository.Interfaces;

namespace WebLibrary.Backend.Repository;

public sealed class AuthorRepository(EntityContext context) : 
    BaseCrudRepository<Author>(context, context.Authors), IAuthorRepository
{
    public DbSet<Author> Authors { get; } = context.Authors;
}