using API.Models;
namespace API.Repositories.Interfaces
{
    public interface ISaleRepository
    {
        Task<int> CreateSaleHeaderAsync(CreateSaleRequest request);
        Task CreateSaleDetailAsync(int saleId, SaleDetailRequest detail);

        Task<IEnumerable<SaleSummaryDTO>> GetAllSalesAsync();
        Task<PagedResponse<SaleSummaryDTO>> GetPagedAsync(int pageNumber, int pageSize, string? searchTerm);

        Task<SaleDTO> GetSaleByIdAsync(int id);
        Task UpdateSaleHeaderAsync(UpdateSaleRequest request);
        Task DeleteSaleDetailsAsync(int saleId);
        Task DeleteSaleAsync(int id);
    }
}