using API.Models;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PeopleController : ControllerBase
    {
        private readonly IPeopleService _peopleService;

        public PeopleController(IPeopleService peopleService)
        {
            _peopleService = peopleService;
        }

        [HttpPost("Create")]
        public async Task<ActionResult<CreatePersonResponse>> Create([FromBody] CreatePersonRequest request)
        {
            var response = await _peopleService.CreatePersonAsync(request);
            if (response.Success) return Ok(response);
            return BadRequest(response); // Or 500 depending on preference, but Service handles logic/validation failures
        }

        [HttpPost("Update")]
        public async Task<ActionResult<UpdatePersonResponse>> Update([FromBody] UpdatePersonRequest request)
        {
            var response = await _peopleService.UpdatePersonAsync(request);
            if (response.Success) return Ok(response);
            return BadRequest(response);
        }

        [HttpPost("GetAll")]
        public async Task<ActionResult<GetAllPeopleResponse>> GetAll([FromBody] GetAllPeopleRequest request)
        {
            var response = await _peopleService.GetAllPeopleAsync(request);
            return Ok(response);
        }

        [HttpPost("GetPaged")]
        public async Task<ActionResult<PagedResponse<PersonDTO>>> GetPaged([FromBody] PagedRequest request)
        {
            var response = await _peopleService.GetPagedAsync(request);
            return Ok(response);
        }

        [HttpPost("GetById")]
        public async Task<ActionResult<PersonDTO>> GetById([FromBody] GetPersonByIdRequest request)
        {
            var response = await _peopleService.GetPersonByIdAsync(request);
            if (response == null) return NotFound("Person not found");
            return Ok(response);
        }

        [HttpPost("Delete")]
        public async Task<ActionResult<DeletePersonResponse>> Delete([FromBody] DeletePersonRequest request)
        {
            var response = await _peopleService.DeletePersonAsync(request);
            if (response.IsSuccess) return Ok(response);
            return BadRequest(response);
        }
    }
}