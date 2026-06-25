using System.Linq.Expressions;
using TaskManager.Api.Models;
using TaskStatus = TaskManager.Api.Models.TaskStatus;

namespace TaskManager.Api.DTOs;

public class TaskDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTimeOffset? DueDate { get; set; }
    public TaskStatus Status { get; set; }
    public DateTimeOffset CreatedAt { get; set; }

    public static Expression<Func<TaskItem, TaskDto>> Projection => task => new TaskDto
    {
        Id = task.Id,
        Title = task.Title,
        Description = task.Description,
        DueDate = task.DueDate,
        Status = task.Status,
        CreatedAt = task.CreatedAt
    };

    public static TaskDto FromEntity(TaskItem task) => new()
    {
        Id = task.Id,
        Title = task.Title,
        Description = task.Description,
        DueDate = task.DueDate,
        Status = task.Status,
        CreatedAt = task.CreatedAt
    };
}
