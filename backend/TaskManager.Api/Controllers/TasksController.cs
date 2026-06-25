using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Api.DTOs;
using TaskManager.Api.Extensions;
using TaskManager.Api.Services;
using TaskStatus = TaskManager.Api.Models.TaskStatus;

namespace TaskManager.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/tasks")]
public class TasksController : ControllerBase
{
    private readonly TaskService _taskService;

    public TasksController(TaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedTasksResponse>> GetTasks(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] TaskStatus? status = null,
        [FromQuery] string? search = null)
    {
        var result = await _taskService.GetTasksAsync(User.GetUserId(), page, pageSize, status, search);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TaskDto>> GetTask(int id)
    {
        var task = await _taskService.GetTaskAsync(User.GetUserId(), id);
        return task is null ? NotFoundProblem(id) : Ok(task);
    }

    [HttpPost]
    public async Task<ActionResult<TaskDto>> CreateTask([FromBody] CreateTaskRequest request)
    {
        var task = await _taskService.CreateTaskAsync(User.GetUserId(), request);
        return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<TaskDto>> UpdateTask(int id, [FromBody] UpdateTaskRequest request)
    {
        var task = await _taskService.UpdateTaskAsync(User.GetUserId(), id, request);
        return task is null ? NotFoundProblem(id) : Ok(task);
    }

    [HttpPatch("{id:int}/status")]
    public async Task<ActionResult<TaskDto>> UpdateStatus(int id, [FromBody] UpdateTaskStatusRequest request)
    {
        var task = await _taskService.UpdateStatusAsync(User.GetUserId(), id, request.Status);
        return task is null ? NotFoundProblem(id) : Ok(task);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var deleted = await _taskService.DeleteTaskAsync(User.GetUserId(), id);
        return deleted ? NoContent() : NotFoundProblem(id);
    }

    private ObjectResult NotFoundProblem(int id) => Problem(
        title: "Task not found",
        detail: $"No task with id {id} was found for the current user.",
        statusCode: StatusCodes.Status404NotFound);
}
