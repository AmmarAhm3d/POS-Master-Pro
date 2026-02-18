# POS Master Pro - API

The backend service for the POS Master Pro system. Built with **ASP.NET Core 8**, following a clean architecture with **Repository Pattern** and **Stored Procedures** for high performance.

## 🛠️ Tech Stack

- **Framework:** .NET 8 Web API
- **Language:** C#
- **Database:** SQL Server
- **ORM:** Dapper / ADO.NET (via `System.Data.SqlClient`)
- **Documentation:** Swagger / OpenAPI

## 📂 Project Structure

- **Controllers:** Handle HTTP requests (thin layer).
- **Services:** Business logic implementation.
- **Repositories:** Data access layer interacting with SQL Stored Procedures.
- **Models:** DTOs and Entity definitions.

## 🚀 Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- SQL Server (LocalDB or Express)

### Setup

1. **Configure NuGet packages**
   - Dont forget to install `Microsoft.Data.SqlClient`
   - `dotnet add package Microsoft.Data.SqlClient`
2. **Configure Database:**
   - Update the connection string in `appsettings.json` (or `appsettings.Development.json`) to point to your local SQL Server instance.

   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=.;Database=POS_DB;Trusted_Connection=True;TrustServerCertificate=True;"
   }
   ```

   - Ensure you have run the `db-scripts/script.sql` to create the database schema.

3. **Run the API:**

   ```bash
   dotnet restore
   dotnet run
   ```

4. **Explore Endpoints:**
   - The API will launch at `https://localhost:7022` (default).
   - Navigate to `https://localhost:7022/swagger` to view the interactive API documentation.
