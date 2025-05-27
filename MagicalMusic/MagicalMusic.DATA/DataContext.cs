using MagicalMusic.CORE.Models;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

namespace MagicalMusic.DATA
{
    public class DataContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Song> Songs { get; set; }
        public DbSet<Creator> Creators { get; set; }
        public DbSet<Message> Messages { get; set; }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySql("Server=localhost;Database=magical_music_db;User ID=root;Password=1234;SslMode=Preferred;",
    new MySqlServerVersion(new Version(8, 0, 0)));

            //optionsBuilder.UseMySql(
            // @"Server=byfqraq5we9q1t4vuijf-mysql.services.clever-cloud.com;
            // Port=3306;
            // Database=byfqraq5we9q1t4vuijf;
            // User=u0yt3sn0jarrzzxj;
            // Password=9QgkOocVtR6AnJGM0XnF",
            //    new MySqlServerVersion(new Version(8, 0, 0))
            //);
        }


        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    optionsBuilder.UseMySql(
        //          @"Server=blxoaotokosgc0ojhkal-mysql.services.clever-cloud.com;
        //          Port=3306;
        //          Database=blxoaotokosgc0ojhkal;
        //          User=ukajdzz1f5hacymb;
        //          Password=AtWU4RjFrSOTxRBdsU2R;",
        //        new MySqlServerVersion(new Version(8, 0, 0)),
        //        mysqlOptions => mysqlOptions.EnableRetryOnFailure()
        //    );
        //}
    }
}
