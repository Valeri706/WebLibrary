namespace WebLibrary.Backend.Requests;

public sealed class UserSignupRequest : UserLoginRequest
{
    public required string Name { get; set; }
    public DateTime? DateOfBirth { get; set; }
}