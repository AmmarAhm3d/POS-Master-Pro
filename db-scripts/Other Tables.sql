CREATE TABLE Products (
    Id INTEGER PRIMARY KEY IDENTITY(1,1),
    Name TEXT NOT NULL,
    Code TEXT,
    CostPrice DECIMAL(18, 2),
    RetailPrice DECIMAL(18, 2),
    CreatedDate DATETIME,
    UpdatedDate DATETIME
);



CREATE TABLE Sales (
    Id INTEGER PRIMARY KEY IDENTITY(1,1),
    TransactionDate DATETIME NOT NULL,
    PersonId INTEGER NOT NULL, -- Links to your existing Person table
    TotalAmount DECIMAL(18, 2),
    Comments TEXT,
    FOREIGN KEY (PersonId) REFERENCES People(Id)
);

CREATE TABLE SaleDetails (
    Id INTEGER PRIMARY KEY IDENTITY(1,1),
    SaleId INTEGER NOT NULL,
    ProductId INTEGER NOT NULL,
    Quantity INTEGER NOT NULL,
    UnitPrice DECIMAL(18, 2), -- Store price here in case product price changes later
    Discount DECIMAL(18, 2),
    LineTotal DECIMAL(18, 2),
    FOREIGN KEY (SaleId) REFERENCES Sales(Id),
    FOREIGN KEY (ProductId) REFERENCES Products(Id)
);