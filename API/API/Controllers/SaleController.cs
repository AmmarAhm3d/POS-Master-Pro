using API.Models;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SaleController : ControllerBase
    {
        private readonly ISaleService _saleService;

        public SaleController(ISaleService saleService)
        {
            _saleService = saleService;
        }

        [HttpPost("Create")]
        public async Task<ActionResult<CreateSaleResponse>> Create([FromBody] CreateSaleRequest request)
        {
            var response = await _saleService.CreateSaleAsync(request);
            if (response.Success) return Ok(response);
            return StatusCode(500, response);
        }

        [HttpPost("GetById")]
        public async Task<ActionResult<SaleDTO>> GetById([FromBody] GetSaleByIdRequest request)
        {
            var response = await _saleService.GetSaleByIdAsync(request.Id);
            if (response == null) return NotFound("Sale not found");
            return Ok(response);
        }

        [HttpPost("Update")]
        public async Task<ActionResult<CreateSaleResponse>> Update([FromBody] UpdateSaleRequest request)
        {
            var response = await _saleService.UpdateSaleAsync(request);
            if (response.Success) return Ok(response);
            return StatusCode(500, response);
        }

        [HttpPost("GetAll")]
        public async Task<ActionResult<GetAllSalesResponse>> GetAll()
        {
            var response = await _saleService.GetAllSalesAsync();
            return Ok(response);
        }

        [HttpPost("GetPaged")]
        public async Task<ActionResult<PagedResponse<SaleSummaryDTO>>> GetPaged([FromBody] PagedRequest request)
        {
            var response = await _saleService.GetPagedAsync(request);
            return Ok(response);
        }

        [HttpPost("Delete")]
        public async Task<ActionResult<DeleteSaleResponse>> Delete([FromBody] DeleteSaleRequest request)
        {
            var response = await _saleService.DeleteSaleAsync(request);
            if (response.Success) return Ok(response);
            return StatusCode(500, response);
        }
    }
}