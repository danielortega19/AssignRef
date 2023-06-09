USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[FAQs_Update]    Script Date: 5/24/2023 1:37:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
		
		
		-- ============================================
		-- Author: Daniel Ortega
		-- Create date: 4/12/2023
		-- Description: FAQs insert and FAQsCategory insert
		-- Code Reviewer:

		-- MODIFIED BY: author
		-- MODIFIED DATE:12/1/2020
		-- Code Reviewer: Marcela Aburto
		-- Note: 'Looks good and it works'
		-- =============================================

		CREATE proc [dbo].[FAQs_Update]
				
						@Question nvarchar(255)
						,@Answer nvarchar(2000) 
						,@CategoryId int
						,@SortOrder int
						,@ModifiedBy int
						,@Id int 




		/*
	Declare @Id int = 5

	Declare   @Question nvarchar(255) = 'What is the company''s goal?'
					,@Answer nvarchar(2000) = 'Updating'
					,@CategoryId = 1
					,@SortOrder int = 1
					,@ModifiedBy int = 8
		

	Execute [dbo].[FAQs_Update]
				@Question 
					,@Answer 
					,@CategoryName 
					,@SortOrder
					,@ModifiedBy 
					,@Id 

	Execute dbo.FAQs_SelectAll 




		*/
		as 



		BEGIN


			UPDATE [dbo].[FAQs]
			SET [Question] = @Question
			  ,[Answer] = @Answer
			  ,[CategoryId] = @CategoryId
			  ,[SortOrder] = @SortOrder
			  ,[DateModified] = getutcdate()
			  ,[CreatedBy] = (Select [Createdby] 
								From dbo.[FAQs]
								Where Id = @Id)
			  ,[ModifiedBy] = @ModifiedBy
			 WHERE Id = @Id

		

		END

GO
