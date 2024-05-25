using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebLibrary.Backend.Database.Entity;

public enum UserRole
{
    Blocked = -1,
    User = 0,
    Admin = 100
}

[Table("user")]
public sealed class User
{
    [Key]
    [Column("id")]
    public int Id { get; init; }

    [Column("email")]
    [MaxLength(128)]
    public required string Email { get; init; }

    [Column("password")] 
    [MaxLength(128)]
    public required string PasswordHash { get; init; }

    [Column("name")] 
    [MaxLength(128)]
    public required string Name { get; init; }

    [Column("role")] 
    public UserRole Role { get; init; } = UserRole.User;

    [Column("registered_at")] 
    [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    public DateTime RegisteredAt { get; init; }
}