namespace WebLibrary.Backend.Requests;

public sealed class UserUpdateInfoRequest
{
    public string? NewName { get; set; }
    public DateOnly? NewBirth { get; set; }
}

public sealed class UserUpdatePasswordRequest
{
    public string? CurrentPassword { get; set; }
    public string? NewPassword { get; set; }
}
