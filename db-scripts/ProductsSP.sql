USE People
GO

-- 1. Create Product
CREATE PROCEDURE spProducts_Create
    @Name NVARCHAR(MAX),
    @Code NVARCHAR(50),
    @CostPrice DECIMAL(18, 2),
    @RetailPrice DECIMAL(18, 2)
AS
BEGIN
    INSERT INTO Products (Name, Code, CostPrice, RetailPrice, CreatedDate)
    VALUES (@Name, @Code, @CostPrice, @RetailPrice, GETDATE());
    
    -- Return the new ID so the UI knows it
    SELECT SCOPE_IDENTITY(); 
END
GO

-- 2. Get All Products
CREATE PROCEDURE spProducts_GetAll
AS
BEGIN
    SELECT * FROM Products ORDER BY Id DESC;
END
GO

-- 3. Get Product By ID
CREATE PROCEDURE spProducts_GetById
    @Id INT
AS
BEGIN
    SELECT * FROM Products WHERE Id = @Id;
END
GO

-- 4. Update Product
CREATE PROCEDURE spProducts_Update
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

-- 5. Delete Product
CREATE PROCEDURE spProducts_Delete
    @Id INT
AS
BEGIN
    DELETE FROM Products WHERE Id = @Id;
END
GO