using API.Repositories.Implementations;
using API.Repositories.Interfaces;
using API.Services.Implementations;
using API.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// =============================================================
// 1. ADD CORS POLICY (ALLOW REACT FRONTEND)
// =============================================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000") // The default port for React
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// =============================================================
// 2. ADD SWAGGER SERVICES
// =============================================================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// =============================================================
// 3. REGISTER YOUR CUSTOM SERVICES
// =============================================================
builder.Services.AddScoped<IPeopleRepository, PeopleRepository>();
builder.Services.AddScoped<IPeopleService, PeopleService>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ISaleRepository, SaleRepository>();
builder.Services.AddScoped<ISaleService, SaleService>();

API.Helpers.ConnectionHelper.Initialize(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// =============================================================
// 4. ENABLE CORS MIDDLEWARE (MUST BE BEFORE AUTHORIZATION)
// =============================================================
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();