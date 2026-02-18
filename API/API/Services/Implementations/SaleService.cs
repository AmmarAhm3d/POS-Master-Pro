using API.Models;
using API.Repositories.Interfaces;
using API.Services.Interfaces;

namespace API.Services.Implementations
{
    public class SaleService : ISaleService
    {
        private readonly ISaleRepository _saleRepository;

        public SaleService(ISaleRepository saleRepository)
        {
            _saleRepository = saleRepository;
        }

        public async Task<CreateSaleResponse> CreateSaleAsync(CreateSaleRequest request)
        {
            var response = new CreateSaleResponse();

            try
            {
                if (request == null || request.SaleDetails == null || request.SaleDetails.Count == 0)
                {
                    response.Success = false;
                    response.Message = "Invalid Request: Sales must have at least one item.";
                    return response;
                }

                // 1. Create the Header first to get the ID
                int newSaleId = await _saleRepository.CreateSaleHeaderAsync(request);

                // 2. Loop through the details and save them with the new ID
                if (request.SaleDetails != null && request.SaleDetails.Count > 0)
                {
                    foreach (var item in request.SaleDetails)
                    {
                        await _saleRepository.CreateSaleDetailAsync(newSaleId, item);
                    }
                }

                response.Success = true;
                response.SaleId = newSaleId;
                response.Message = "Sale created successfully.";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error processing sale: " + ex.Message;
            }

            return response;
        }

        public async Task<SaleDTO> GetSaleByIdAsync(int id)
        {
            return await _saleRepository.GetSaleByIdAsync(id);
        }

        public async Task<CreateSaleResponse> UpdateSaleAsync(UpdateSaleRequest request)
        {
            var response = new CreateSaleResponse();
            try
            {
                if (request == null || request.Id <= 0)
                {
                    response.Success = false;
                    response.Message = "Invalid Request";
                    return response;
                }

                // 1. Update Header
                await _saleRepository.UpdateSaleHeaderAsync(request);

                // 2. Clear Old Details
                await _saleRepository.DeleteSaleDetailsAsync(request.Id);

                // 3. Insert New Details
                if (request.SaleDetails != null)
                {
                    foreach (var item in request.SaleDetails)
                    {
                        await _saleRepository.CreateSaleDetailAsync(request.Id, item);
                    }
                }

                response.Success = true;
                response.Message = "Sale updated successfully.";
                response.SaleId = request.Id;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error updating sale: " + ex.Message;
            }
            return response;
        }

        public async Task<GetAllSalesResponse> GetAllSalesAsync()
        {
            var response = new GetAllSalesResponse();
            try
            {
                var sales = await _saleRepository.GetAllSalesAsync();
                response.Sales = sales.ToList();
            }
            catch (Exception ex)
            {
                // In a real app, log this.
                response.Sales = new List<SaleSummaryDTO>();
            }
            return response;
        }

        public async Task<PagedResponse<SaleSummaryDTO>> GetPagedAsync(PagedRequest request)
        {
            if (request == null) request = new PagedRequest();
            return await _saleRepository.GetPagedAsync(request.PageNumber, request.PageSize, request.SearchTerm);
        }

        public async Task<DeleteSaleResponse> DeleteSaleAsync(DeleteSaleRequest request)
        {
            var response = new DeleteSaleResponse();
            try
            {
                await _saleRepository.DeleteSaleAsync(request.Id);
                response.Success = true;
                response.Message = "Sale deleted successfully.";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error deleting sale: {ex.Message}";
            }
            return response;
        }
    }
}