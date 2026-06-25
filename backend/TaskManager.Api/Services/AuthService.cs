using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using TaskManager.Api.Data;
using TaskManager.Api.DTOs;
using TaskManager.Api.Models;

namespace TaskManager.Api.Services;

public enum AuthError
{
    None,
    EmailAlreadyExists,
    InvalidCredentials
}

public record AuthResult(AuthResponse? Response, AuthError Error)
{
    public bool Succeeded => Error == AuthError.None;
}

public class AuthService
{
    private readonly AppDbContext _db;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly JwtSettings _jwt;

    public AuthService(
        AppDbContext db,
        IPasswordHasher<User> passwordHasher,
        IOptions<JwtSettings> jwt)
    {
        _db = db;
        _passwordHasher = passwordHasher;
        _jwt = jwt.Value;
    }

    public async Task<AuthResult> RegisterAsync(RegisterRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var exists = await _db.Users.AnyAsync(u => u.Email == email);
        if (exists)
        {
            return new AuthResult(null, AuthError.EmailAlreadyExists);
        }

        var user = new User
        {
            Email = email,
            CreatedAt = DateTimeOffset.UtcNow
        };
        user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return new AuthResult(BuildToken(user), AuthError.None);
    }

    public async Task<AuthResult> LoginAsync(LoginRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var user = await _db.Users
            .Where(u => u.Email == email)
            .Select(u => new User
            {
                Id = u.Id,
                Email = u.Email,
                PasswordHash = u.PasswordHash,
            })
            .FirstOrDefaultAsync();
        if (user is null)
        {
            return new AuthResult(null, AuthError.InvalidCredentials);
        }

        var verification = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (verification == PasswordVerificationResult.Failed)
        {
            return new AuthResult(null, AuthError.InvalidCredentials);
        }

        return new AuthResult(BuildToken(user), AuthError.None);
    }

    private AuthResponse BuildToken(User user)
    {
        var expiresAt = DateTimeOffset.UtcNow.AddHours(_jwt.ExpiryHours);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Key));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _jwt.Issuer,
            audience: _jwt.Audience,
            claims: claims,
            expires: expiresAt.UtcDateTime,
            signingCredentials: credentials);

        return new AuthResponse
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            Email = user.Email,
            ExpiresAt = expiresAt
        };
    }
}
