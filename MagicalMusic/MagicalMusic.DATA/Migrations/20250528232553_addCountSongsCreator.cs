using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MagicalMusic.DATA.Migrations
{
    /// <inheritdoc />
    public partial class addCountSongsCreator : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SongCount",
                table: "Creators",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SongCount",
                table: "Creators");
        }
    }
}
