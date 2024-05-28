using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebLibrary.Backend.Database.Entity;

[Table("author")]
public sealed class Author
{
    [Key]
    [Column("id")]
    public int Id { get; init; }
    
    [Column("name")]
    public string Name { get; init; }
    
    [Column("biography")]
    public string? Biography { get; init; }
    
    [Column("birth_date")]
    public DateOnly? BirthDate { get; init; }
    
    [Column("death_date")]
    public DateOnly? DeathDate { get; init; }
}