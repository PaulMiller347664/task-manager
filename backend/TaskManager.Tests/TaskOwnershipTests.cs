using System.Net;
using System.Net.Http.Json;

namespace TaskManager.Tests;

public class TaskOwnershipTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly TestWebApplicationFactory _factory;

    public TaskOwnershipTests(TestWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task UserB_Cannot_Access_UserA_Task()
    {
        var userA = await TestHelpers.CreateAuthenticatedClientAsync(_factory, "owner-a@example.com");
        var userB = await TestHelpers.CreateAuthenticatedClientAsync(_factory, "owner-b@example.com");

        var taskId = await TestHelpers.CreateTaskAsync(userA, "User A private task");

        // User B should not be able to read User A's task.
        var getResponse = await userB.GetAsync($"/api/tasks/{taskId}");
        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);

        // User B should not be able to update it.
        var putResponse = await userB.PutAsJsonAsync($"/api/tasks/{taskId}", new { title = "Hijacked" });
        Assert.Equal(HttpStatusCode.NotFound, putResponse.StatusCode);

        // User B should not be able to change its status.
        var patchResponse = await userB.PatchAsJsonAsync($"/api/tasks/{taskId}/status", new { status = 1 });
        Assert.Equal(HttpStatusCode.NotFound, patchResponse.StatusCode);

        // User B should not be able to delete it.
        var deleteResponse = await userB.DeleteAsync($"/api/tasks/{taskId}");
        Assert.Equal(HttpStatusCode.NotFound, deleteResponse.StatusCode);

        // The task must still exist for User A.
        var ownerGet = await userA.GetAsync($"/api/tasks/{taskId}");
        Assert.Equal(HttpStatusCode.OK, ownerGet.StatusCode);
    }

    [Fact]
    public async Task UserB_Task_List_Does_Not_Include_UserA_Tasks()
    {
        var userA = await TestHelpers.CreateAuthenticatedClientAsync(_factory, "list-a@example.com");
        var userB = await TestHelpers.CreateAuthenticatedClientAsync(_factory, "list-b@example.com");

        await TestHelpers.CreateTaskAsync(userA, "A only");

        var response = await userB.GetAsync("/api/tasks?page=1&pageSize=10");
        response.EnsureSuccessStatusCode();

        var page = await response.Content.ReadFromJsonAsync<PagePayload>(TestHelpers.JsonOptions);
        Assert.NotNull(page);
        Assert.Equal(0, page!.TotalCount);
        Assert.Empty(page.Items);
    }

    [Fact]
    public async Task Unauthenticated_Request_Is_Rejected()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/tasks");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    private record PagePayload(List<TestHelpers.TaskPayload> Items, int TotalCount, int Page, int PageSize);
}
