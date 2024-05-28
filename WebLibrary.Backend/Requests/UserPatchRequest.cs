namespace WebLibrary.Backend.Requests;

public sealed class UserPatchRequest
{
    public required int Id { get; set; }
    public string Name { get; set; }
    public string Password { get; set; }
    public string Role { get; set; }
}