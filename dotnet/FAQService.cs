using Microsoft.AspNetCore.Http;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Domain.FAQ;
using Sabio.Models.Requests.FAQ;
using Sabio.Services.Interfaces.Security;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class FAQService : IFAQService 
    {
        IDataProvider _data = null;

        public FAQService(IDataProvider data)
        {

            _data = data;
        }

        
        public void Delete(int id)
        {
            string procName = "[dbo].[FAQs_Delete]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            }, returnParameters: null);
        }


        public List<FAQ> GetAll()
        {
            List<FAQ> list = null;
            string procName = "[dbo].[FAQs_SelectAll]";

            _data.ExecuteCmd(procName, inputParamMapper: null, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                FAQ faq = MapSingleFAQ(reader);

                if (list == null)
                {
                    list = new List<FAQ>();
                }

                list.Add(faq);
            });

            return list;


        }

        public List<FAQ> GetByCategory(int id)
        {
            List<FAQ> list = null;
            string procName = "[dbo].[FAQs_SelectByCategory]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@Id", id);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                FAQ faq = MapSingleFAQ(reader);

                if (list == null)
                {
                    list = new List<FAQ>();
                }

                list.Add(faq);
            });

            return list;
        }

public int Add(FAQAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[FAQs_Insert]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col, userId);
                col.AddWithValue("@CreatedBy", userId);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                col.Add(idOut);
            }, returnParameters: delegate (SqlParameterCollection returnCol)
            {
                object Id = returnCol["@Id"].Value;

                int.TryParse(Id.ToString(), out id);
            });

            return id;
        }

        public void Update(FAQUpdateRequest model, int userId)
        {
            string procName = "[dbo].[FAQs_Update]";


            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col, userId);
                col.AddWithValue("@ModifiedBy", userId);
                col.AddWithValue("@Id", model.Id);
               

            }, returnParameters: null
            );
        }


        private static void AddCommonParams(FAQAddRequest model, SqlParameterCollection col, int userId)
        {
            col.AddWithValue("@Question", model.Question);
            col.AddWithValue("@Answer", model.Answer);
            col.AddWithValue("@CategoryId", model.CategoryId);
            col.AddWithValue("@SortOrder", model.SortOrder);
            
        }

        private static FAQ MapSingleFAQ(IDataReader reader)
        {
            FAQ faq = new FAQ();
            faq.Category = new LookUp();

            int startingIndex = 0;

            faq.Id = reader.GetInt32(startingIndex++);
            faq.Question = reader.GetString(startingIndex++);
            faq.Answer = reader.GetString(startingIndex++);
            faq.Category.Id = reader.GetInt32(startingIndex++);
            faq.Category.Name = reader.GetString(startingIndex++);
            faq.SortOrder = reader.GetInt32(startingIndex++);
            faq.DateCreated = reader.GetDateTime(startingIndex++);
            faq.DateModified = reader.GetDateTime(startingIndex++);
            faq.CreatedBy = reader.GetInt32(startingIndex++);
            faq.ModifiedBy = reader.GetInt32(startingIndex++);

            return faq;

        }



    }
}
