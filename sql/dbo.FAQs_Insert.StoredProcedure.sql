USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[FAQs_Insert]    Script Date: 5/24/2023 1:37:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Daniel Ortega
-- Create date: 4/12/2023
-- Description: FAQs insert and FAQsCategory insert
-- Code Reviewer:

-- MODIFIED BY: author
-- MODIFIED DATE:12/1/2020
-- Code Reviewer: Marcela Aburto
-- Note: 'Looks good and it works'
-- =============================================

CREATE proc [dbo].[FAQs_Insert]
				
				@Question nvarchar(255)
				,@Answer nvarchar(2000) 
				,@CategoryId int 
				,@SortOrder int
				,@CreatedBy int
				,@Id int OUTPUT




/*
Declare @Id int = 0

Declare   @Question nvarchar(255) = 'What?'
				,@Answer nvarchar(2000) = 'Testing'
				,@CategoryId int = 1
				,@SortOrder int = 1
				,@CreatedBy int = 6
		

Execute dbo.FAQs_Insert 
			@Question 
				,@Answer 
				,@CategoryName 
				,@SortOrder
				,@CreatedBy 
				,@Id OUTPUT

Execute dbo.FAQs_SelectAll 




*/
as 



BEGIN

	INSERT INTO [dbo].[FAQs]
           ([Question]
           ,[Answer]
           ,[CategoryId]
           ,[SortOrder]
           ,[CreatedBy]
		   ,[ModifiedBy]
           )

	VALUES (
			@Question
			,@Answer
			,@CategoryId
			,@SortOrder
			,@CreatedBy
			,@CreatedBy)

	SET @Id = SCOPE_IDENTITY()


END

GO
