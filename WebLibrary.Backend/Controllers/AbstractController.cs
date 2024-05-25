using Microsoft.AspNetCore.Mvc;
using WebLibrary.Backend.Lib;
using WebLibrary.Backend.Repository.Interfaces;

namespace WebLibrary.Backend.Controllers;

[ApiController]
[Route(Consts.RoutePattern)]
public abstract class AbstractController<T>(ICrudRepository<T> repository) : ControllerBase where T : class
{
    [HttpPost]
    public virtual T Add([FromBody] T entity)
    {
        return repository.AddWithCommit(entity);
    }

    [HttpGet]
    public virtual T? Find(int id)
    {
        return repository.Find(id);
    }


    [HttpPatch]
    public virtual void Update([FromBody] T entity)
    {
        repository.Update(entity,true);
    }
    
    [HttpDelete]
    public virtual void Delete(int id)
    {
        repository.DeleteById(id,true);
    }
}