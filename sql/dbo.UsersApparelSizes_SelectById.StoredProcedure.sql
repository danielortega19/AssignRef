USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[UsersApparelSizes_SelectById]    Script Date: 5/24/2023 1:37:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

		-- =============================================
		-- Author: Daniel Ortega
		-- Create date: 4/21/23
		-- Description: select just apparel sizes based on the user ID
		-- Code Reviewer: Armando Gonzales

		-- MODIFIED BY: author
		-- MODIFIED DATE:12/1/2020
		-- Code Reviewer:
		-- Note:
		-- =============================================


		CREATE proc [dbo].[UsersApparelSizes_SelectById]
							@Id int
		/*
		Declare @Id int = 46

		Execute [dbo].[UsersApparelSizes_SelectById] @Id


		*/

		as 


		BEGIN

		SELECT					ua.[Id]
								,ua.HatSize
								,HatSize = (Select [Name]
											from dbo.ApparelSizes as a
											where a.Id = ua.HatSize)
								,ua.JacketSize
								,JacketSize = (Select [Name]
											from dbo.ApparelSizes as a
											where a.Id = ua.JacketSize)
								,ua.PantsSize
								,PantsSize = (Select [Name]
											from dbo.ApparelSizes as a
											where a.Id = ua.PantsSize)
								,ua.PantsWaist
								,ua.ShirtSize
								,ShirtSize = (Select [Name]
											from dbo.ApparelSizes as a
											where a.Id = ua.ShirtSize)
								,ua.ShoeSize
		  FROM [dbo].[UsersApparelSizes] as ua inner join dbo.Users as u
					on ua.UserId = u.Id

		  Where u.[Id] = @Id


		END


GO
