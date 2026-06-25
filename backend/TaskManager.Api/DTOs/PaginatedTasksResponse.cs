namespace TaskManager.Api.DTOs;

public class PaginatedTasksResponse
{
    public IReadOnlyList<TaskDto> Items { get; set; } = Array.Empty<TaskDto>();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}
