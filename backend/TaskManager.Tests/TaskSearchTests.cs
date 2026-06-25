using System.Net;
using System.Net.Http.Json;

namespace TaskManager.Tests;

public class TaskSearchTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly TestWebApplicationFactory _factory;

    public TaskSearchTests(TestWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetTasks_Searches_By_Title_Description_And_Id()
    {
        var client = await TestHelpers.CreateAuthenticatedClientAsync(_factory, "search@example.com");

        var alphaResponse = await client.PostAsJsonAsync("/api/tasks", new
        {
            title = "Alpha release checklist",
            description = "Prepare launch notes",
        });
        alphaResponse.EnsureSuccessStatusCode();
        var alpha = await alphaResponse.Content.ReadFromJsonAsync<TaskPayload>(TestHelpers.JsonOptions);

        await TestHelpers.CreateTaskAsync(client, "Beta testing plan");

        var byTitle = await client.GetAsync("/api/tasks?search=alpha");
        byTitle.EnsureSuccessStatusCode();
        var titlePage = await byTitle.Content.ReadFromJsonAsync<PagePayload>(TestHelpers.JsonOptions);
        Assert.NotNull(titlePage);
        Assert.Equal(1, titlePage!.TotalCount);
        Assert.Contains(titlePage.Items, t => t.Title.Contains("Alpha", StringComparison.OrdinalIgnoreCase));

        var byDescription = await client.GetAsync("/api/tasks?search=launch");
        byDescription.EnsureSuccessStatusCode();
        var descriptionPage = await byDescription.Content.ReadFromJsonAsync<PagePayload>(TestHelpers.JsonOptions);
        Assert.NotNull(descriptionPage);
        Assert.Equal(1, descriptionPage!.TotalCount);
        Assert.Equal(alpha!.Id, descriptionPage.Items[0].Id);

        var byId = await client.GetAsync($"/api/tasks?search={alpha.Id}");
        byId.EnsureSuccessStatusCode();
        var idPage = await byId.Content.ReadFromJsonAsync<PagePayload>(TestHelpers.JsonOptions);
        Assert.NotNull(idPage);
        Assert.Equal(1, idPage!.TotalCount);
        Assert.Equal(alpha.Id, idPage.Items[0].Id);
    }

    [Fact]
    public async Task GetTasks_Search_Combines_With_Status_Filter()
    {
        var client = await TestHelpers.CreateAuthenticatedClientAsync(_factory, "search-filter@example.com");

        var openId = await TestHelpers.CreateTaskAsync(client, "Searchable open task");
        var doneId = await TestHelpers.CreateTaskAsync(client, "Searchable done task");
        var patchResponse = await client.PatchAsJsonAsync(
            $"/api/tasks/{doneId}/status",
            new { status = 1 });
        patchResponse.EnsureSuccessStatusCode();

        var response = await client.GetAsync("/api/tasks?search=searchable&status=0");
        response.EnsureSuccessStatusCode();

        var page = await response.Content.ReadFromJsonAsync<PagePayload>(TestHelpers.JsonOptions);
        Assert.NotNull(page);
        Assert.Equal(1, page!.TotalCount);
        Assert.Equal(openId, page.Items[0].Id);
    }

    private record PagePayload(List<TaskPayload> Items, int TotalCount, int Page, int PageSize);

    private record TaskPayload(int Id, string Title, string? Description, int Status);
}
