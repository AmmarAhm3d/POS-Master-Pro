using API.Models;
using API.Repositories.Interfaces;
using API.Services.Interfaces;

namespace API.Services.Implementations
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<GetAllProductsResponse> GetAllProductsAsync()
        {
            var response = new GetAllProductsResponse();
            var products = await _productRepository.GetAllProductsAsync();
            response.Products = products.ToList();
            return response;
        }

        public async Task<ProductDTO> GetProductByIdAsync(GetProductByIdRequest request)
        {
            return await _productRepository.GetProductByIdAsync(request.Id);
        }

        public async Task<PagedResponse<ProductDTO>> GetPagedAsync(PagedRequest request)
        {
            if (request == null) request = new PagedRequest();
            return await _productRepository.GetPagedAsync(request.PageNumber, request.PageSize);
        }

        public async Task<CreateProductResponse> CreateProductAsync(CreateProductRequest request)
        {
            var response = new CreateProductResponse();
            try
            {
                if (request == null)
                {
                    response.Success = false;
                    response.Message = "Invalid Request";
                    return response;
                }

                int newId = await _productRepository.AddProductAsync(request);

                response.Success = true;
                response.ProductId = newId;
                response.Message = "Product created successfully.";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error creating product: " + ex.Message;
            }
            return response;
        }

        public async Task<UpdateProductResponse> UpdateProductAsync(UpdateProductRequest request)
        {
            var response = new UpdateProductResponse();
            try
            {
                if (request == null || request.Id <= 0)
                {
                    response.Success = false;
                    response.Message = "Invalid Request";
                    return response;
                }

                bool isUpdated = await _productRepository.UpdateProductAsync(request);
                response.Success = isUpdated;
                response.Message = isUpdated ? "Product updated successfully." : "Product not found.";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error updating product: " + ex.Message;
            }
            return response;
        }

        public async Task<DeleteProductResponse> DeleteProductAsync(DeleteProductRequest request)
        {
            var response = new DeleteProductResponse();
            try
            {
                if (request == null || request.Id <= 0)
                {
                    response.Success = false;
                    response.Message = "Invalid Request";
                    return response;
                }

                await _productRepository.DeleteProductAsync(request.Id);
                response.Success = true;
                response.Message = "Product deleted successfully.";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = "Error deleting product: " + ex.Message;
            }
            return response;
        }
    }
}