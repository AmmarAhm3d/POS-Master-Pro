namespace API.Models
{
    public class CreatePersonRequest
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
    }

    public class CreateProductRequest
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public decimal CostPrice { get; set; }
        public decimal RetailPrice { get; set; }
    }

    public class CreateSaleRequest
    {
        public DateTime TransactionDate { get; set; }
        public int PersonId { get; set; }
        public decimal TotalAmount { get; set; }
        public string Comments { get; set; }

        public List<SaleDetailRequest> SaleDetails { get; set; }
    }

    public class SaleDetailRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Discount { get; set; }
        public decimal LineTotal { get; set; }
    }
}
