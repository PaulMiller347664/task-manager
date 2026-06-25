using System.ComponentModel.DataAnnotations;
using TaskStatus = TaskManager.Api.Models.TaskStatus;

namespace TaskManager.Api.DTOs;

public class UpdateTaskStatusRequest
{
    [Required]
    [EnumDataType(typeof(TaskStatus), ErrorMessage = "Status must be Incomplete or Complete.")]
    public TaskStatus Status { get; set; }
}
