using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using WebLibrary.Backend.Database.Entity;

namespace WebLibrary.Backend.Lib;

[AttributeUsage(AttributeTargets.Class|AttributeTargets.Method)]
public sealed class RequireRole(UserRole rights) : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;
        if (user.Identity?.IsAuthenticated != true)
        {
            context.Result = new UnauthorizedResult();
            return;
        }
        
        var claim = user.Claims.FirstOrDefault(o => o.Type.EndsWith("role"))?.Value;
        
        if (claim == null || !Enum.TryParse(claim,out UserRole role) || (byte)role < (byte)rights)
        {
            context.Result = new ForbidResult();
        }
    }
}