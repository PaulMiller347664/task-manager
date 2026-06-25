namespace TaskManager.Api.Models;

public enum TaskStatus
{
    Incomplete = 0,
    Complete = 1
}

public class TaskItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTimeOffset? DueDate { get; set; }
    public TaskStatus Status { get; set; } = TaskStatus.Incomplete;
    public DateTimeOffset CreatedAt { get; set; }

    public int UserId { get; set; }
    public User? User { get; set; }
}
