var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://myshop.com")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

var app = builder.Build();

app.Use(async (context, next) =>
{
    if (context.Request.Method == "OPTIONS")
    {
        context.Response.StatusCode = 200;

        return;
    }

    await next();
});

app.UseCors("AllowFrontend");

app.MapReverseProxy();

app.Run();
