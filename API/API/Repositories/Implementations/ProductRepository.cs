using System.Data;
using API.Models;
using API.Repositories.Interfaces;
using Microsoft.Data.SqlClient;

namespace API.Repositories.Implementations
{
    public class ProductRepository : BaseRepository, IProductRepository
    {
        public ProductRepository() { }

        public async Task<IEnumerable<ProductDTO>> GetAllProductsAsync()
        {
            return await QueryAsync<ProductDTO>("spProducts_GetAll", MapToProduct);
        }

        public async Task<PagedResponse<ProductDTO>> GetPagedAsync(int pageNumber, int pageSize)
        {
            var response = new PagedResponse<ProductDTO>
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                Data = new List<ProductDTO>()
            };

            var parameters = new[]
            {
                new SqlParameter("@PageNumber", pageNumber),
                new SqlParameter("@PageSize", pageSize)
            };

            using (var connection = GetConnection())
            {
                using (var command = new SqlCommand("spProducts_GetPaged", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddRange(parameters);

                    await connection.OpenAsync();

                    var products = new List<ProductDTO>();
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            products.Add(MapToProduct(reader));

                            if (response.TotalCount == 0 && reader["TotalCount"] != DBNull.Value)
                            {
                                response.TotalCount = Convert.ToInt32(reader["TotalCount"]);
                            }
                        }
                    }
                    response.Data = products;
                }
            }
            return response;
        }

        public async Task<ProductDTO> GetProductByIdAsync(int id)
        {
            var parameters = new[]
           {
                new SqlParameter("@Id", id)
            };
            return await QuerySingleAsync("spProducts_GetById", MapToProduct, parameters);
        }

        public async Task<int> AddProductAsync(CreateProductRequest product)
        {
            var parameters = new[]
            {
                new SqlParameter("@Name", product.Name),
                new SqlParameter("@Code", (object)product.Code ?? DBNull.Value), // Reverted to original null handling
                new SqlParameter("@CostPrice", product.CostPrice),
                new SqlParameter("@RetailPrice", product.RetailPrice)
            };

            var result = await ExecuteScalarAsync("spProducts_Create", parameters);
            return Convert.ToInt32(result);
        }

        public async Task<bool> UpdateProductAsync(UpdateProductRequest product)
        {
            var parameters = new[]
           {
                new SqlParameter("@Id", product.Id),
                new SqlParameter("@Name", product.Name),
                new SqlParameter("@Code", (object)product.Code ?? DBNull.Value), // Reverted to original null handling
                new SqlParameter("@CostPrice", product.CostPrice),
                new SqlParameter("@RetailPrice", product.RetailPrice)
            };

            var rowsAffected = await ExecuteNonQueryAsync("spProducts_Update", parameters);
            // If SET NOCOUNT ON is used, rowsAffected will be -1. We assume success in that case.
            return rowsAffected > 0 || rowsAffected == -1;
        }

        public async Task DeleteProductAsync(int id)
        {
            var parameters = new[]
            {
                new SqlParameter("@Id", id)
            };
            await ExecuteNonQueryAsync("spProducts_Delete", parameters);
        }

        private ProductDTO MapToProduct(SqlDataReader reader)
        {
            return new ProductDTO
            {
                Id = (int)reader["Id"],
                Name = reader["Name"].ToString(),
                Code = reader["Code"] != DBNull.Value ? reader["Code"].ToString() : null, // Reverted to original null handling
                CostPrice = (decimal)reader["CostPrice"],
                RetailPrice = (decimal)reader["RetailPrice"],
                CreatedDate = reader["CreatedDate"] != DBNull.Value ? ((DateTime)reader["CreatedDate"]).ToString("g") : "" // Reverted to original null handling and format
            };
        }
    }
}