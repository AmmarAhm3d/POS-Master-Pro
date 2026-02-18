using API.Models;

namespace API.Services.Interfaces
{
    public interface IPeopleService
    {
        Task<CreatePersonResponse> CreatePersonAsync(CreatePersonRequest request);
        Task<UpdatePersonResponse> UpdatePersonAsync(UpdatePersonRequest request);
        Task<GetAllPeopleResponse> GetAllPeopleAsync(GetAllPeopleRequest request);
        Task<PagedResponse<PersonDTO>> GetPagedAsync(PagedRequest request);
        Task<PersonDTO> GetPersonByIdAsync(GetPersonByIdRequest request);
        Task<DeletePersonResponse> DeletePersonAsync(DeletePersonRequest request);
    }
}