using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace WebLibrary.Backend.Repository.Interfaces;

public interface ICrudRepository<T> where T : class
{
    public EntityEntry<T> Add(T entity);
    public T AddWithCommit(T entity);

    public T? Find(object id);
    public bool Exists(Func<T,bool> func);

    public void Update(T entity, bool save);

    public bool DeleteById(object id, bool save);
    public bool Delete(T entity, bool save);
}