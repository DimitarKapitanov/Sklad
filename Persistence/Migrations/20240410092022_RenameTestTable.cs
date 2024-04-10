using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RenameTestTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_TestTables",
                table: "TestTables");

            migrationBuilder.RenameTable(
                name: "TestTables",
                newName: "DataSeeds");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DataSeeds",
                table: "DataSeeds",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_DataSeeds",
                table: "DataSeeds");

            migrationBuilder.RenameTable(
                name: "DataSeeds",
                newName: "TestTables");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TestTables",
                table: "TestTables",
                column: "Id");
        }
    }
}
