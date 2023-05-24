using Sabio.Data.Providers;
using Sabio.Services.Interfaces;
using Sabio.Services.Locations;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using Sabio.Models.Domain.UsersApparelSizes;
using Sabio.Models.Domain;
using Sabio.Models;
using Sabio.Models.Requests.UsersApparelSizes;
using Sabio.Data;

namespace Sabio.Services
{
    public class UsersApparelSizesService : IUsersApparelSizesService
    {
        IDataProvider _data = null;
        IBaseUserMapper _userMapper = null;
        ILocationMapper _locationMapper = null;
        ILookUpService _lookUpService = null;


        public UsersApparelSizesService(IDataProvider data, IBaseUserMapper userMapper, ILocationMapper locationMapper, ILookUpService lookup)
        {
            _data = data;
            _userMapper = userMapper;
            _locationMapper = locationMapper;
            _lookUpService = lookup;
      
        }


        public UsersApparelSize GetByUserId(int userId)
        {
            string procName = "[dbo].[UsersApparelSizes_Select_ByUserId]";

            UsersApparelSize apparel = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {

                paramCollection.AddWithValue("@Id", userId);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                apparel = MapUserApparel(reader, ref startingIndex);

            }
           );

            return apparel;
        }

        public BaseUserApparelSize GetApparelSizesByUsersId(int userId)
        {
            string procName = "[dbo].[UsersApparelSizes_SelectById]";

            BaseUserApparelSize apparel = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {

                paramCollection.AddWithValue("@Id", userId);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                apparel = MapApperalSize(reader, ref startingIndex);

            }
           );

            return apparel;
        }

        public Paged<UsersApparelSize> GetByConferenceId(int pageIndex, int pageSize, int conferenceId)
        {
            Paged<UsersApparelSize> pagedList = null;
            List<UsersApparelSize> list = null;
            int totalCount = 0;

            _data.ExecuteCmd("[dbo].[UsersApparelSizes_Select_ByConferenceId]", (param) =>
            {
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
                param.AddWithValue("@Id", conferenceId);
            },
            (reader, recordSetIndex) =>
            {
                int startingIndex = 0;

                UsersApparelSize apperal = MapUserApparel(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetInt32(startingIndex);
                }

                if (list == null)
                {
                    list = new List<UsersApparelSize>();
                }
                list.Add(apperal);
            });
            if (list != null)
            {
                pagedList = new Paged<UsersApparelSize>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;

        }

        public Paged<UsersApparelSize> Search(int pageIndex, int pageSize, string query)
        {
            Paged<UsersApparelSize> pagedList = null;
            List<UsersApparelSize> list = null;
            int totalCount = 0;

            _data.ExecuteCmd("[dbo].[UsersApparelSizes_Search]", (param) =>
            {
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
                param.AddWithValue("@Query", query);
            },
            (reader, recordSetIndex) =>
            {
                int startingIndex = 0;

                UsersApparelSize apperal = MapUserApparel(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetInt32(startingIndex);
                }

                if (list == null)
                {
                    list = new List<UsersApparelSize>();
                }
                list.Add(apperal);
            });
            if (list != null)
            {
                pagedList = new Paged<UsersApparelSize>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;

        }

        public int Add(UsersApparelSizesAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[UsersApparelSizes_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, userId, col);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                col.Add(idOut);

            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;

                int.TryParse(oId.ToString(), out id);


            });


            return id;
        }

        public Paged<UsersApparelSize> GetAllOfficials(int pageIndex, int pageSize)
        {
            Paged<UsersApparelSize> pagedList = null;
            List<UsersApparelSize> list = null;
            int totalCount = 0;

            _data.ExecuteCmd("[dbo].[OfficialsApparelSizes_SelectAll]", (param) =>
            {
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
            },
            (reader, recordSetIndex) =>
            {
                int startingIndex = 0;

                UsersApparelSize official = MapUserApparel(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex);
                }

                if (list == null)
                {
                    list = new List<UsersApparelSize>();
                }
                list.Add(official);
            });
            if (list != null)
            {
                pagedList = new Paged<UsersApparelSize>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;

        }

        private static void AddCommonParams(UsersApparelSizesAddRequest model, int userId, SqlParameterCollection col)
        {
            col.AddWithValue("@UserId", userId);
            col.AddWithValue("@ShirtSize", model.ShirtSize == null ? DBNull.Value : model.ShirtSize);
            col.AddWithValue("@JacketSize", model.JacketSize == null ? DBNull.Value : model.JacketSize);
            col.AddWithValue("@ShoeSize", model.ShoeSize == null ? DBNull.Value : model.ShoeSize);
            col.AddWithValue("@HatSize", model.HatSize == null ? DBNull.Value : model.HatSize);
            col.AddWithValue("@PantsWaist", model.PantsWaist == null ? DBNull.Value : model.PantsWaist);
            col.AddWithValue("@PantsSize", model.PantsSize == null ? DBNull.Value : model.PantsSize);
            col.AddWithValue("@StatusTypeId", model.StatusTypeId);
        }

        public void Update(UsersApparelSizesUpdateRequest model, int userId)
        {
            string procName = "[dbo].[UsersApparelSizes_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, userId, col);
                col.AddWithValue("@Id", model.Id);


            }, returnParameters: null);

        }

        public void Delete(int id, int userId)
        {
            string procName = "[dbo].[UsersApparelSizes_Delete]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@UserId", userId);
                col.AddWithValue("@Id", id);

            }, returnParameters: null);

        }


        private UsersApparelSize MapUserApparel(IDataReader reader, ref int startingIndex)
        {
            UsersApparelSize userApparel = new UsersApparelSize();
          

            userApparel.User = _userMapper.MapBaseUser(reader, ref startingIndex);
            userApparel.Gender = reader.GetSafeString(startingIndex++);
            userApparel.Email = reader.GetSafeString(startingIndex++);
            userApparel.Phone = reader.GetSafeString(startingIndex++);
            userApparel.PrimaryPosition = new LookUp3Col();
            userApparel.PrimaryPosition.Id = reader.GetSafeInt32(startingIndex++);
            userApparel.PrimaryPosition.Name = reader.GetSafeString(startingIndex++);
            userApparel.PrimaryPosition.Code = reader.GetSafeString(startingIndex++);
            userApparel.Location = _locationMapper.MapLocation(reader, ref startingIndex);
            userApparel.ApparelSize = MapApperalSize(reader, ref startingIndex);
            userApparel.DateCreated = reader.GetSafeDateTime(startingIndex++);
            userApparel.DateModified = reader.GetSafeDateTime(startingIndex++);
            userApparel.StatusType = new LookUp();
            userApparel.StatusType.Id = reader.GetSafeInt32(startingIndex++);
            userApparel.StatusType.Name = reader.GetSafeString(startingIndex++);

            return userApparel;

        }

        private BaseUserApparelSize MapApperalSize(IDataReader reader, ref int startingIndex)
        {
            BaseUserApparelSize apperalSize = new BaseUserApparelSize();
            
            apperalSize.Id = reader.GetSafeInt32(startingIndex++);
            apperalSize.HatSize = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            apperalSize.JacketSize = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            apperalSize.PantsSize = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            apperalSize.PantsWaist = reader.GetSafeInt32Nullable(startingIndex++);
            apperalSize.ShirtSize = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            apperalSize.ShoeSize = reader.GetSafeDecimalNullable(startingIndex++);

            return apperalSize;


        }
    }
}
