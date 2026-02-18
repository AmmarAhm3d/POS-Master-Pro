using API.Models;

namespace API.Services.Interfaces
{
    public interface IProductService
    {
        Task<GetAllProductsResponse> GetAllProductsAsync();
        Task<PagedResponse<ProductDTO>> GetPagedAsync(PagedRequest request);
        Task<ProductDTO> GetProductByIdAsync(GetProductByIdRequest request);
        Task<CreateProductResponse> CreateProductAsync(CreateProductRequest request);
        Task<UpdateProductResponse> UpdateProductAsync(UpdateProductRequest request);
        Task<DeleteProductResponse> DeleteProductAsync(DeleteProductRequest request);
    }
}