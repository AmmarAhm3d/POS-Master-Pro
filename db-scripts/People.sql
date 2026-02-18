-- =============================================
-- Phase 1: Database Setup & Stored Procedures
-- Entity: People
-- Architecture: Database-First (ADO.NET focus)
-- =============================================

-- 1. Create the People Table
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

-- 2. SP: Create Person
CREATE PROCEDURE spPeople_Create
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

-- 3. SP: Get All People
CREATE PROCEDURE spPeople_GetAll
AS
BEGIN
SET NOCOUNT ON;
SELECT Id, FirstName, LastName, Email, PhoneNumber, CreatedAt, UpdatedAt
FROM People
ORDER BY CreatedAt DESC;
END
GO

-- 4. SP: Get Person By ID
CREATE PROCEDURE spPeople_GetById
@Id INT
AS
BEGIN
SET NOCOUNT ON;
SELECT Id, FirstName, LastName, Email, PhoneNumber, CreatedAt, UpdatedAt
FROM People
WHERE Id = @Id;
END
GO

-- 5. SP: Update Person
CREATE PROCEDURE spPeople_Update
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

-- 6. SP: Delete Person
CREATE PROCEDURE spPeople_Delete
@Id INT
AS
BEGIN
SET NOCOUNT ON;
DELETE FROM People
WHERE Id = @Id;

SELECT @@ROWCOUNT AS RowsAffected;


END
GO