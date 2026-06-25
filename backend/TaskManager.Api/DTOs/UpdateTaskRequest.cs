using System.ComponentModel.DataAnnotations;

namespace TaskManager.Api.DTOs;

public class UpdateTaskRequest : IValidatableObject
{
    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(200, ErrorMessage = "Title must be at most 200 characters.")]
    public string Title { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string? Description { get; set; }

    public DateTimeOffset? DueDate { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (string.IsNullOrWhiteSpace(Title))
        {
            yield return new ValidationResult(
                "Title is required.",
                new[] { nameof(Title) });
        }

        if (DueDate.HasValue && DueDate.Value.ToUniversalTime() < DateTimeOffset.UtcNow)
        {
            yield return new ValidationResult(
                "Due date cannot be in the past.",
                new[] { nameof(DueDate) });
        }
    }
}
