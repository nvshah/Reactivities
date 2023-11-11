using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container. (ie DI)

// All these services under builder are scoped to it (ie Used for incoming HTTP requests)
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<DataContext>(options => 
{   
    // Connect to a database (Sqlite)
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
// Add CORS Service for CORS policy
builder.Services.AddCors(opt => {
    opt.AddPolicy("CorsPolicy", policy => 
    {   
        // ByPass CORS policy for your client-app (wherever its hosted)
        policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Middleware for CORS-policy [NOTE: it should be placed before UseAuthorization() ie order matters]
app.UseCors("CorsPolicy");

//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

/*
GOAL -> Make Ready DB before App Runs (ie app.Run()) ---
Code simulating `dotnet ef database update` to create database if not
-
-> For this we need Service (DataContext), 
-> as we dont have DI accessible in Program.cs, we will create scope for services under app instance (ie context)

NOTE: Service of builder is diff instance than Service for an app as both have diff scope
*/

// Create Scope so as to access required Service (& destroy it after done)
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    // Try creating DB (corresp to migration)
    var context = services.GetRequiredService<DataContext>();
    // Effectively below is doing same as command `dotnet ef database update`
    await context.Database.MigrateAsync();
    // Add Seed Data
    await Seed.SeedData(context);
}
catch (Exception ex)
{   
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occured during migrations");
}

app.Run();
