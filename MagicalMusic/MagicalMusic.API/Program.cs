using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using MagicalMusic.CORE.Services;
using MagicalMusic.CORE.Repositories;
using MagicalMusic.DATA.Repositories;
using MagicalMusic.SERVICE;
using MagicalMusic.DATA;
using System.Text.Json.Serialization;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Identity;
using Amazon.S3;
using Amazon.Runtime; // הוספת ספריה זו
using System.Configuration;
using DotNetEnv; // הוספת ספריה זו
using System.Collections;
using Microsoft.EntityFrameworkCore;

Env.Load(); // טוען את משתני הסביבה מהקובץ .env
var builder = WebApplication.CreateBuilder(args);

// קבל את המפתחות

var awsAccessKeyId = builder.Configuration["AWS:AccessKey"];
var awsSecretAccessKey = builder.Configuration["AWS:SecretKey"];
var awsBucketName = builder.Configuration["AWS:BucketName"];
var awsRegion = builder.Configuration["AWS:Region"];
var jwtKey = builder.Configuration["JWT_KEY"];


Console.WriteLine($"AWS_ACCESS_KEY_ID: {awsAccessKeyId}");
Console.WriteLine($"AWS_SECRET_ACCESS_KEY: {awsSecretAccessKey}");
Console.WriteLine($"AWS_BucketName: {awsBucketName}");
Console.WriteLine($"awsRegion: {awsRegion}");
Console.WriteLine($"JWT_KEY: {jwtKey}");


// בדוק אם מפתחות AWS קיימים
if (string.IsNullOrEmpty(awsAccessKeyId) || string.IsNullOrEmpty(awsSecretAccessKey))
{
    throw new ArgumentNullException("AWS Credentials", "AWS Access Key and Secret Key must be provided in User Secrets");
}

// בדוק אם המפתחות קיימים
if (string.IsNullOrEmpty(jwtKey))
{
    throw new ArgumentNullException("Jwt:Key", "JWT Key must be provided in User Secrets");
}



builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// בדוק אם המפתחות קיימים
if (string.IsNullOrEmpty(jwtKey))
{
    throw new ArgumentNullException("Jwt:Key", "JWT Key must be provided in .env file");
}





// הוספת שירותים
builder.Services.AddIdentity<IdentityUser, IdentityRole>()
        .AddEntityFrameworkStores<DataContext>()
        .AddDefaultTokenProviders();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Description = "Enter your Bearer token",
        Type = SecuritySchemeType.Http
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

builder.Services.AddDbContext<DataContext>();
builder.Services.AddScoped<ICreatorService, CreatorService>();
builder.Services.AddScoped<ICreatorRepository, creatorRepository>();
builder.Services.AddScoped<ISongService, SongService>();
builder.Services.AddScoped<ISongRepository, SongRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<S3Service>(); // כאשר IS3Service הוא הממשק
// רישום שירותי AWS



builder.Services.AddSingleton<IAmazonS3>(sp =>
{
    var awsAccessKeyId = builder.Configuration["AWS:AccessKey"];
    var awsSecretAccessKey = builder.Configuration["AWS:SecretKey"];
    var awsRegion = builder.Configuration["AWS:Region"];

    var config = new AmazonS3Config
    {
        RegionEndpoint = Amazon.RegionEndpoint.GetBySystemName(awsRegion),
        Timeout = TimeSpan.FromMinutes(10),           // Timeout כללי (לדוגמה 10 דקות)
    };

    return new AmazonS3Client(awsAccessKeyId, awsSecretAccessKey, config);
});





builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT_KEY"])),
        RoleClaimType = ClaimTypes.Role
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("EditorOrAdmin", policy => policy.RequireRole("Editor", "Admin"));
    options.AddPolicy("ViewerOnly", policy => policy.RequireRole("Viewer"));
});

builder.Services.AddAutoMapper(typeof(MappingProfile));

// בניית האפליקציה
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");

app.Use(async (context, next) =>
{
    await next();

    if (context.Response.StatusCode == StatusCodes.Status403Forbidden)
    {
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync("{\"error\": \"You do not have permission to perform this action!\"}");
    }
    else if (context.Response.StatusCode == StatusCodes.Status401Unauthorized)
    {
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync("{\"error\": \"You must be logged in to access this resource!\"}");
    }
});

app.UseHsts();

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
