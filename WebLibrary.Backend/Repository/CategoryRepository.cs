using Microsoft.EntityFrameworkCore;
using WebLibrary.Backend.Database;
using WebLibrary.Backend.Database.Entity;
using WebLibrary.Backend.Repository.Base;
using WebLibrary.Backend.Repository.Interfaces;

namespace WebLibrary.Backend.Repository;

public sealed class CategoryRepository(EntityContext context) : 
    BaseCrudRepository<Category>(context, context.Categories), ICategoryRepository
{
    public DbSet<Category> Categories { get; } = context.Categories;
}