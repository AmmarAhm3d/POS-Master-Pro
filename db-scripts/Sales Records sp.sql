CREATE PROCEDURE spSales_GetAll
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