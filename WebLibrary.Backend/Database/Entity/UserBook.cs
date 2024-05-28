using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebLibrary.Backend.Database.Entity;

[Table("user_book")]
public sealed class UserBook
{
    [Key]
    [Column("user_id")]
    public required int UserId { get; init; }

    [Column("book_id")]
    public required int BookId { get; init; }
}