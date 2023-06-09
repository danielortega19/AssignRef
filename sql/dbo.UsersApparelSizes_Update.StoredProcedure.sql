USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[UsersApparelSizes_Update]    Script Date: 5/24/2023 1:37:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author: Daniel Ortega
-- Create date: 4/21/23
-- Description: Update UserApparelSize
-- Code Reviewer: Armando Gonzales

-- MODIFIED BY: author
-- MODIFIED DATE:12/1/2020
-- Code Reviewer:
-- Note:
-- =============================================




CREATE proc [dbo].[UsersApparelSizes_Update] 
						@UserId int
						,@ShirtSize int
						,@JacketSize int
						,@ShoeSize decimal(3,1)
						,@HatSize int
						,@PantsWaist int
						,@PantsSize int
						,@StatusTypeId int
						,@Id int

/*
	Declare @Id int = 20

	Declare				 @UserId int = 42
						,@ShirtSize int = 3
						,@JacketSize int = 4
						,@ShoeSize decimal(3,1) = 11.5
						,@HatSize int = 3
						,@PantsWaist int = 38
						,@PantsSize int = 3
						,@StatusTypeId int = 1

	Execute  dbo.UsersApparelSizes_Update  @UserId
						,@ShirtSize 
						,@JacketSize 
						,@ShoeSize 
						,@HatSize 
						,@PantsWaist 
						,@PantsSize 
						,@StatusTypeId 
						,@Id 


	select *
	from dbo.UsersApparelSizes
					
	
*/

as



BEGIN
			


	UPDATE [dbo].[UsersApparelSizes]
   SET [UserId] = @UserId 
      ,[ShirtSize] = @ShirtSize
      ,[JacketSize] =@JacketSize
      ,[ShoeSize] = @ShoeSize
      ,[HatSize] = @HatSize
      ,[PantsWaist] =@PantsWaist
      ,[PantsSize] = @PantsSize
      ,[DateModified] = GETUTCDATE()
      ,[StatusTypeId] = @StatusTypeId
 WHERE Id = @Id


END
GO
