-- Create Sale Header
CREATE PROCEDURE spSales_Create
    @TransactionDate DATETIME,
    @PersonId INT,
    @TotalAmount DECIMAL(18, 2),
    @Comments NVARCHAR(MAX) = NULL
AS
BEGIN
    INSERT INTO Sales (TransactionDate, PersonId, TotalAmount, Comments)
    VALUES (@TransactionDate, @PersonId, @TotalAmount, @Comments);

    -- IMPORTANT: Return the new Sale ID so we can save the items
    SELECT SCOPE_IDENTITY();
END
GO