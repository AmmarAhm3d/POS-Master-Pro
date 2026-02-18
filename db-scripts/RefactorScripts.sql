USE People
GO

-- =============================================
-- 1. People Pagination
-- =============================================
CREATE PROCEDURE spPeople_GetPaged
    @PageNumber INT = 1,
    @PageSize INT = 10
AS
BEGIN
    SET NOCOUNT ON;

    -- Get Total Count
    DECLARE @TotalCount INT;
    SELECT @TotalCount = COUNT(*) FROM People;

    -- Return Data with TotalCount as a column (simplest for ADO.NET single-reader)
    SELECT 
        *,
        @TotalCount as TotalCount
    FROM People
    ORDER BY Id DESC
    OFFSET (@PageNumber - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO

ALTER PROCEDURE spPeople_Delete
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM People WHERE Id = @Id;
END
GO

-- =============================================
-- 2. Products Pagination
-- =============================================
CREATE PROCEDURE spProducts_GetPaged
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

ALTER PROCEDURE spProducts_Delete
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM Products WHERE Id = @Id;
END
GO

-- =============================================
-- 3. Sales Pagination
-- =============================================
CREATE PROCEDURE spSales_GetPaged
    @PageNumber INT = 1,
    @PageSize INT = 10
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @TotalCount INT;
    SELECT @TotalCount = COUNT(*) FROM Sales;

    SELECT 
        s.Id,
        s.TransactionDate,
        s.TotalAmount,
        s.Comments,
        s.PersonId,
        (p.FirstName + ' ' + p.LastName) as SalesPersonName,
        @TotalCount as TotalCount
    FROM Sales s
    INNER JOIN People p ON s.PersonId = p.Id
    ORDER BY s.TransactionDate DESC
    OFFSET (@PageNumber - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO

CREATE PROCEDURE spSales_Delete
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    -- Optional: Delete Details first if no CASCADE exists
    DELETE FROM SaleDetails WHERE SaleId = @Id; 
    DELETE FROM Sales WHERE Id = @Id;
END
GO