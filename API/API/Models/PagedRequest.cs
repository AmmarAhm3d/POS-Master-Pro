namespace API.Models
{
    public class PagedRequest
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SearchTerm { get; set; }
    }

    public class GetAllPeopleRequest
    {
        // Future placeholders
    }
}
