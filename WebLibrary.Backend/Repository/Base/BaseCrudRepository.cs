using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using WebLibrary.Backend.Repository.Interfaces;

namespace WebLibrary.Backend.Repository.Base;

public class BaseCrudRepository<T>(DbContext context, DbSet<T> set) : ICrudRepository<T> where T : class
{
    public EntityEntry<T> Add(T entity) => set.Add(entity);

    public bool Exists(Func<T,bool> expression)
    {
        return set.Any(expression);
    }

    public T AddWithCommit(T entity)
    {
        var entry = Add(entity);
        context.SaveChanges();
        return entry.Entity;
    }

    public T? Find(object id) => set.Find(id);

    public void Update(T entity, bool save = true)
    {
        set.Update(entity);
        if (save)
        {
            context.SaveChanges();
        }
    }

    public bool DeleteById(object id, bool save = true) => Delete(set.Find(id));

    public bool Delete(T? entity, bool save = true)
    {
        if (entity == default)
        {
            return false;
        }
        
        set.Remove(entity);
        if (save)
        {
            context.SaveChanges();
        }
        return true;
    }
}