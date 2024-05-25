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
                new Claim("id", user.Id.ToString())
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
}