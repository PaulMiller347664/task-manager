using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace TaskManager.Tests;

public static class TestHelpers
{
    public static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public static async Task<HttpClient> CreateAuthenticatedClientAsync(
        TestWebApplicationFactory factory,
        string email,
        string password = "Password123!")
    {
        var client = factory.CreateClient();

        var registerResponse = await client.PostAsJsonAsync("/api/auth/register", new
        {
            email,
            password
        });
        registerResponse.EnsureSuccessStatusCode();

        var auth = await registerResponse.Content.ReadFromJsonAsync<AuthPayload>(JsonOptions);
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", auth!.Token);

        return client;
    }

    public static async Task<int> CreateTaskAsync(HttpClient client, string title = "Test task")
    {
        var response = await client.PostAsJsonAsync("/api/tasks", new { title });
        response.EnsureSuccessStatusCode();

        var task = await response.Content.ReadFromJsonAsync<TaskPayload>(JsonOptions);
        return task!.Id;
    }

    public record AuthPayload(string Token, string Email);

    public record TaskPayload(int Id, string Title);
}
