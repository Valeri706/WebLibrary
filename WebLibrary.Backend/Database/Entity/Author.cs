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
    public required string Name { get; init; }
    
    [Column("biography")]
    public required string Biography { get; init; }
    
    [Column("birth_date")]
    public DateTime? BirthDate { get; init; }
    
    [Column("death_date")]
    public DateTime? DeathDate { get; init; }
}