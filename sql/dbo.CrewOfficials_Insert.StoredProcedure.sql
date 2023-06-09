USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[CrewOfficials_Insert]    Script Date: 5/24/2023 1:37:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Daniel Ortega
-- Create date: 5/13/2023
-- Description: inserting data to this table if there is no duplicate data
-- Code Reviewer: Alicia St Denis

-- MODIFIED BY: author
-- MODIFIED DATE:12/1/2020
-- Code Reviewer:
-- Note:
-- =============================================




CREATE proc [dbo].[CrewOfficials_Insert]
		@BatchOfficialsCrew dbo.BatchOfficialCrews READONLY
		
		
as

/* ------- Test Code -------
Declare @BatchOfficialsCrew dbo.BatchOfficialCrews


Insert into @BatchOfficialsCrew (CrewId, OfficialId, PositionId)
Values(10,86,2), (10,90,2), (11,90,2)
select * 
from dbo.CrewOfficials

Execute [dbo].[OfficialsCrew_Insert] @BatchOfficialsCrew

select * 
from dbo.CrewOfficials


*/

BEGIN

INSERT INTO [dbo].[CrewOfficials]
           ([CrewId]
           ,[OfficialId]
           ,[PositionId])
    Select b.CrewId
			,b.OfficialId
			,b.PositionId

	From @BatchOfficialsCrew as b 
	Where Not Exists ( Select 1 
						from dbo.CrewOfficials as co inner join @BatchOfficialsCrew as bo
								on co.OfficialId = bo.OfficialId

						Where b.CrewId = co.CrewId AND b.OfficialId = co.OfficialId )
	
	
END
GO
