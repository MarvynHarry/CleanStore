using System.IdentityModel.Tokens.Jwt;
using System.Text;
using CleanStore.Application.Services;
using CleanStore.Application.UseCases;
using CleanStore.Infrastructure.Persistence;
using CleanStore.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddScoped<ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();

builder.Services.AddControllers();
#pragma warning disable CS8604 // Possible null reference argument.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySQL(
        builder.Configuration.GetConnectionString("Default")));
#pragma warning restore CS8604 // Possible null reference argument.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Dirección del frontend
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.SetMinimumLevel(LogLevel.Debug);

var app = builder.Build();
// Middleware para generar un token en cada solicitud
app.Use(async (context, next) =>
{
    // Configuración del token
#pragma warning disable CS8604 // Possible null reference argument.
    var key = Encoding.UTF8.GetBytes(builder.Configuration.GetValue<string>("JtW:SecretKey"));
#pragma warning restore CS8604 // Possible null reference argument.
    var signingCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Issuer = "CleanStore",
        Audience = "Def",
        Expires = DateTime.UtcNow.AddMinutes(30), 
        SigningCredentials = signingCredentials
    };

    var tokenHandler = new JwtSecurityTokenHandler();
    var token = tokenHandler.CreateToken(tokenDescriptor);
    var tokenString = tokenHandler.WriteToken(token);

    // Agregar el token al encabezado de la respuesta
    context.Response.Headers["X-New-Token"] = tokenString;

    await next.Invoke();
});

app.UseCors();

app.UseSwagger();
app.UseSwaggerUI();

//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
