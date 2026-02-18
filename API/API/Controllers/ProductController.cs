using API.Models;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpPost("GetAll")]
        public async Task<ActionResult<GetAllProductsResponse>> GetAll()
        {
            var response = await _productService.GetAllProductsAsync();
            return Ok(response);
        }

        [HttpPost("GetPaged")]
        public async Task<ActionResult<PagedResponse<ProductDTO>>> GetPaged([FromBody] PagedRequest request)
        {
            var response = await _productService.GetPagedAsync(request);
            return Ok(response);
        }

        [HttpPost("GetById")]
        public async Task<ActionResult<ProductDTO>> GetById([FromBody] GetProductByIdRequest request)
        {
            var response = await _productService.GetProductByIdAsync(request);

            if (response == null) return NotFound("Product not found");

            return Ok(response);
        }

        [HttpPost("Create")]
        public async Task<ActionResult<CreateProductResponse>> Create([FromBody] CreateProductRequest request)
        {
            var response = await _productService.CreateProductAsync(request);
            if (response.Success) return Ok(response);
            return StatusCode(500, response);
        }

        [HttpPost("Update")]
        public async Task<ActionResult<UpdateProductResponse>> Update([FromBody] UpdateProductRequest request)
        {
            var response = await _productService.UpdateProductAsync(request);
            if (response.Success) return Ok(response);
            return StatusCode(500, response);
        }

        [HttpPost("Delete")]
        public async Task<ActionResult<DeleteProductResponse>> Delete([FromBody] DeleteProductRequest request)
        {
            var response = await _productService.DeleteProductAsync(request);
            if (response.Success) return Ok(response);
            return StatusCode(500, response);
        }
    }
}