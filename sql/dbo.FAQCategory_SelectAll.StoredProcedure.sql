USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[FAQCategory_SelectAll]    Script Date: 5/24/2023 1:37:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Daniel Ortega
-- Create date: 4/12/2023
-- Description: FAQsCategory Select All
-- Code Reviewer:

-- MODIFIED BY: author
-- MODIFIED DATE:12/1/2020
-- Code Reviewer: Marcela Aburto
-- Note: 'Looks good and it is working'
-- =============================================


CREATE proc [dbo].[FAQCategory_SelectAll]

as 

/*
	Execute dbo.FAQCategory_SelectAll

*/


Begin


		SELECT [Id]
				,[Name]
		FROM [dbo].[FAQCategories]






END
GO
