USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[UsersApparelSizes_Delete]    Script Date: 5/24/2023 1:37:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author: Daniel Ortega
-- Create date: 4/21/23
-- Description: This is a soft Delete for UsersApparelSizes where the status Id gets update to 2 which is inactive in 
-- Code Reviewer: Armando Gonzales

-- MODIFIED BY: author
-- MODIFIED DATE:12/1/2020
-- Code Reviewer:
-- Note:
-- =============================================

CREATE proc [dbo].[UsersApparelSizes_Delete]
					@UserId int
						,@Id int

/*
	Declare @Id int = 2

	Declare				 @UserId int = 8
						

	Execute  dbo.UsersApparelSizes_Delete  @UserId
						,@Id 


	select *
	from dbo.UsersApparelSizes
					

*/

as



BEGIN
	Declare @Inactive int 

	Set @Inactive = 2


	UPDATE [dbo].[UsersApparelSizes]
   SET [UserId] = @UserId 
      ,[DateModified] = GETUTCDATE()
      ,[StatusTypeId] = @Inactive
 WHERE Id = @Id


END
GO
