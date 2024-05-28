using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebLibrary.Backend.Database.Entity;
using WebLibrary.Backend.Lib;
using WebLibrary.Backend.Repository.Interfaces;

namespace WebLibrary.Backend.Controllers;

public sealed class AuthorController(IAuthorRepository repository) :
    AbstractController<Author>(repository)
{
    [HttpGet]
    [Authorize]
    public Author[] GetRange(int offset = 0, int limit = 0)
    {
        var query = repository.Authors.Skip(offset);
        if (limit > 0)
        {
            query = query.Take(limit);
        }

        return query.OrderBy(o => o.Id).ToArray();
    }
    
    [HttpGet]
    public Author[] Search(string name)
    {
        if (string.IsNullOrEmpty(name))
        {
            return [];
        }

        return repository.Authors
            .Where(o => EF.Functions.ILike(o.Name, $"%{name}%")).ToArray();
    }
}