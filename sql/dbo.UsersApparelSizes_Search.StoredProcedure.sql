USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[UsersApparelSizes_Search]    Script Date: 5/24/2023 1:37:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Daniel Ortega
-- Create date: 4/21/23
-- Description: Search data from Users, ApparelSize, Locations as a paginated
-- Code Reviewer:Armando Gonzales

-- MODIFIED BY: author
-- MODIFIED DATE:12/1/2020
-- Code Reviewer:
-- Note:
-- =============================================

CREATE proc [dbo].[UsersApparelSizes_Search]
							@PageIndex int 
                           ,@PageSize int
						   ,@Query nvarchar(50)

as

/*
	Declare  @PageIndex int = 0
	     ,@PageSize int = 5
	
	Declare @Query nvarchar(50) = 'Carter'
	
	Execute dbo.UsersApparelSizes_Search 
														@PageIndex  
														,@PageSize 
														,@Query

*/


BEGIN


DECLARE @offset int = @PageIndex * @PageSize;
				

	Select	u.Id
			,u.[FirstName]
			,u.[LastName]
			,u.[Mi]
			,u.[AvatarUrl]
			,gt.[Name] as Gender
			,u.[Email]
			,u.[Phone]
			,fp.[Id]
			,fp.[Name] as PositionName
			,fp.[Code] as PositionCode
			, l.[Id] as LocationId
			, l.[LineOne] as LocationLineOne
			, l.[LineTwo] as LocationLineTwo
			, l.[City] as LocationCity
			, s.[Id] as StateId
			, s.[Code] as StateCode
			, s.[Name] as StateName
			, l.[Zip] as LocationZipCode
			, l.[Latitude] as LocationLatitude
			, l.[Longitude] as LocationLongitude
			, lt.[Id] as LocationTypeId
			, lt.[Name] as LocationTypeName
			,ua.[Id]
						,ua.HatSize as HatId
						,HatSize = (Select [Name]
									from dbo.ApparelSizes as a
									where a.Id = ua.HatSize)
						,ua.JacketSize as JacketId
						,JacketSize = (Select [Name]
									from dbo.ApparelSizes as a
									where a.Id = ua.JacketSize)
						,ua.PantsSize as PantsId
						,PantsSize = (Select [Name]
									from dbo.ApparelSizes as a
									where a.Id = ua.PantsSize)
						,ua.PantsWaist
						,ua.ShirtSize as ShirtId
						,ShirtSize = (Select [Name]
									from dbo.ApparelSizes as a
									where a.Id = ua.ShirtSize)
						,ua.ShoeSize
			,u.[DateCreated]
			,u.[DateModified]
			,st.[Id]
			,st.[Name]
			,TotalCount = COUNT(1) OVER()
			


	From dbo.Users as u inner join dbo.Officials as o 
			on u.Id = o.UserId
		inner join dbo.GenderTypes as gt 
			on u.GenderId = gt.Id
		inner join dbo.Locations as l 
			on l.Id = o.LocationId
		inner join dbo.States as s
			on l.StateId = s.Id
		inner join dbo.FieldPositions as fp
			on o.PrimaryPositionId = fp.Id
		inner join dbo.LocationTypes as lt
			on l.LocationTypeId = lt.Id
		left outer join dbo.UsersApparelSizes as ua
			on ua.UserId = u.Id
		inner join dbo.StatusTypes as st
			on u.StatusId = st.Id
			
	
	Where u.[FirstName] LIKE '%' + @Query + '%' or u.[LastName] LIKE '%' + @Query + '%'
	 
	ORDER BY u.Id
		OFFSET @offset Rows
		Fetch Next @PageSize Rows ONLY

END
GO
