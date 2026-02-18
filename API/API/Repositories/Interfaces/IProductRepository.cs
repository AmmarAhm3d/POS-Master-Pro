using API.Models;

namespace API.Repositories.Interfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<ProductDTO>> GetAllProductsAsync();
        Task<PagedResponse<ProductDTO>> GetPagedAsync(int pageNumber, int pageSize);
        Task<ProductDTO> GetProductByIdAsync(int id);
        Task<int> AddProductAsync(CreateProductRequest product);
        Task<bool> UpdateProductAsync(UpdateProductRequest product);
        Task DeleteProductAsync(int id);
    }
}