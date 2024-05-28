using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebLibrary.Backend.Database.Entity;
using WebLibrary.Backend.Lib;
using WebLibrary.Backend.Repository.Interfaces;

namespace WebLibrary.Backend.Controllers;

public sealed class CategoryController(ICategoryRepository repository) :
    AbstractController<Category>(repository)
{
    [HttpGet]
    public Category[] GetRange(int offset = 0, int limit = 0)
    {
        var query = repository.Categories.Skip(offset);
        if (limit > 0)
        {
            query = query.Take(limit);
        }

        return query.OrderBy(o => o.Id).ToArray();
    }

    [HttpGet]
    public Category[] Search(string name)
    {
        if (string.IsNullOrEmpty(name))
        {
            return [];
        }

        return repository.Categories
            .Where(o => EF.Functions.ILike(o.Name, $"%{name}%")).ToArray();
    }
}