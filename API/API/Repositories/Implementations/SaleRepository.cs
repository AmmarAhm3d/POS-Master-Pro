using System.Data;
using API.Models;
using API.Repositories.Interfaces;
using Microsoft.Data.SqlClient;

namespace API.Repositories.Implementations
{
    public class SaleRepository : BaseRepository, ISaleRepository
    {
        public SaleRepository() { }

        public async Task<int> CreateSaleHeaderAsync(CreateSaleRequest request)
        {
            var parameters = new[]
            {
                new SqlParameter("@TransactionDate", request.TransactionDate),
                new SqlParameter("@PersonId", request.PersonId),
                new SqlParameter("@TotalAmount", request.TotalAmount),
                new SqlParameter("@Comments", (object)request.Comments ?? DBNull.Value)
            };

            var result = await ExecuteScalarAsync("spSales_Create", parameters);
            return Convert.ToInt32(result);
        }

        public async Task CreateSaleDetailAsync(int saleId, SaleDetailRequest detail)
        {
            var parameters = new[]
            {
                new SqlParameter("@SaleId", saleId),
                new SqlParameter("@ProductId", detail.ProductId),
                new SqlParameter("@Quantity", detail.Quantity),
                new SqlParameter("@UnitPrice", detail.UnitPrice),
                new SqlParameter("@Discount", detail.Discount),
                new SqlParameter("@LineTotal", detail.LineTotal)
            };

            await ExecuteNonQueryAsync("spSaleDetails_Create", parameters);
        }

        public async Task UpdateSaleHeaderAsync(UpdateSaleRequest request)
        {
            var parameters = new[]
            {
                new SqlParameter("@Id", request.Id),
                new SqlParameter("@TransactionDate", request.TransactionDate),
                new SqlParameter("@PersonId", request.PersonId),
                new SqlParameter("@TotalAmount", request.TotalAmount),
                new SqlParameter("@Comments", (object)request.Comments ?? DBNull.Value)
            };

            await ExecuteNonQueryAsync("spSales_Update", parameters);
        }

        public async Task DeleteSaleDetailsAsync(int saleId)
        {
            var parameters = new[]
            {
                new SqlParameter("@SaleId", saleId)
            };
            await ExecuteNonQueryAsync("spSaleDetails_DeleteBySaleId", parameters);
        }

        public async Task DeleteSaleAsync(int id)
        {
            var parameters = new[]
            {
                new SqlParameter("@Id", id)
            };
            await ExecuteNonQueryAsync("spSales_Delete", parameters);
        }

        public async Task<SaleDTO> GetSaleByIdAsync(int id)
        {
            var parameters = new[]
            {
                new SqlParameter("@Id", id)
            };

            // 1. Get Header
            var sale = await QuerySingleAsync("spSales_GetById", MapToSaleHeader, parameters);

            if (sale == null) return null;

            // 2. Get Details
            var detailsParams = new[]
            {
                new SqlParameter("@SaleId", id)
            };
            var details = await QueryAsync("spSaleDetails_GetBySaleId", MapToSaleDetail, detailsParams);

            sale.SaleDetails = details.ToList();

            return sale;
        }

        public async Task<IEnumerable<SaleSummaryDTO>> GetAllSalesAsync()
        {
            return await QueryAsync<SaleSummaryDTO>("spSales_GetAll", MapToSaleSummary);
        }

        public async Task<PagedResponse<SaleSummaryDTO>> GetPagedAsync(int pageNumber, int pageSize, string? searchTerm)
        {
            var response = new PagedResponse<SaleSummaryDTO>
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                Data = new List<SaleSummaryDTO>()
            };

            var parameters = new[]
            {
                new SqlParameter("@PageNumber", pageNumber),
                new SqlParameter("@PageSize", pageSize),
                new SqlParameter("@SearchTerm", (object)searchTerm ?? DBNull.Value)
            };

            using (var connection = GetConnection())
            {
                using (var command = new SqlCommand("spSales_GetPaged", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddRange(parameters);

                    await connection.OpenAsync();

                    var sales = new List<SaleSummaryDTO>();
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            sales.Add(MapToSaleSummary(reader));

                            if (response.TotalCount == 0 && reader["TotalCount"] != DBNull.Value)
                            {
                                response.TotalCount = Convert.ToInt32(reader["TotalCount"]);
                            }
                        }
                    }
                    response.Data = sales;
                }
            }
            return response;
        }

        // Mappers
        private SaleDTO MapToSaleHeader(SqlDataReader reader)
        {
            return new SaleDTO
            {
                Id = (int)reader["Id"],
                TransactionDate = (DateTime)reader["TransactionDate"],
                PersonId = (int)reader["PersonId"],
                TotalAmount = (decimal)reader["TotalAmount"],
                Comments = reader["Comments"] != DBNull.Value ? reader["Comments"].ToString() : ""
            };
        }

        private SaleLineItemDTO MapToSaleDetail(SqlDataReader reader)
        {
            return new SaleLineItemDTO
            {
                ProductId = (int)reader["ProductId"],
                ProductName = reader["ProductName"].ToString(),
                Quantity = (int)reader["Quantity"],
                UnitPrice = (decimal)reader["UnitPrice"],
                Discount = (decimal)reader["Discount"],
                LineTotal = (decimal)reader["LineTotal"]
            };
        }

        private SaleSummaryDTO MapToSaleSummary(SqlDataReader reader)
        {
            return new SaleSummaryDTO
            {
                Id = (int)reader["Id"],
                TransactionDate = (DateTime)reader["TransactionDate"],
                TotalAmount = (decimal)reader["TotalAmount"],
                SalesPersonName = reader["SalesPersonName"].ToString(),
                Comments = reader["Comments"] != DBNull.Value ? reader["Comments"].ToString() : ""
            };
        }
    }
}