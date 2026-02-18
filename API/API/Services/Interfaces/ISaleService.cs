using API.Models;

namespace API.Services.Interfaces
{
    public interface ISaleService
    {
        Task<CreateSaleResponse> CreateSaleAsync(CreateSaleRequest request);
        Task<GetAllSalesResponse> GetAllSalesAsync();
        Task<PagedResponse<SaleSummaryDTO>> GetPagedAsync(PagedRequest request);
        Task<SaleDTO> GetSaleByIdAsync(int id);
        Task<CreateSaleResponse> UpdateSaleAsync(UpdateSaleRequest request);
        Task<DeleteSaleResponse> DeleteSaleAsync(DeleteSaleRequest request);
    }
}