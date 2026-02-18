-- 1. Get Sale Header by ID
CREATE PROCEDURE spSales_GetById
    @Id INT
AS
BEGIN
    SELECT * FROM Sales WHERE Id = @Id;
END
GO

-- 2. Get Sale Details by Sale ID
CREATE PROCEDURE spSaleDetails_GetBySaleId
    @SaleId INT
AS
BEGIN
    SELECT sd.*, p.Name as ProductName 
    FROM SaleDetails sd
    INNER JOIN Products p ON sd.ProductId = p.Id
    WHERE sd.SaleId = @SaleId;
END
GO

-- 3. Update Sale Header
CREATE PROCEDURE spSales_Update
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

-- 4. Clear Items (Used before re-inserting new items)
CREATE PROCEDURE spSaleDetails_DeleteBySaleId
    @SaleId INT
AS
BEGIN
    DELETE FROM SaleDetails WHERE SaleId = @SaleId;
END
GO