# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY TaskManager.sln ./
COPY TaskManager.Api/TaskManager.Api.csproj TaskManager.Api/
COPY TaskManager.Tests/TaskManager.Tests.csproj TaskManager.Tests/
RUN dotnet restore TaskManager.Api/TaskManager.Api.csproj

COPY . .
RUN dotnet publish TaskManager.Api/TaskManager.Api.csproj -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish ./

# Persisted SQLite database lives here (mounted as a volume in compose).
RUN mkdir -p /app/data

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "TaskManager.Api.dll"]
