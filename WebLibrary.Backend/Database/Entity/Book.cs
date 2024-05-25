using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebLibrary.Backend.Database.Entity;

[Table("book")]
public sealed class Book
{
    [Key]
    [Column("id")]
    public int Id { get; init; }
    
    [Column("title")]
    public required string Title { get; init; }

    [Column("published_date")] 
    public required DateTime PublishedDate { get; init; }
    
    [Column("summary")]
    public required string Summary { get; init; }
    
    [Column("cover_image_url")]
    public string? CoverImageUrl { get; init; }
    
    [Column("author_id")]
    public required int AuthorId { get; init; }
    
    [Column("category_id")]
    public required int CategoryId { get; init; }
}