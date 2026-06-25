using System.Net;
using System.Net.Http.Json;

namespace TaskManager.Tests;

public class TaskFilterTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly TestWebApplicationFactory _factory;

    public TaskFilterTests(TestWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetTasks_Filters_By_Status()
    {
        var client = await TestHelpers.CreateAuthenticatedClientAsync(_factory, "filter@example.com");

        await TestHelpers.CreateTaskAsync(client, "Incomplete task");
        var completeId = await TestHelpers.CreateTaskAsync(client, "Complete task");
        var patchResponse = await client.PatchAsJsonAsync(
            $"/api/tasks/{completeId}/status",
            new { status = 1 });
        patchResponse.EnsureSuccessStatusCode();

        var allResponse = await client.GetAsync("/api/tasks?page=1&pageSize=10");
        allResponse.EnsureSuccessStatusCode();
        var allPage = await allResponse.Content.ReadFromJsonAsync<PagePayload>(TestHelpers.JsonOptions);
        Assert.NotNull(allPage);
        Assert.Equal(2, allPage!.TotalCount);

        var completeResponse = await client.GetAsync("/api/tasks?page=1&pageSize=10&status=1");
        completeResponse.EnsureSuccessStatusCode();
        var completePage = await completeResponse.Content.ReadFromJsonAsync<PagePayload>(TestHelpers.JsonOptions);
        Assert.NotNull(completePage);
        Assert.Equal(1, completePage!.TotalCount);
        Assert.All(completePage.Items, t => Assert.Equal(1, t.Status));

        var incompleteResponse = await client.GetAsync("/api/tasks?page=1&pageSize=10&status=0");
        incompleteResponse.EnsureSuccessStatusCode();
        var incompletePage = await incompleteResponse.Content.ReadFromJsonAsync<PagePayload>(TestHelpers.JsonOptions);
        Assert.NotNull(incompletePage);
        Assert.Equal(1, incompletePage!.TotalCount);
        Assert.All(incompletePage.Items, t => Assert.Equal(0, t.Status));
    }

    [Fact]
    public async Task GetTasks_Invalid_Status_Returns_BadRequest()
    {
        var client = await TestHelpers.CreateAuthenticatedClientAsync(_factory, "bad-filter@example.com");

        var response = await client.GetAsync("/api/tasks?status=99");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    private record PagePayload(List<TaskPayload> Items, int TotalCount, int Page, int PageSize);

    private record TaskPayload(int Id, string Title, int Status);
}
