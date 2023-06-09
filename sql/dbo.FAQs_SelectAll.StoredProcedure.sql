USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[FAQs_SelectAll]    Script Date: 5/24/2023 1:37:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author: Daniel Ortega
-- Create date: 4/12/2023
-- Description: FAQs select all joined with FAQs Category 
-- Code Reviewer:

-- MODIFIED BY: author
-- MODIFIED DATE:12/1/2020
-- Code Reviewer: Marcela Aburto
-- Note: 'Looks good and it works'
-- =============================================


CREATE proc [dbo].[FAQs_SelectAll] 

/*

Execute dbo.FAQs_SelectAll 
*/

as



BEGIN



		SELECT faq.[Id]
			  ,[Question]
			  ,[Answer]
			  ,fc.[Id]
			  ,fc.[Name] as FAQCategory
			  ,[SortOrder]
			  ,[DateCreated]
			  ,[DateModified]
			  ,[CreatedBy]
			  ,[ModifiedBy]
		FROM [dbo].[FAQs] as faq inner join dbo.FAQCategories as fc 
					on faq.CategoryId = fc.Id



END

GO
