-- =============================================
-- POS Master Pro - Database Setup Script
-- Tables: People, Products, Sales, SaleDetails
-- Stored Procedures: CRUD + Pagination
-- =============================================

-- =============================================
-- 1. TABLES
-- =============================================

-- 1.1 People Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'People')
BEGIN
    CREATE TABLE People (
        Id INT PRIMARY KEY IDENTITY(1,1),
        FirstName NVARCHAR(50) NOT NULL,
        LastName NVARCHAR(50) NOT NULL,
        Email NVARCHAR(100) UNIQUE NOT NULL,
        PhoneNumber NVARCHAR(20) NULL,
        CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
        UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
    );
END
GO

-- 1.2 Products Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Products')
BEGIN
    CREATE TABLE Products (
        Id INTEGER PRIMARY KEY IDENTITY(1,1),
        Name NVARCHAR(MAX) NOT NULL,
        Code NVARCHAR(50),
        CostPrice DECIMAL(18, 2),
        RetailPrice DECIMAL(18, 2),
        CreatedDate DATETIME,
        UpdatedDate DATETIME
    );
END
GO

-- 1.3 Sales Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Sales')
BEGIN
    CREATE TABLE Sales (
        Id INTEGER PRIMARY KEY IDENTITY(1,1),
        TransactionDate DATETIME NOT NULL,
        PersonId INTEGER NOT NULL, -- Links to People table
        TotalAmount DECIMAL(18, 2),
        Comments NVARCHAR(MAX),
        FOREIGN KEY (PersonId) REFERENCES People(Id)
    );
END
GO

-- 1.4 SaleDetails Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'SaleDetails')
BEGIN
    CREATE TABLE SaleDetails (
        Id INTEGER PRIMARY KEY IDENTITY(1,1),
        SaleId INTEGER NOT NULL,
        ProductId INTEGER NOT NULL,
        Quantity INTEGER NOT NULL,
        UnitPrice DECIMAL(18, 2),
        Discount DECIMAL(18, 2),
        LineTotal DECIMAL(18, 2),
        FOREIGN KEY (SaleId) REFERENCES Sales(Id),
        FOREIGN KEY (ProductId) REFERENCES Products(Id)
    );
END
GO

-- =============================================
-- 2. STORED PROCEDURES - PEOPLE
-- =============================================

CREATE OR ALTER PROCEDURE spPeople_Create
    @FirstName NVARCHAR(50),
    @LastName NVARCHAR(50),
    @Email NVARCHAR(100),
    @PhoneNumber NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO People (FirstName, LastName, Email, PhoneNumber)
    VALUES (@FirstName, @LastName, @Email, @PhoneNumber);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO

CREATE OR ALTER PROCEDURE spPeople_GetAll
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, FirstName, LastName, Email, PhoneNumber, CreatedAt, UpdatedAt
    FROM People
    ORDER BY CreatedAt DESC;
END
GO

CREATE OR ALTER PROCEDURE spPeople_GetById
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, FirstName, LastName, Email, PhoneNumber, CreatedAt, UpdatedAt
    FROM People
    WHERE Id = @Id;
END
GO

CREATE OR ALTER PROCEDURE spPeople_Update
    @Id INT,
    @FirstName NVARCHAR(50),
    @LastName NVARCHAR(50),
    @Email NVARCHAR(100),
    @PhoneNumber NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE People
    SET FirstName = @FirstName,
        LastName = @LastName,
        Email = @Email,
        PhoneNumber = @PhoneNumber,
        UpdatedAt = GETUTCDATE()
    WHERE Id = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO

CREATE OR ALTER PROCEDURE spPeople_Delete
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM People WHERE Id = @Id;
END
GO

CREATE OR ALTER PROCEDURE spPeople_GetPaged
    @PageNumber INT = 1,
    @PageSize INT = 10
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @TotalCount INT;
    SELECT @TotalCount = COUNT(*) FROM People;

    SELECT 
        *,
        @TotalCount as TotalCount
    FROM People
    ORDER BY Id DESC
    OFFSET (@PageNumber - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO

-- =============================================
-- 3. STORED PROCEDURES - PRODUCTS
-- =============================================

CREATE OR ALTER PROCEDURE spProducts_Create
    @Name NVARCHAR(MAX),
    @Code NVARCHAR(50),
    @CostPrice DECIMAL(18, 2),
    @RetailPrice DECIMAL(18, 2)
AS
BEGIN
    INSERT INTO Products (Name, Code, CostPrice, RetailPrice, CreatedDate)
    VALUES (@Name, @Code, @CostPrice, @RetailPrice, GETDATE());
    SELECT SCOPE_IDENTITY(); 
END
GO

CREATE OR ALTER PROCEDURE spProducts_GetAll
AS
BEGIN
    SELECT * FROM Products ORDER BY Id DESC;
END
GO

CREATE OR ALTER PROCEDURE spProducts_GetById
    @Id INT
AS
BEGIN
    SELECT * FROM Products WHERE Id = @Id;
END
GO

CREATE OR ALTER PROCEDURE spProducts_Update
    @Id INT,
    @Name NVARCHAR(MAX),
    @Code NVARCHAR(50),
    @CostPrice DECIMAL(18, 2),
    @RetailPrice DECIMAL(18, 2)
AS
BEGIN
    UPDATE Products
    SET Name = @Name,
        Code = @Code,
        CostPrice = @CostPrice,
        RetailPrice = @RetailPrice,
        UpdatedDate = GETDATE()
    WHERE Id = @Id;
END
GO

CREATE OR ALTER PROCEDURE spProducts_Delete
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM Products WHERE Id = @Id;
END
GO

CREATE OR ALTER PROCEDURE spProducts_GetPaged
    @PageNumber INT = 1,
    @PageSize INT = 10
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @TotalCount INT;
    SELECT @TotalCount = COUNT(*) FROM Products;

    SELECT 
        *,
        @TotalCount as TotalCount
    FROM Products
    ORDER BY Id DESC
    OFFSET (@PageNumber - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO

-- =============================================
-- 4. STORED PROCEDURES - SALES
-- =============================================

-- 4.1 Create Header
CREATE OR ALTER PROCEDURE spSales_Create
    @TransactionDate DATETIME,
    @PersonId INT,
    @TotalAmount DECIMAL(18, 2),
    @Comments NVARCHAR(MAX) = NULL
AS
BEGIN
    INSERT INTO Sales (TransactionDate, PersonId, TotalAmount, Comments)
    VALUES (@TransactionDate, @PersonId, @TotalAmount, @Comments);
    SELECT SCOPE_IDENTITY();
END
GO

-- 4.2 Create Detail
CREATE OR ALTER PROCEDURE spSaleDetails_Create
    @SaleId INT,
    @ProductId INT,
    @Quantity INT,
    @UnitPrice DECIMAL(18, 2),
    @Discount DECIMAL(18, 2),
    @LineTotal DECIMAL(18, 2)
AS
BEGIN
    INSERT INTO SaleDetails (SaleId, ProductId, Quantity, UnitPrice, Discount, LineTotal)
    VALUES (@SaleId, @ProductId, @Quantity, @UnitPrice, @Discount, @LineTotal);
END
GO

-- 4.3 Get Sale By Id
CREATE OR ALTER PROCEDURE spSales_GetById
    @Id INT
AS
BEGIN
    SELECT * FROM Sales WHERE Id = @Id;
END
GO

-- 4.4 Get Details By Sale Id
CREATE OR ALTER PROCEDURE spSaleDetails_GetBySaleId
    @SaleId INT
AS
BEGIN
    SELECT sd.*, p.Name as ProductName 
    FROM SaleDetails sd
    INNER JOIN Products p ON sd.ProductId = p.Id
    WHERE sd.SaleId = @SaleId;
END
GO

-- 4.5 Update Sale
CREATE OR ALTER PROCEDURE spSales_Update
    @Id INT,
    @TransactionDate DATETIME,
    @PersonId INT,
    @TotalAmount DECIMAL(18, 2),
    @Comments NVARCHAR(MAX)
AS
BEGIN
    UPDATE Sales
    SET TransactionDate = @TransactionDate,
        PersonId = @PersonId,
        TotalAmount = @TotalAmount,
        Comments = @Comments
    WHERE Id = @Id;
END
GO

-- 4.6 Clear Details (for updates)
CREATE OR ALTER PROCEDURE spSaleDetails_DeleteBySaleId
    @SaleId INT
AS
BEGIN
    DELETE FROM SaleDetails WHERE SaleId = @SaleId;
END
GO

-- 4.7 Get All Sales (Simple)
CREATE OR ALTER PROCEDURE spSales_GetAll
AS
BEGIN
    SELECT 
        s.Id, 
        s.TransactionDate, 
        s.TotalAmount, 
        s.Comments,
        p.FirstName + ' ' + p.LastName as SalesPersonName
    FROM Sales s
    INNER JOIN People p ON s.PersonId = p.Id
    ORDER BY s.TransactionDate DESC;
END
GO

-- 4.8 Get Paged Sales (Advanced Search)
CREATE OR ALTER PROCEDURE spSales_GetPaged
    @PageNumber INT,
    @PageSize INT,
    @SearchTerm NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;

    -- Count Total
    DECLARE @TotalCount INT;
    SELECT @TotalCount = COUNT(*)
    FROM Sales s
    LEFT JOIN People p ON s.PersonId = p.Id
    WHERE 
        (@SearchTerm IS NULL OR @SearchTerm = '' OR 
         p.FirstName LIKE '%' + @SearchTerm + '%' OR 
         p.LastName LIKE '%' + @SearchTerm + '%' OR 
         s.Comments LIKE '%' + @SearchTerm + '%' OR
         CAST(s.TotalAmount AS NVARCHAR(50)) LIKE '%' + @SearchTerm + '%');

    -- Get Data
    SELECT 
        s.Id,
        s.TransactionDate,
        s.TotalAmount,
        s.Comments,
        (p.FirstName + ' ' + p.LastName) AS SalesPersonName,
        @TotalCount AS TotalCount
    FROM Sales s
    LEFT JOIN People p ON s.PersonId = p.Id
    WHERE 
        (@SearchTerm IS NULL OR @SearchTerm = '' OR 
         p.FirstName LIKE '%' + @SearchTerm + '%' OR 
         p.LastName LIKE '%' + @SearchTerm + '%' OR 
         s.Comments LIKE '%' + @SearchTerm + '%' OR
         CAST(s.TotalAmount AS NVARCHAR(50)) LIKE '%' + @SearchTerm + '%')
    ORDER BY s.TransactionDate DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO

-- 4.9 Delete Sale (Cascade)
CREATE OR ALTER PROCEDURE spSales_Delete
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    -- Delete Details first
    DELETE FROM SaleDetails WHERE SaleId = @Id; 
    -- Delete Header
    DELETE FROM Sales WHERE Id = @Id;
END
GO
