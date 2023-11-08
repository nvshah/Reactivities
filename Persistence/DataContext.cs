using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }
        // Represent Table Name (Activities)
        public DbSet<Activity> Activities { get; set; }
    }
}