namespace TaskManager.Api.Services;

public class DatabaseSettings
{
    public string Provider { get; set; } = "Sqlite";
    public string Path { get; set; } = "data";
    public string Name { get; set; } = "app.db";
    public string? User { get; set; }
    public string? Password { get; set; }

    public string BuildConnectionString()
    {
        if (Provider.Equals("Sqlite", StringComparison.OrdinalIgnoreCase))
        {
            var filePath = string.IsNullOrWhiteSpace(Path)
                ? Name
                : $"{Path.TrimEnd('/', '\\')}{PathSeparator}{Name}";

            return $"Data Source={filePath}";
        }

        throw new InvalidOperationException(
            $"Unsupported database provider '{Provider}'. Only Sqlite is configured.");
    }

    private static char PathSeparator =>
        OperatingSystem.IsWindows() ? '\\' : '/';
}
