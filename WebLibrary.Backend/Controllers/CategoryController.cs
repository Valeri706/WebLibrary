using WebLibrary.Backend.Database.Entity;
using WebLibrary.Backend.Repository.Interfaces;

namespace WebLibrary.Backend.Controllers;

public sealed class CategoryController(ICategoryRepository repository) :
    AbstractController<Category>(repository);