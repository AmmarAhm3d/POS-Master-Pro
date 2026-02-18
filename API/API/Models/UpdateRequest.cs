namespace API.Models
{
    public class UpdatePersonRequest
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
    }

    public class UpdateProductRequest
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public decimal CostPrice { get; set; }
        public decimal RetailPrice { get; set; }
    }

    public class UpdateSaleRequest : CreateSaleRequest
    {
        public int Id { get; set; }
    }
}
