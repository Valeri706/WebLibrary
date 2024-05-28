using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebLibrary.Backend.Database.Entity;

[Table("book")]
public class Book
{
    [Key]
    [Column("id")]
    public int Id { get; init; }
    
    [Column("title")]
    public required string Title { get; init; }

    [Column("published_date")] 
    public required DateOnly PublishedDate { get; init; }
    
    [Column("summary")]
    public required string Summary { get; init; }
    
    [Column("cover_image_url")]
    public string? CoverImageUrl { get; init; }
    
    [Column("author_id")]
    public required int AuthorId { get; init; }
    
    [Column("category_id")]
    public  int? CategoryId { get; init; }
}

public sealed class BookWithInfo : Book
{
    [Column("author_name")]
    public required string AuthorName { get; init; }
    [Column("in_library")]
    public required bool InLibrary { get; init; }
    
    [Column("category_name")]
    public  string? CategoryName { get; init; }
}