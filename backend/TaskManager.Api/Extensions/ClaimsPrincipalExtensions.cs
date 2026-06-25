using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace TaskManager.Api.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static int GetUserId(this ClaimsPrincipal principal)
    {
        var value = principal.FindFirstValue(JwtRegisteredClaimNames.Sub)
                    ?? principal.FindFirstValue(ClaimTypes.NameIdentifier);

        if (int.TryParse(value, out var userId))
        {
            return userId;
        }

        throw new InvalidOperationException("Authenticated user id claim is missing or invalid.");
    }
}
