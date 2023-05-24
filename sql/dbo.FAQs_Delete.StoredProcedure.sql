USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[FAQs_Delete]    Script Date: 5/24/2023 1:37:27 PM ******/
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



CREATE proc [dbo].[FAQs_Delete] 
				@Id int
	
	
	/*
	Declare @Id int = 5

	Execute dbo.FAQs_Delete @Id

	Execute dbo.FAQs_SelectAll 

	*/

as



BEGIN


	  DELETE FROM [dbo].[FAQs]
      WHERE Id = @Id





END
GO
