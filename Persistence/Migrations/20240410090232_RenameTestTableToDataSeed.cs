using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RenameTestTableToDataSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Age",
                table: "TestTables");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "TestTables");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "TestTables");

            migrationBuilder.AddColumn<bool>(
                name: "IsSeeded",
                table: "TestTables",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsSeeded",
                table: "TestTables");

            migrationBuilder.AddColumn<int>(
                name: "Age",
                table: "TestTables",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "TestTables",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "TestTables",
                type: "text",
                nullable: true);
        }
    }
}
