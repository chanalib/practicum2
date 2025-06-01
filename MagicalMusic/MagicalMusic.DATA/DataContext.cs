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
    //protected override void OnModelCreating(ModelBuilder modelBuilder)
    //{
    //    // המרה של רשימת מחרוזות למחרוזת אחת מופרדת בפסיקים
    //    var stringListConverter = new ValueConverter<List<string>, string>(
    //        v => string.Join(",", v),
    //        v => v.Split(",", StringSplitOptions.RemoveEmptyEntries).ToList()
    //    );

    //    modelBuilder.Entity<UserProfile>()
    //        .Property(u => u.FavoriteGenres)
    //        .HasConversion(stringListConverter);
    //}
}



        //    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //    {
        //        optionsBuilder.UseMySql("Server=localhost;Database=magical_music_db;User ID=root;Password=1234;SslMode=Preferred;",
        //new MySqlServerVersion(new Version(8, 0, 0)));

        //        //optionsBuilder.UseMySql(
        //        // @"Server=byfqraq5we9q1t4vuijf-mysql.services.clever-cloud.com;
        //        // Port=3306;
        //        // Database=byfqraq5we9q1t4vuijf;
        //        // User=u0yt3sn0jarrzzxj;
        //        // Password=9QgkOocVtR6AnJGM0XnF",
        //        //    new MySqlServerVersion(new Version(8, 0, 0))
        //        //);
        //    }
