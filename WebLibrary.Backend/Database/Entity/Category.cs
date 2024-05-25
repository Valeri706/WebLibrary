using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebLibrary.Backend.Database.Entity;

[Table("category")]
public sealed class Category
{
    [Key]
    [Column("id")]
    public int Id { get; init; }
    
    [Column("name")]
    public required string Name { get; init; }
    
    [Column("description")]
    public required string Description { get; init; }
}