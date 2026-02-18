using API.Models;

namespace API.Repositories.Interfaces
{
    public interface IPeopleRepository
    {
        Task<IEnumerable<PersonDTO>> GetAllAsync();
        Task<PagedResponse<PersonDTO>> GetPagedAsync(int pageNumber, int pageSize);
        Task<PersonDTO> GetByIdAsync(int id);
        Task<int> CreateAsync(CreatePersonRequest person);
        Task<bool> UpdateAsync(UpdatePersonRequest person);
        Task DeletePersonAsync(int id);
    }
}