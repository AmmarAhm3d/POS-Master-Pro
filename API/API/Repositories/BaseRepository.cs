using System.Data;
using API.Helpers;
using Microsoft.Data.SqlClient;

namespace API.Repositories
{
    public abstract class BaseRepository
    {
        protected SqlConnection GetConnection()
        {
            return ConnectionHelper.GetConnection();
        }

        protected async Task<IEnumerable<T>> QueryAsync<T>(string procedureName, Func<SqlDataReader, T> map, SqlParameter[] parameters = null)
        {
            var list = new List<T>();
            using (var connection = GetConnection())
            {
                using (var command = new SqlCommand(procedureName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    if (parameters != null)
                    {
                        command.Parameters.AddRange(parameters);
                    }

                    await connection.OpenAsync();
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            list.Add(map(reader));
                        }
                    }
                }
            }
            return list;
        }

        protected async Task<T> QuerySingleAsync<T>(string procedureName, Func<SqlDataReader, T> map, SqlParameter[] parameters = null)
        {
            using (var connection = GetConnection())
            {
                using (var command = new SqlCommand(procedureName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    if (parameters != null)
                    {
                        command.Parameters.AddRange(parameters);
                    }

                    await connection.OpenAsync();
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return map(reader);
                        }
                    }
                }
            }
            return default(T);
        }

        protected async Task<int> ExecuteNonQueryAsync(string procedureName, SqlParameter[] parameters)
        {
            using (var connection = GetConnection())
            {
                using (var command = new SqlCommand(procedureName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    if (parameters != null)
                    {
                        command.Parameters.AddRange(parameters);
                    }

                    await connection.OpenAsync();
                    return await command.ExecuteNonQueryAsync();
                }
            }
        }

        protected async Task<object> ExecuteScalarAsync(string procedureName, SqlParameter[] parameters)
        {
            using (var connection = GetConnection())
            {
                using (var command = new SqlCommand(procedureName, connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    if (parameters != null)
                    {
                        command.Parameters.AddRange(parameters);
                    }

                    await connection.OpenAsync();
                    return await command.ExecuteScalarAsync();
                }
            }
        }
    }
}
