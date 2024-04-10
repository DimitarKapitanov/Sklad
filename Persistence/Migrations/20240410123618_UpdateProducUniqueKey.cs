using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProducUniqueKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Products_Name_UnitId",
                table: "Products");

            migrationBuilder.CreateIndex(
                name: "IX_Products_Name_UnitId_CategoryId",
                table: "Products",
                columns: new[] { "Name", "UnitId", "CategoryId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Products_Name_UnitId_CategoryId",
                table: "Products");

            migrationBuilder.CreateIndex(
                name: "IX_Products_Name_UnitId",
                table: "Products",
                columns: new[] { "Name", "UnitId" },
                unique: true);
        }
    }
}
