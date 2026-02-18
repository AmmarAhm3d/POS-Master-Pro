-- Create Sale Detail (Add Item to Sale)
CREATE PROCEDURE spSaleDetails_Create
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