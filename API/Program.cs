using API.Extensions;
using API.Middleware;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers(opt =>
{
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
});
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();

app.UseXContentTypeOptions();
app.UseReferrerPolicy(opt => opt.NoReferrer());
app.UseXXssProtection(opt => opt.EnabledWithBlockMode());
app.UseXfo(opt => opt.Deny());
app.UseCsp(opt => opt
    .BlockAllMixedContent()
    .StyleSources(s => s.Self().CustomSources("https://fonts.googleapis.com", "sha256-KhmMaPpQqsccf43BLHwDHtDMqYihq39cTA4Ag6B4Ia4=", "sha256-KhmMaPpQqsccf43BLHwDHtDMqYihq39cTA4Ag6B4Ia4=", "sha256-KhmMaPpQqsccf43BLHwDHtDMqYihq39cTA4Ag6B4Ia4=", "sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=",
    "sha256-KhmMaPpQqsccf43BLHwDHtDMqYihq39cTA4Ag6B4Ia4=", "sha256-KhmMaPpQqsccf43BLHwDHtDMqYihq39cTA4Ag6B4Ia4=", "sha256-KhmMaPpQqsccf43BLHwDHtDMqYihq39cTA4Ag6B4Ia4=",
    "sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=", "sha256-wkAU1AW/h8YFx0XlzvpTllAKnFEO2tw8aKErs5a26LY="))
    .FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com", "data:", "https://fonts.googleapis.com"))
    .FormActions(s => s.Self())
    .FrameAncestors(s => s.Self())
    .ImageSources(s => s.Self().CustomSources("blob:", "data:", "https://res.cloudinary.com"))
    .ScriptSources(s => s.Self().CustomSources("sha256-Tui7QoFlnLXkJCSl1/JvEZdIXTmBttnWNxzJpXomQjg=", "sha256-AaD233S3nLNrz8GvI5Ct4JgDe2xTKcgZbhIdfyO3wrA="))
);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.Use(async (context, next) =>
    {
        context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000");
        await next.Invoke();
    });
}

app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();
app.MapFallbackToController("Index", "Fallback");

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

    await context.Database.MigrateAsync();

    await Seed.SeedData(context, userManager, roleManager);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration");
}

app.Run();
