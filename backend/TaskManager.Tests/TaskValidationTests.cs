using System.Net;
using System.Net.Http.Json;

namespace TaskManager.Tests;

public class TaskValidationTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly TestWebApplicationFactory _factory;

    public TaskValidationTests(TestWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Empty_Title_Is_Rejected()
    {
        var client = await TestHelpers.CreateAuthenticatedClientAsync(_factory, "validation-title@example.com");

        var response = await client.PostAsJsonAsync("/api/tasks", new { title = "" });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        var problem = await response.Content.ReadFromJsonAsync<ValidationProblem>(TestHelpers.JsonOptions);
        Assert.NotNull(problem);
        Assert.True(problem!.Errors.ContainsKey("Title"));
    }

    [Fact]
    public async Task Whitespace_Only_Title_Is_Rejected()
    {
        var client = await TestHelpers.CreateAuthenticatedClientAsync(_factory, "validation-whitespace@example.com");

        var response = await client.PostAsJsonAsync("/api/tasks", new { title = "   " });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        var problem = await response.Content.ReadFromJsonAsync<ValidationProblem>(TestHelpers.JsonOptions);
        Assert.NotNull(problem);
        Assert.True(problem!.Errors.ContainsKey("Title"));
    }

    [Fact]
    public async Task Past_Due_Date_Is_Rejected()
    {
        var client = await TestHelpers.CreateAuthenticatedClientAsync(_factory, "validation-date@example.com");

        var pastDue = DateTimeOffset.UtcNow.AddDays(-1).ToString("o");
        var response = await client.PostAsJsonAsync("/api/tasks", new { title = "Valid title", dueDate = pastDue });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        var problem = await response.Content.ReadFromJsonAsync<ValidationProblem>(TestHelpers.JsonOptions);
        Assert.NotNull(problem);
        Assert.True(problem!.Errors.ContainsKey("DueDate"));
    }

    [Fact]
    public async Task Future_Due_Date_Is_Accepted()
    {
        var client = await TestHelpers.CreateAuthenticatedClientAsync(_factory, "validation-future@example.com");

        var futureDue = DateTimeOffset.UtcNow.AddDays(1).ToString("o");
        var response = await client.PostAsJsonAsync("/api/tasks", new { title = "Future task", dueDate = futureDue });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    private record ValidationProblem(string Title, int Status, Dictionary<string, string[]> Errors);
}
