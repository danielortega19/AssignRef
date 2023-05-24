using Sabio.Data.Providers;
using Sabio.Services.Interfaces;
using Sabio.Services.Locations;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Sabio.Models.Domain.CrewOfficials;
using Sabio.Models.Requests.CrewOfficials;

namespace Sabio.Services
{
    public class CrewOfficialsService : ICrewOfficialsService
    {
        IDataProvider _data = null;
        public CrewOfficialsService(IDataProvider data)
        {
            _data = data;

        }
        public void Add(CrewOfficialsAddRequest model)
        {
            string procName = "[dbo].CrewOfficials_Insert";

            DataTable batchCrewOfficials = MapCrewOfficialsToTable(model.CrewOfficials);

                _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@BatchOfficialsCrew", batchCrewOfficials);


                }, returnParameters: null);
            }
        private DataTable MapCrewOfficialsToTable(List<CrewOfficial> crewOfficials)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("CrewId", typeof(int));
            dt.Columns.Add("OfficialId", typeof(int));
            dt.Columns.Add("PositionId", typeof(int));

            if (crewOfficials != null)
            {
                foreach (CrewOfficial crewOfficial in crewOfficials)
                {
                    DataRow dr = dt.NewRow();
                    int startingIndex = 0;
                    dr.SetField(startingIndex++, crewOfficial.CrewId);
                    dr.SetField(startingIndex++, crewOfficial.OfficialId);
                    dr.SetField(startingIndex++, crewOfficial.PositionId);

                    dt.Rows.Add(dr);
                }
            }
            return dt;
        }
    }
}
