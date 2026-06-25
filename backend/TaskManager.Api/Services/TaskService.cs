using Microsoft.EntityFrameworkCore;
using TaskManager.Api.Data;
using TaskManager.Api.DTOs;
using TaskManager.Api.Models;
using TaskStatus = TaskManager.Api.Models.TaskStatus;

namespace TaskManager.Api.Services;

public class TaskService
{
    private const int MaxPageSize = 50;
    private const int MaxSearchLength = 200;

    private readonly AppDbContext _db;

    public TaskService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<PaginatedTasksResponse> GetTasksAsync(
        int userId,
        int page,
        int pageSize,
        TaskStatus? status = null,
        string? search = null)
    {
        page = page < 1 ? 1 : page;
        pageSize = pageSize < 1 ? 10 : Math.Min(pageSize, MaxPageSize);

        var query = _db.Tasks.Where(t => t.UserId == userId);

        if (status.HasValue)
        {
            query = query.Where(t => t.Status == status.Value);
        }

        query = ApplySearch(query, search);

        var totalCount = await query.CountAsync();

        // Order by Id descending (newest first). Ids are sequential, so this matches
        // creation order while avoiding SQLite's lack of DateTimeOffset ordering support.
        var items = await query
            .OrderByDescending(t => t.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(TaskDto.Projection)
            .ToListAsync();

        return new PaginatedTasksResponse
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<TaskDto?> GetTaskAsync(int userId, int taskId) =>
        await _db.Tasks
            .Where(t => t.Id == taskId && t.UserId == userId)
            .Select(TaskDto.Projection)
            .FirstOrDefaultAsync();

    public async Task<TaskDto> CreateTaskAsync(int userId, CreateTaskRequest request)
    {
        var task = new TaskItem
        {
            Title = request.Title.Trim(),
            Description = request.Description,
            DueDate = request.DueDate?.ToUniversalTime(),
            Status = TaskStatus.Incomplete,
            UserId = userId,
            CreatedAt = DateTimeOffset.UtcNow
        };

        _db.Tasks.Add(task);
        await _db.SaveChangesAsync();

        return TaskDto.FromEntity(task);
    }

    public async Task<TaskDto?> UpdateTaskAsync(int userId, int taskId, UpdateTaskRequest request)
    {
        var task = await FindOwnedAsync(userId, taskId);
        if (task is null)
        {
            return null;
        }

        task.Title = request.Title.Trim();
        task.Description = request.Description;
        task.DueDate = request.DueDate?.ToUniversalTime();

        await _db.SaveChangesAsync();

        return TaskDto.FromEntity(task);
    }

    public async Task<TaskDto?> UpdateStatusAsync(int userId, int taskId, TaskStatus status)
    {
        var task = await FindOwnedAsync(userId, taskId);
        if (task is null)
        {
            return null;
        }

        task.Status = status;
        await _db.SaveChangesAsync();

        return TaskDto.FromEntity(task);
    }

    public async Task<bool> DeleteTaskAsync(int userId, int taskId)
    {
        var task = await FindOwnedAsync(userId, taskId);
        if (task is null)
        {
            return false;
        }

        _db.Tasks.Remove(task);
        await _db.SaveChangesAsync();

        return true;
    }

    private Task<TaskItem?> FindOwnedAsync(int userId, int taskId) =>
        _db.Tasks.FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId);

    private static IQueryable<TaskItem> ApplySearch(IQueryable<TaskItem> query, string? search)
    {
        if (string.IsNullOrWhiteSpace(search))
        {
            return query;
        }

        var term = search.Trim();
        if (term.Length > MaxSearchLength)
        {
            term = term[..MaxSearchLength];
        }

        var termLower = term.ToLowerInvariant();

        if (int.TryParse(term, out var taskId))
        {
            return query.Where(t =>
                t.Id == taskId ||
                t.Title.ToLower().Contains(termLower) ||
                (t.Description != null && t.Description.ToLower().Contains(termLower)));
        }

        return query.Where(t =>
            t.Title.ToLower().Contains(termLower) ||
            (t.Description != null && t.Description.ToLower().Contains(termLower)));
    }
}
