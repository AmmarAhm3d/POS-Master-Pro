ALTER PROCEDURE spSales_GetPaged
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
