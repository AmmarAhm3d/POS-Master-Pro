namespace API.Models
{
    // --- Person Responses ---
    public class PersonDTO
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
    }

    public class CreatePersonResponse
    {
        public int PersonId { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; }
    }

    public class UpdatePersonResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }

    public class DeletePersonResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }

    public class GetAllPeopleResponse
    {
        public List<PersonDTO> People { get; set; } = new List<PersonDTO>();
    }

    // --- Product Responses ---
    public class ProductDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public decimal CostPrice { get; set; }
        public decimal RetailPrice { get; set; }
        public string CreatedDate { get; set; }
    }

    public class CreateProductResponse
    {
        public int ProductId { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; }
    }

    public class UpdateProductResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }

    public class DeleteProductResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }

    public class GetAllProductsResponse
    {
        public List<ProductDTO> Products { get; set; } = new List<ProductDTO>();
    }

    // --- Sale Responses ---
    public class CreateSaleResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public int SaleId { get; set; }
    }

    public class SaleSummaryDTO
    {
        public int Id { get; set; }
        public DateTime TransactionDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string SalesPersonName { get; set; }
        public string Comments { get; set; }
    }

    public class GetAllSalesResponse
    {
        public List<SaleSummaryDTO> Sales { get; set; } = new List<SaleSummaryDTO>();
    }

    public class SaleLineItemDTO
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Discount { get; set; }
        public decimal LineTotal { get; set; }
    }

    public class SaleDTO
    {
        public int Id { get; set; }
        public DateTime TransactionDate { get; set; }
        public int PersonId { get; set; }
        public decimal TotalAmount { get; set; }
        public string Comments { get; set; }
        public List<SaleLineItemDTO> SaleDetails { get; set; }
    }

    public class DeleteSaleResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }

    // --- Shared Responses ---
    public class PagedResponse<T>
    {
        public IEnumerable<T> Data { get; set; }
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => TotalCount > 0 ? (int)System.Math.Ceiling(TotalCount / (double)PageSize) : 0;
    }
}
