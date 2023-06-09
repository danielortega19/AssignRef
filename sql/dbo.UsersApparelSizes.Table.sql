USE [AssignRef]
GO
/****** Object:  Table [dbo].[UsersApparelSizes]    Script Date: 5/24/2023 1:37:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UsersApparelSizes](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[ShirtSize] [int] NULL,
	[JacketSize] [int] NULL,
	[ShoeSize] [decimal](3, 1) NULL,
	[HatSize] [int] NULL,
	[PantsWaist] [int] NULL,
	[PantsSize] [int] NULL,
	[DateCreated] [datetime2](7) NOT NULL,
	[DateModified] [datetime2](7) NOT NULL,
	[StatusTypeId] [int] NOT NULL,
 CONSTRAINT [PK_UsersApparelSizes] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[UsersApparelSizes] ADD  CONSTRAINT [DF_UsersApparelSizes_DateCreated]  DEFAULT (getutcdate()) FOR [DateCreated]
GO
ALTER TABLE [dbo].[UsersApparelSizes] ADD  CONSTRAINT [DF_UsersApparelSizes_DateModified]  DEFAULT (getutcdate()) FOR [DateModified]
GO
ALTER TABLE [dbo].[UsersApparelSizes] ADD  CONSTRAINT [DF_UsersApparelSizes_StatusTypeId]  DEFAULT ((1)) FOR [StatusTypeId]
GO
ALTER TABLE [dbo].[UsersApparelSizes]  WITH CHECK ADD  CONSTRAINT [FK_UsersApparelSizes_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[UsersApparelSizes] CHECK CONSTRAINT [FK_UsersApparelSizes_Users]
GO
