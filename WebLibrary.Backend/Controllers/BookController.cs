using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebLibrary.Backend.Database;
using WebLibrary.Backend.Database.Entity;
using WebLibrary.Backend.Repository.Interfaces;

namespace WebLibrary.Backend.Controllers;

public sealed class BookController(IBookRepository repository, EntityContext context) :
    AbstractController<Book>(repository)
{
    [HttpGet]
    public Book[] GetRange(int offset = 0, int limit = 0)
    {
        var query = repository.Books.Skip(offset);
        if (limit > 0)
        {
            query = query.Take(limit);
        }

        return query.OrderBy(o => o.Id).ToArray();
    }

    [HttpGet]
    [Authorize]
    public IActionResult FindUserBook(int id)
    {
        var userId = int.Parse(HttpContext.User.Claims.First(o => o.Type == "id").Value);
        var book = context.Database.SqlQuery<BookWithInfo>(
            $"""
             SELECT b.*,
                    ub.user_id IS NOT NULL AS in_library,
                    a.name as author_name,
                    c.name as category_name
             FROM book b
                      JOIN author a ON a.id = b.author_id
                      LEFT JOIN user_book ub
                                ON b.id = ub.book_id AND ub.user_id = {userId}
                      LEFT JOIN category c
                                ON c.id = b.category_id
             WHERE b.id = {id}
             """).FirstOrDefault();

        if (book == null)
        {
            return NotFound();
        }

        return Ok(book);
    }
    
    [HttpGet]
    [Authorize]
    public IActionResult AddToCollection(int id)
    {
        var userId = int.Parse(HttpContext.User.Claims.First(o => o.Type == "id").Value);
        try
        {
            context.UserBooks.Add(new UserBook { BookId = id, UserId = userId });
            context.SaveChanges();
        }
        catch
        {
            return Conflict();
        }

        return Ok();
    }
    
    [HttpDelete]
    [Authorize]
    public IActionResult RemoveFromCollection(int id)
    {
        var userId = int.Parse(HttpContext.User.Claims.First(o => o.Type == "id").Value);
        var book = context.UserBooks.FirstOrDefault(o => o.BookId == id && o.UserId == userId);
        if (book == null)
        {
            return NotFound();
        }

        context.UserBooks.Remove(book);
        context.SaveChanges();
        return Ok();
    }
    
    [HttpGet]
    [Authorize]
    public Book[] MyBooks()
    {
        var userId = int.Parse(HttpContext.User.Claims.First(o => o.Type == "id").Value);
        return repository.Books.FromSql($"""
                                        SELECT b.*
                                        FROM book b
                                                 JOIN user_book ub ON b.id = ub.book_id
                                        WHERE ub.user_id = {userId}
                                        """).ToArray();
    }
}