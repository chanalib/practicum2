using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MagicalMusic.DATA.Migrations
{
    /// <inheritdoc />
    public partial class ChangeSongLengthToInt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "SongLength",
                table: "Songs",
                type: "int",
                nullable: false,
                oldClrType: typeof(TimeSpan),
                oldType: "time(6)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<TimeSpan>(
                name: "SongLength",
                table: "Songs",
                type: "time(6)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}
