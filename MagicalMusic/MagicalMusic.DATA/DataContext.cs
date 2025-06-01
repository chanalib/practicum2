using MagicalMusic.CORE.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.Extensions.Configuration;

public class DataContext : DbContext
{
    private readonly IConfiguration _configuration;
    public DbSet<User> Users { get; set; }
    public DbSet<Song> Songs { get; set; }
    public DbSet<Creator> Creators { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<UserProfile> UserProfiles { get; set; }



    public DataContext(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        var connectionString = _configuration.GetConnectionString("DefaultConnection");
        optionsBuilder.UseMySql(
            connectionString,
            new MySqlServerVersion(new Version(8, 0, 0)),
            mysqlOptions => mysqlOptions.EnableRetryOnFailure()
        );
        Console.WriteLine($"connectionString: {connectionString}");
    }
}