using System.Data;
using API.Models;
using API.Repositories.Interfaces;
using Microsoft.Data.SqlClient;

namespace API.Repositories.Implementations
{
    public class PeopleRepository : BaseRepository, IPeopleRepository
    {
        public PeopleRepository() { }

        public async Task DeletePersonAsync(int id)
        {
            var parameters = new[]
            {
                new SqlParameter("@Id", id)
            };
            await ExecuteNonQueryAsync("spPeople_Delete", parameters);
        }

        public async Task<IEnumerable<PersonDTO>> GetAllAsync()
        {
            return await QueryAsync<PersonDTO>("spPeople_GetAll", MapToPerson);
        }

        public async Task<PagedResponse<PersonDTO>> GetPagedAsync(int pageNumber, int pageSize)
        {
            var response = new PagedResponse<PersonDTO>
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                Data = new List<PersonDTO>()
            };

            var parameters = new[]
            {
                new SqlParameter("@PageNumber", pageNumber),
                new SqlParameter("@PageSize", pageSize)
            };

            using (var connection = GetConnection())
            {
                using (var command = new SqlCommand("spPeople_GetPaged", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddRange(parameters);

                    await connection.OpenAsync();
                    var people = new List<PersonDTO>();

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            people.Add(MapToPerson(reader));

                            if (response.TotalCount == 0 && reader["TotalCount"] != DBNull.Value)
                            {
                                response.TotalCount = Convert.ToInt32(reader["TotalCount"]);
                            }
                        }
                    }
                    response.Data = people;
                }
            }
            return response;
        }

        public async Task<PersonDTO> GetByIdAsync(int id)
        {
            var parameters = new[]
            {
                new SqlParameter("@Id", id)
            };
            // Use QueryAsync and take the first one, or use a custom QuerySingle implementation in BaseRepository?
            // Existing BaseRepository has QuerySingleAsync but it returns default(T) if not found.
            // Let's implement it using QuerySingleAsync which I added to BaseRepository.

            /* Wait, QuerySingleAsync in BaseRepository returns the object directly.
               But wait, QuerySingleAsync in BaseRepository uses 'if (await reader.ReadAsync()) return map(reader)'.
               So it returns the mapped object or null/default. 
               Perfect.
            */
            return await QuerySingleAsync("spPeople_GetById", MapToPerson, parameters);
        }

        private PersonDTO MapToPerson(SqlDataReader reader)
        {
            return new PersonDTO
            {
                Id = (int)reader["Id"],
                FirstName = reader["FirstName"].ToString(),
                LastName = reader["LastName"].ToString(),
                Email = reader["Email"].ToString(),
                PhoneNumber = reader["PhoneNumber"] != DBNull.Value ? reader["PhoneNumber"].ToString() : null
            };
        }

        public async Task<bool> UpdateAsync(UpdatePersonRequest person)
        {
            var parameters = new[]
           {
                new SqlParameter("@Id", person.Id),
                new SqlParameter("@FirstName", person.FirstName),
                new SqlParameter("@LastName", person.LastName),
                new SqlParameter("@Email", person.Email),
                new SqlParameter("@PhoneNumber", (object)person.PhoneNumber ?? DBNull.Value)
            };

            var rowsAffected = await ExecuteNonQueryAsync("spPeople_Update", parameters);
            // If SET NOCOUNT ON is used, rowsAffected will be -1. We assume success in that case.
            return rowsAffected > 0 || rowsAffected == -1;
        }

        public async Task<int> CreateAsync(CreatePersonRequest person)
        {
            var parameters = new[]
            {
                new SqlParameter("@FirstName", person.FirstName),
                new SqlParameter("@LastName", person.LastName),
                new SqlParameter("@Email", person.Email),
                new SqlParameter("@PhoneNumber", (object)person.PhoneNumber ?? DBNull.Value)
            };

            var result = await ExecuteScalarAsync("spPeople_Create", parameters);
            return Convert.ToInt32(result);
        }
    }
}