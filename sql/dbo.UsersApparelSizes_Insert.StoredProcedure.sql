USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[UsersApparelSizes_Insert]    Script Date: 5/24/2023 1:37:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author: Daniel Ortega
-- Create date: 4/21/23
-- Description: insert into [dbo].[UsersApparelSizes]
-- Code Reviewer: Armando Gonzales

-- MODIFIED BY: author
-- MODIFIED DATE:12/1/2020
-- Code Reviewer:
-- Note:
-- =============================================

CREATE proc [dbo].[UsersApparelSizes_Insert]
						@UserId int
						,@ShirtSize int
						,@JacketSize int
						,@ShoeSize decimal(3,1)
						,@HatSize int
						,@PantsWaist int
						,@PantsSize int
						,@StatusTypeId int
						,@Id int OUTPUT



/*
	Declare @Id int = 0

	Declare				 @UserId int = 8
						,@ShirtSize int = 3
						,@JacketSize int = 4
						,@ShoeSize decimal(3,1) = 11.5
						,@HatSize int = 2
						,@PantsWaist int = 34
						,@PantsSize int = 3
						,@StatusTypeId int = 1

	Execute  dbo.UsersApparelSizes_Insert @UserId
						,@ShirtSize 
						,@JacketSize 
						,@ShoeSize 
						,@HatSize 
						,@PantsWaist 
						,@PantsSize 
						,@StatusTypeId 
						,@Id OUTPUT


	select *
	from dbo.UsersApparelSizes
					

*/
						

as



BEGIN


		INSERT INTO [dbo].[UsersApparelSizes]
           ([UserId]
           ,[ShirtSize]
           ,[JacketSize]
           ,[ShoeSize]
           ,[HatSize]
           ,[PantsWaist]
           ,[PantsSize]
           ,[StatusTypeId])
     VALUES 
			(@UserId
			,@ShirtSize
			,@JacketSize
			,@ShoeSize
			,@HatSize
			,@PantsWaist
			,@PantsSize
			,@StatusTypeId
			)
     SET @Id = SCOPE_IDENTITY()
          
         
           
        
       



END
GO
