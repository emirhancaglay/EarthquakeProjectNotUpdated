    using Earthquakeapi.Models;
    using Earthquakeapi.Services;
    using Earthquakeapi.Settings;
    using EarthquakeApi.Services;
    using Microsoft.AspNetCore.Mvc;
    var builder = WebApplication.CreateBuilder(args);

    // Add services
    builder.Services.Configure<MongoDbSettings>(
        builder.Configuration.GetSection("MongoDbSettings"));

    builder.Services.AddSingleton<EarthquakeAlertService>();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
    builder.Services.AddControllers();
    builder.Services.AddHttpClient<EarthquakeService>();



    // CORS policy ekle
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowAngularDevClient", policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
    });

    var app = builder.Build();

    // CORS middleware
    app.UseCors("AllowAngularDevClient");

    // Swagger UI
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }
    app.MapPost("/api/earthquakes", async (EarthquakeAlert alert, EarthquakeAlertService service) =>
        {
            await service.CreateAsync(alert);
            return Results.Created($"/api/earthquakes/{alert.Id}", alert);
        })
        .RequireCors("AllowAngularDevClient");
    
    app.MapGet("/api/earthquakes", async (EarthquakeService service, EarthquakeAlertService alertService) =>
    {
        var data = await service.GetEarthquakesAsync();

        foreach (var quake in data)
        {
            if (quake.IsDangerous)
            {
                DateTime quakeDate = DateTime.Parse(quake.Date);

                bool exists = await alertService.ExistsAsync(quake.Title, quakeDate);
                if (!exists)
                {
                    var alert = new EarthquakeAlert
                    {
                        Title = quake.Title,
                        Magnitude = quake.Mag,
                        Date = quakeDate,
                        IsDangerous = quake.IsDangerous,
                        ClosestLocationName = quake.ClosestLocationName ?? ""
                    };
                    await alertService.CreateAsync(alert);
                }
            }
        }

        return Results.Ok(new { result = data });
    });


    app.MapGet("/api/earthquakes/mock", () =>
        {
            var fakeData = new[]
            {
                new {
                    earthquake_id = "mock1",
                    date = "2025.07.24 12:00:00",
                    title = "Sahte Deprem",
                    mag = 4.5,
                    depth = 10,
                    geojson = new {
                        type = "Point",
                        coordinates = new double[] { 38.1355, 37.0132 }
                    },
                    isDangerous = true,
                    closestLocationName = "Örnek Santral"
                },
            };
            return Results.Ok(new { result = fakeData });
        })
        .RequireCors("AllowAngularDevClient");


    app.Run();