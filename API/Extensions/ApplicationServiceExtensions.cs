using Application.Activities;
using Application.Core;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {   
        /// <summary>
        /// <param name="config"></param> this will give access to AppSettings.json or whatever config we set for project
        /// <returns></returns>
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            services.AddDbContext<DataContext>(options => 
            {   
                // Connect to a database (Sqlite)
                options.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });
            // Add CORS Service for CORS policy
            services.AddCors(opt => {
                opt.AddPolicy("CorsPolicy", policy => 
                {   
                    // ByPass CORS policy for your client-app (wherever its hosted)
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
                });
            });
            // Register MediatR service & handler for query
            services.AddMediatR(config => 
                config.RegisterServicesFromAssembly(typeof(List.Handler).Assembly));
            //services.AddMediatR(typeof(List.Handler));

            // Register AutoMapper as a Service (So that they can be used while needed in Application proj)
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);

            return services;
        }
    }
}