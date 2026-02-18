using API.Models;
using API.Repositories.Interfaces;
using API.Services.Interfaces;
using Microsoft.Data.SqlClient;

namespace API.Services.Implementations
{
    public class PeopleService : IPeopleService
    {
        private readonly IPeopleRepository _repository;

        public PeopleService(IPeopleRepository repository)
        {
            _repository = repository;
        }

        public async Task<DeletePersonResponse> DeletePersonAsync(DeletePersonRequest request)
        {
            var response = new DeletePersonResponse();

            try
            {
                // Validation moved from Controller
                if (request == null || request.Id <= 0)
                {
                    response.IsSuccess = false;
                    response.Message = "Invalid Request";
                    return response;
                }

                // Call the repository
                await _repository.DeletePersonAsync(request.Id);

                response.IsSuccess = true;
                response.Message = "Person deleted successfully.";
            }
            catch (SqlException ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Number == 547
                    ? "Cannot delete person because they have associated sales records."
                    : "Database error: " + ex.Message;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Error deleting person: " + ex.Message;
            }

            return response;
        }

        public async Task<PagedResponse<PersonDTO>> GetPagedAsync(PagedRequest request)
        {
            if (request == null) request = new PagedRequest();
            return await _repository.GetPagedAsync(request.PageNumber, request.PageSize);
        }

        public async Task<GetAllPeopleResponse> GetAllPeopleAsync(GetAllPeopleRequest request)
        {
            var peopleEntities = await _repository.GetAllAsync();

            var response = new GetAllPeopleResponse();
            response.People = peopleEntities.ToList();

            return response;
        }

        public async Task<PersonDTO> GetPersonByIdAsync(GetPersonByIdRequest request)
        {
            return await _repository.GetByIdAsync(request.Id);
        }

        public async Task<CreatePersonResponse> CreatePersonAsync(CreatePersonRequest request)
        {
            if (request == null)
            {
                return new CreatePersonResponse { Success = false, Message = "Invalid Request" };
            }

            // 2. Call Repository
            var newId = await _repository.CreateAsync(request);

            // 3. Map Result -> Response
            return new CreatePersonResponse
            {
                PersonId = newId,
                Success = true,
                Message = "Person created successfully"
            };
        }

        public async Task<UpdatePersonResponse> UpdatePersonAsync(UpdatePersonRequest request)
        {
            if (request == null)
            {
                return new UpdatePersonResponse { Success = false, Message = "Invalid Request" };
            }

            // 2. Call Repository (This uses the fixed ExecuteScalar logic we discussed)
            bool isUpdated = await _repository.UpdateAsync(request);

            // 3. Map Result -> Response
            return new UpdatePersonResponse
            {
                Success = isUpdated,
                Message = isUpdated ? "Person updated successfully" : "Update failed: Person not found"
            };
        }
    }
}