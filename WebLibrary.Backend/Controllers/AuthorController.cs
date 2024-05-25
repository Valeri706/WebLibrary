using WebLibrary.Backend.Database.Entity;
using WebLibrary.Backend.Repository.Interfaces;

namespace WebLibrary.Backend.Controllers;

public sealed class AuthorController(IAuthorRepository repository) :
    AbstractController<Author>(repository);