using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WebLibrary.Backend.Database.Entity;
using WebLibrary.Backend.Lib;
using WebLibrary.Backend.Repository.Interfaces;
using WebLibrary.Backend.Requests;

namespace WebLibrary.Backend.Controllers;

public sealed class UserController(IUserRepository repository, IConfiguration config) :
    AbstractController<User>(repository)
{
    private string GetJwt(User user, TimeSpan lifetime)
    {
        var key = Encoding.UTF8.GetBytes(config["Jwt:Token"]!);

        var token = new JwtSecurityToken(
            claims: [
                new Claim("name",user.Name),
                new Claim("id", user.Id.ToString()),
                new Claim("role", user.Role.ToString()),
                new Claim("email", user.Email)
            ],
            expires: DateTime.UtcNow.Add(lifetime),
            notBefore: DateTime.UtcNow,
            signingCredentials: new SigningCredentials(
                new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    
    private string Hash(string password) => Convert.ToHexString(
        SHA512.HashData(Encoding.UTF8.GetBytes(password))
    );
    
    [HttpPost]
    public IActionResult Signup([FromBody] UserSignupRequest request)
    {
        if (repository.Exists(o => o.Email == request.Email))
        {
            return Conflict("Email already exists");
        }
        
        var user = repository.AddWithCommit(
            new User
            {
                Email = request.Email.ToLower(),
                Name = request.Name,
                Birth = request.DateOfBirth,
                PasswordHash = Hash(request.Password)
            });
        
        return Ok(new
        {
            token = GetJwt(user,TimeSpan.FromHours(1))
        });
    }
    
    [HttpPost]
    public IActionResult Login([FromBody] UserLoginRequest request)
    {
        var user = repository.Users.FirstOrDefault(o => o.Email == request.Email);
        if (user == null || user.PasswordHash != Hash(request.Password))
        {
            return Unauthorized();
        }

        return Ok(new { token = GetJwt(user,TimeSpan.FromHours(1)) });
    }
    
    [HttpGet]
    [RequireRole(UserRole.Admin)]
    public User[] GetRange(int offset = 0, int limit = 0)
    {
        var query = repository.Users.Skip(offset);
        if (limit > 0)
        {
            query = query.Take(limit);
        }

        return query.OrderBy(o => o.RegisteredAt).ToArray();
    }

    [HttpPost]
    [RequireRole(UserRole.Admin)]
    public IActionResult Patch(UserPatchRequest entity)
    {
        if (!Enum.TryParse(entity.Role, out UserRole role))
        {
            return BadRequest();
        }
        
        var user = repository.Users.Find(entity.Id);
        if (user == null)
        {
            return BadRequest();
        }
        
        user.Role = role;
        user.Name = entity.Name;

        if (!string.IsNullOrEmpty(entity.Password))
        {
            user.PasswordHash = Hash(entity.Password);
        }
            
        repository.Update(user,true);
        return Ok();
    }

    [HttpPost]
    [Authorize]
    public IActionResult UpdatePassword([FromBody] UserUpdatePasswordRequest request)
    {
        if (string.IsNullOrEmpty(request.CurrentPassword))
            return BadRequest();

        var user = repository.Users.Find(int.Parse(HttpContext.User.Claims.First(o => o.Type == "id").Value));

            
        if (Hash(request.CurrentPassword) != user!.PasswordHash)
            return Forbid();


        if (string.IsNullOrEmpty(request.NewPassword))
            return BadRequest("New password is empty");
        
        user.PasswordHash = Hash(request.NewPassword);
        repository.Update(user, true);
        return Ok();
    }

    [HttpPost]
    [Authorize]
    public IActionResult UpdateSettings([FromBody] UserUpdateInfoRequest request)
    {
        var user = repository.Users.Find(int.Parse(HttpContext.User.Claims.First(o => o.Type == "id").Value));

        if (string.IsNullOrEmpty(request.NewName))
            return BadRequest();
        
        user!.Name = request.NewName;
        user.Birth = request.NewBirth;
        repository.Update(user, true);
        return Ok();
    }
    
    [HttpGet]
    [Authorize]
    public User Info()
    {
        var user = repository.Users.Find(
            int.Parse(HttpContext.User.Claims.First(o => o.Type == "id").Value)
        );
        user!.PasswordHash = "";
        return user;
    }
}