# Graph Report - .  (2026-07-13)

## Corpus Check
- 318 files · ~311,263 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 987 nodes · 2337 edges · 145 communities (54 shown, 91 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.72)
- Token cost: 90,818 input · 0 output

## Community Hubs (Navigation)
- Ticket Dialog Menu Actions
- PMS Params & Data Export
- App Shell & Context Providers
- Approval Workflow & Notifications
- Masterlist Tables & Dialogs
- Approver Ticket Views & SignalR
- Concern & Issue Handler Dialogs
- Routing & Page Entry Points
- Auth & Ticketing State
- Checklist Management
- Reports & Ticket History
- Package Config & Browserslist
- Sidebar & Navigation UI
- User Management APIs & Dialogs
- Transfer & Hold Ticket Dialogs
- Masterlist APIs & Login Slice
- NPM Dependencies
- MIS Service Report Form (PDF)
- Project Tech Stack
- Form Builder Save & Styles
- Checklist Form Renderer
- Sub-Unit Masterlist
- Checklist Defaults & Properties
- Checklist Schema & Migrations
- Form Builder Canvas
- Form Draft Persistence
- Sub-Category Masterlist
- Service Provider Masterlist
- Sample User/Role Tables
- Role Permission Checkboxes
- Navigation Data & Route Guards
- Channel Approver Setup
- Concern Category Masterlist
- Sites Masterlist
- Receiver Concern (V2)
- Field Types & Palette
- Department & Channel Setup
- Location Masterlist
- PMS Type Masterlist
- Receiver Setup
- Overview Dashboard
- Notification Context
- Approver Setup Dialog
- New Approver Handlers
- Receiver Channel Setup
- Roles Management
- Unit Masterlist
- PMS Type Dialog
- locationApi
- sample
- ticketingSlice
- dayjs
- @dnd-kit/core
- @dnd-kit/utilities
- @emotion/react
- @emotion/styled
- exceljs
- file-saver
- @fullcalendar/core
- @fullcalendar/daygrid
- @fullcalendar/interaction
- @fullcalendar/list
- @fullcalendar/react
- @hookform/resolvers
- lodash.debounce
- lottie-react
- @microsoft/signalr
- moment
- @mui/icons-material
- @mui/material
- @mui/x-data-grid
- notistack
- pdf-lib
- @pdf-lib/fontkit
- query-string
- react-beautiful-dnd
- react-big-calendar
- react-chartjs-2
- react-dnd
- react-dnd-html5-backend
- react-dom
- react-hook-form
- react-icons
- react-lottie-player
- react-phone-number-input
- react-redux
- react-router-dom
- react-scripts
- react-sortable
- react-sortablejs
- react-to-print
- recharts
- redux
- @reduxjs/toolkit
- sonner
- sortablejs
- sweetalert2
- @testing-library/jest-dom
- @testing-library/react
- @tiptap/extension-highlight
- @tiptap/extension-placeholder
- @tiptap/extension-text-style
- @tiptap/extension-underline
- @tiptap/pm
- @tiptap/react
- @tiptap/starter-kit
- yup
- { useLazyGetViewAttachmentQuery, useLazyGetDownloadAttachmentQuery }
- { useGetApproverQuery, useLazyGetSubUnitListQuery, useLazyGetApproverListQuery, useCreateEditApproverMutation, useArchiveApproverMutation }
- {
  useGetChannelsQuery,
  useLazyGetChannelsQuery,
  useLazyGetOnlyIssueHandlerQuery,
  useCreateChannelMutation,
  useCreateChannelValidationMutation,
  useUpdateChannelMutation,
  useArchiveChannelMutation,
  useLazyGetChannelMembersQuery,
  useCreateChannelMemberMutation,
}
- { useGetReceiverQuery, useLazyGetReceiverListQuery, useLazyGetReceiverBusinessListQuery, useCreateEditReceiverMutation, useArchiveReceiverMutation }
- { useGetBusinessUnitQuery, useLazyGetBusinessUnitQuery }
- { useGetCategoryQuery, useLazyGetCategoryQuery, useCreateEditCategoryMutation, useArchiveCategoryMutation }
- { useGetCategoryConcernQuery, useLazyGetCategoryConcernQuery, useCreateEditCategoryConcernMutation, useArchiveCategoryConcernMutation }
- { useGetChecklistsQuery, useAddEditChecklistMutation, useSaveChecklistFormMutation, useArchiveChecklistMutation }
- { useGetCompanyQuery, useLazyGetCompanyQuery }
- { useGetDepartmentQuery, useLazyGetDepartmentQuery, useLazyGetOneChargingDepartmentQuery, useSyncDepartmentMutation }
- { useGetLocationQuery, useSyncLocationMutation, useLazyGetLocationQuery, useLazyGetLocationWithPaginationQuery }
- { useGetApproverSetupQuery, useCreateEditApproverSetupMutation, useLazyGetAllApproversQuery, useLazyGetAllIssueHandlersQuery }
- { useGetOneChargingQuery, useSyncOneChargingMutation, useLazyGetOneChargingQuery }
- { useGetPmsTypeQuery, useLazyGetActivePmsTypeQuery, useAddEditPmsTypeMutation, useArchivePmsTypeMutation }
- {
  useGetServiceProviderQuery,
  useLazyGetServiceProviderQuery,
  useLazyGetServiceProviderWithParamsQuery,
  useCreateEditServiceProviderMutation,
  useServiceProviderValidationMutation,
  useArchiveServiceProviderMutation,
}
- { useGetSitesQuery, useLazyGetActiveSitesQuery, useAddEditSitesMutation, useArchiveSitesMutation }
- { useGetSubCategoryQuery, useLazyGetSubCategoryQuery, useLazyGetSubCategoryArrayQuery, useCreateEditSubCategoryMutation, useArchiveSubCategoryMutation }
- { useGetSubUnitQuery, useLazyGetSubUnitQuery, useSyncSubUnitMutation, useCreateEditSubUnitMutation, useArchiveSubUnitMutation }
- { useGetUnitQuery, useSyncUnitMutation, useLazyGetUnitQuery }
- { useGetNotificationMessageQuery, useGetNotificationNavMutation }
- { useGetPmsCalendarQuery, useReschedulePmsMutation }
- {
  useGetAllTicketsQuery,
  useGetOpenTicketsQuery,
  useGetClosedTicketsQuery,
  useGetClosedTicketsTargetQuery,
  useGetTransferredTicketsQuery,
  useGetOnHoldTicketsQuery,
  useGetSlaTicketsQuery,
  useGetMisClosedTicketsQuery,
  useGetSadSlaTicketsQuery,

  useLazyGetDownloadAllTicketsQuery,
  useLazyGetDownloadOpenTicketsQuery,
  useLazyGetDownloadClosedTicketsQuery,
  useLazyGetDownloadClosedTicketsTargetQuery,
  useLazyGetDownloadTransferredTicketsQuery,
  useLazyGetDownloadOnHoldTicketsQuery,
  useLazyGetDownloadSlaTicketsQuery,
  useLazyGetDownloadMisClosedTicketsQuery,
  useLazyGetDownloadSadSlaTicketsQuery,
}
- {
  useGetRequestorConcernsQuery,
  useLazyGetBackjobTicketsQuery,
  useLazyGetTechniciansQuery,
  useCreateEditRequestorConcernMutation,
  useEditRequestorConcernMutation,
  useTakeCherryPickTicketMutation,
  useLazyGetRequestorAttachmentQuery,
  useGetRequestorAttachmentQuery,
  useDeleteRequestorAttachmentMutation,
  useConfirmConcernMutation,
  useCancelConcernMutation,
  useReturnConcernMutation,
}
- {
  useGetReceiverConcernsQuery,
  useCreateEditReceiverConcernMutation,
  useLazyGetReceiverAttachmentQuery,
  useApproveReceiverConcernMutation,
  useLazyGetFilteredDepartmentQuery,
  useLazyGetFilteredLocationQuery,
}
- {
  useGetTargetApprovalQuery,
  useApproveTargetMutation,
  useDisapproveTargetMutation,
  useGetTicketApprovalQuery,
  useApproveTicketMutation,
  useDisapproveTicketMutation,
  useGetTransferApprovalQuery,
  useApproveTransferMutation,
  useRejectTransferMutation,
  useGetOnHoldApprovalQuery,
  useApproveOnHoldMutation,
  useRejectOnHoldMutation,
}
- { useGetViewOpenTicketsApproverQuery, useGetViewDelayedTicketsApproverQuery, useGetViewHoldTicketsApproverQuery }
- {
  useGetIssueHandlerConcernsQuery,
  useGetTicketHistoryQuery,
  useLazyGetForTransferUsersQuery,
  useHoldIssueHandlerTicketsMutation,
  useResumeIssueHandlerTicketsMutation,
  useCloseIssueHandlerTicketsMutation,
  useCancelClosingIssueHandlerTicketsMutation,
  useTransferIssueHandlerTicketsMutation,
  useApproveTransferTicketMutation,
  useCancelTransferTicketMutation,
  useRejectTransferTicketMutation,
}
- { useGetClosingTicketsQuery, useCloseTicketMutation, useRejectTicketMutation }
- { useSendSmsNotificationMutation }
- { useLazyGetRolesQuery, useGetRolesQuery, useCreateRoleMutation, useUpdateRoleNameMutation, useUpdateRolePermissionMutation, useArchiveRoleMutation }
- {
  useGetUsersQuery,
  useGetPendingUsersQuery,
  useLazyGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useResetUserPasswordMutation,
  useArchiveUserMutation,
  useChangeUserPasswordMutation,
}
- { useLazyGetCompaniesQuery, useLazyGetBusinessUnitsQuery, useLazyGetDepartmentsQuery, useLazyGetUnitsQuery, useLazyGetSubUnitsQuery, useLazyGetLocationsQuery }

## God Nodes (most connected - your core abstractions)
1. `useDisclosure()` - 187 edges
2. `theme` - 99 edges
3. `useDebounce()` - 61 edges
4. `api` - 36 edges
5. `notificationApi` - 31 edges
6. `getAttachmentIcon()` - 27 edges
7. `notificationMessageApi` - 26 edges
8. `masterlistStyles` - 20 edges
9. `useSignalRConnection()` - 10 edges
10. `FormBuilder()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `MIS Service Report Final v1` --semantically_similar_to--> `MIS Service Report (Original)`  [INFERRED] [semantically similar]
  src/pdf/MIS_SRFinal_v1.pdf → public/pdf/MIS_ServiceReport.pdf
- `MIS-Helpdesk HTML Entry Point` --conceptually_related_to--> `MIS-Helpdesk`  [INFERRED]
  public/index.html → README.md
- `IssueHandlerClosingDialog()` --references--> `moment`  [EXTRACTED]
  src/pages/Tickets/IssueHandlerConcerns/IssueHandlerClosingDialog.jsx → package.json
- `ManageTicketDialog()` --references--> `moment`  [EXTRACTED]
  src/pages/Tickets/IssueHandlerConcerns/ManageTicketDialog.jsx → package.json
- `Root Div` --conceptually_related_to--> `React JS`  [INFERRED]
  public/index.html → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **MIS-Helpdesk Tech Stack** — readme_react, readme_redux_toolkit, readme_signalr, readme_material_ui [EXTRACTED 1.00]
- **MIS Service Report Form Version Family** — public_pdf_mis_servicereport, src_pdf_mis_srfinal_v1, src_pdf_mis_srfinal_v2, src_pdf_mis_srfinal_v3, src_pdf_mis_srfinal_v4, src_pdf_mis_servicereport_nav1 [INFERRED 0.85]
- **MIS Service Report Core Form Sections** — public_pdf_mis_servicereport_job_order, public_pdf_mis_servicereport_category, public_pdf_mis_servicereport_activity, public_pdf_mis_servicereport_category_system, public_pdf_mis_servicereport_signatories [INFERRED 0.75]

## Communities (145 total, 91 thin omitted)

### Community 0 - "Ticket Dialog Menu Actions"
Cohesion: 0.08
Nodes (27): useDisclosure(), ForTransferDialogMenuActions(), OnHoldApprovalMenuActions(), TargetApprovalMenuActions(), TicketApprovalMenuActions(), ApproverActions(), ApproverChannels(), ChannelMembers() (+19 more)

### Community 1 - "PMS Params & Data Export"
Cohesion: 0.07
Nodes (32): xlsx, checklistData, data, details, storeListData, pmsCalendarParams, tags, pmsReminderParamsApi (+24 more)

### Community 2 - "App Shell & Context Providers"
Cohesion: 0.06
Nodes (26): App(), router, store, inputSx, SelectOptionsSource(), OPTION_SOURCE_GROUPS, OPTION_SOURCE_MAP, OPTION_SOURCES (+18 more)

### Community 3 - "Approval Workflow & Notifications"
Cohesion: 0.13
Nodes (25): notificationMessageApi, tags, notificationApi, tags, { useGetNotificationQuery }, tags, ForTransfer(), DisapprovedOnHoldDialog() (+17 more)

### Community 4 - "Masterlist Tables & Dialogs"
Cohesion: 0.09
Nodes (30): useDebounce(), ViewTicketsPage(), Approver(), ChecklistManagementPage(), Business(), TABLE_COLUMNS, Category(), STATUS_TABS (+22 more)

### Community 5 - "Approver Ticket Views & SignalR"
Cohesion: 0.11
Nodes (19): useSignalRConnection(), ClosingTicketHistory(), ViewClosingDialog(), ApproverCloseTicket(), ApproverHoldTicket(), ApproverOpenTicket(), CloseDisappprove(), schema (+11 more)

### Community 6 - "Concern & Issue Handler Dialogs"
Cohesion: 0.13
Nodes (22): categoryApi, tags, subCategoryApi, tags, tags, ConcernDialog(), ConcernMenuActions(), ConcernViewDialog() (+14 more)

### Community 7 - "Routing & Page Entry Points"
Cohesion: 0.11
Nodes (15): AuthRedirect(), Approval(), ApproverPage(), ChangePassword(), Channel(), ChannelActions(), Login(), MasterlistPage() (+7 more)

### Community 8 - "Auth & Ticketing State"
Cohesion: 0.15
Nodes (14): changePasswordSchema, concernApi, concernReceiverApi, tags, ticketApprovalApi, concernIssueHandlerApi, tags, closingTicketApi (+6 more)

### Community 9 - "Checklist Management"
Cohesion: 0.17
Nodes (11): RichTextEditor(), checklistManagementApi, tags, ChecklistCards(), ChecklistCardSkeleton(), CreateNewChecklistDialog(), schema, CreateCard() (+3 more)

### Community 10 - "Reports & Ticket History"
Cohesion: 0.16
Nodes (12): reportsApi, tags, AllTicketsHistory(), CloseTicketsHistory(), CloseTicketTarget(), MisClosedTickets(), OnHoldTicketsHistory(), OpenTicketsHistory() (+4 more)

### Community 11 - "Package Config & Browserslist"
Cohesion: 0.09
Nodes (21): browserslist, development, production, eslintConfig, extends, name, private, scripts (+13 more)

### Community 12 - "Sidebar & Navigation UI"
Cohesion: 0.14
Nodes (13): react, react, getMenuIcon(), getSubMenuIcon(), Header(), MainContent(), CollapsedGroup(), Sidebar() (+5 more)

### Community 13 - "User Management APIs & Dialogs"
Cohesion: 0.12
Nodes (13): businessUnitApi, tags, companyApi, tags, oneChargingApi, tags, roleApi, tags (+5 more)

### Community 14 - "Transfer & Hold Ticket Dialogs"
Cohesion: 0.13
Nodes (13): attachmentsApi, tags, channelApi, tags, schema, TransferApprovalDialog(), DisapproveSelectedDialog(), schema (+5 more)

### Community 15 - "Masterlist APIs & Login Slice"
Cohesion: 0.13
Nodes (13): categoryConcernApi, tags, pmsTypeApi, tags, serviceProviderApi, tags, sitesApi, tags (+5 more)

### Community 16 - "NPM Dependencies"
Cohesion: 0.12
Nodes (17): crypto-js, @dnd-kit/sortable, @mui/lab, @mui/x-date-pickers, dependencies, crypto-js, @dnd-kit/sortable, @mui/lab (+9 more)

### Community 17 - "MIS Service Report Form (PDF)"
Cohesion: 0.13
Nodes (17): MIS Service Report (Original), Activity Section, Category Section, Category System Field, Issue Description Section, Job Order Section, Resolution / Remarks Section, Signatories Section (Prepared/Received/Closed by) (+9 more)

### Community 18 - "Project Tech Stack"
Cohesion: 0.14
Nodes (15): MIS-Helpdesk HTML Entry Point, Root Div, Data Fetching & Caching, Material UI, MIS-Helpdesk, Moment.js, React JS, React Hook Form (+7 more)

### Community 19 - "Form Builder Save & Styles"
Cohesion: 0.15
Nodes (11): BuilderTopBar(), SaveFormDialog(), saveSchema, C, dialogInput, formBuilderStyles, panelInput, pickerPopperSx (+3 more)

### Community 20 - "Checklist Form Renderer"
Cohesion: 0.16
Nodes (7): isColumnRequired(), ChecklistRender(), FormRenderer(), RENDERERS, TextRender(), formRendererStyles, pickerSlotProps()

### Community 21 - "Sub-Unit Masterlist"
Cohesion: 0.22
Nodes (8): subUnitApi, tags, SubActions(), STATUS_TABS, TABLE_COLUMNS, schema, SubUnitAddDialog(), SubUnitErrorDialog()

### Community 22 - "Checklist Defaults & Properties"
Cohesion: 0.26
Nodes (7): COLUMN_TYPES, defaultChecklistColumns(), hasStatusColumn(), newColId(), REQUIRE_WHEN, PropertiesPanel(), propertiesPanelStyles

### Community 23 - "Checklist Schema & Migrations"
Cohesion: 0.29
Nodes (10): deserialize(), deserializeField(), exprToRequireWhen(), fieldValidation(), migrate(), MIGRATIONS, normalizeChecklistColumns(), requireWhenToExpr() (+2 more)

### Community 24 - "Form Builder Canvas"
Cohesion: 0.22
Nodes (7): getChecklistColumns(), ADVANCED_TYPES, CanvasField(), ChecklistPreview(), FormCanvas(), canvasFieldStyles, formCanvasStyles

### Community 25 - "Form Draft Persistence"
Cohesion: 0.42
Nodes (8): clearDraft(), getMaxId(), getNewFormSessionKey(), hasDraft(), readDraft(), writeDraft(), FormBuilder(), serialize()

### Community 26 - "Sub-Category Masterlist"
Cohesion: 0.25
Nodes (7): sweetAlertDialog(), STATUS_TABS, SubCategory(), TABLE_COLUMNS, SubCategoryActions(), schema, SubCategoryDialog()

### Community 27 - "Service Provider Masterlist"
Cohesion: 0.24
Nodes (7): ListOfChannels(), ServiceProvider(), STATUS_TABS, TABLE_COLUMNS, ServiceProviderActions(), schema, ServiceProviderDialog()

### Community 28 - "Sample User/Role Tables"
Cohesion: 0.20
Nodes (5): ACCOUNT_COLUMNS, accountSchema, ALL_PERMISSIONS, ROLE_COLUMNS, roleSchema

### Community 29 - "Role Permission Checkboxes"
Cohesion: 0.20
Nodes (9): approverCheckbox, masterlistCheckbox, parentCheckbox, receiverCheckbox, requestCheckbox, RoleAddDialog(), schema, ticketingCheckbox (+1 more)

### Community 30 - "Navigation Data & Route Guards"
Cohesion: 0.31
Nodes (5): sidebarNavigationData, PermittedRoutes(), PageNotFound(), StyledBox, Private()

### Community 31 - "Channel Approver Setup"
Cohesion: 0.22
Nodes (5): approverApi, tags, ApproverDialog(), approverSchema, subUnitSchema

### Community 32 - "Concern Category Masterlist"
Cohesion: 0.28
Nodes (6): CategoryConcern(), STATUS_TABS, TABLE_COLUMNS, CategoryConcernActions(), CategoryConcernDialog(), schema

### Community 33 - "Sites Masterlist"
Cohesion: 0.28
Nodes (6): SiteActions(), schema, SiteDialog(), Sites(), STATUS_TABS, TABLE_COLUMNS

### Community 34 - "Receiver Concern (V2)"
Cohesion: 0.31
Nodes (6): ReceiverAddTicketDialog(), AssignTicketDrawer(), MenuActions(), NewReceiverConcern(), requestorSchema, ViewConcernDetails()

### Community 35 - "Field Types & Palette"
Cohesion: 0.29
Nodes (5): FIELD_GROUPS, FIELD_TYPE_MAP, TYPE_CHIP_LABEL, FieldPalette(), fieldPaletteStyles

### Community 36 - "Department & Channel Setup"
Cohesion: 0.25
Nodes (5): departmentApi, tags, ChannelDialog(), schema, DepartmentErrorDialog()

### Community 37 - "Location Masterlist"
Cohesion: 0.32
Nodes (5): Location(), TABLE_COLUMNS, LocationErrorDialog(), LocationSubUnitError(), LocationSubUnit()

### Community 38 - "PMS Type Masterlist"
Cohesion: 0.32
Nodes (6): CONFIRM_DIALOG_THEME, loadingButtonHtml(), PmsType(), STATUS_TABS, TABLE_COLUMNS, PmsTypeActions()

### Community 39 - "Receiver Setup"
Cohesion: 0.29
Nodes (5): receiverApi, tags, businessUnitSchema, ReceiverDialog(), schema

### Community 40 - "Overview Dashboard"
Cohesion: 0.29
Nodes (4): overviewApi, tags, { useGetOverviewQuery }, Overview()

### Community 41 - "Notification Context"
Cohesion: 0.40
Nodes (3): NotificationContext, useNotification(), CloseTicketsTab()

### Community 42 - "Approver Setup Dialog"
Cohesion: 0.33
Nodes (4): approverSetupApi, tags, ApproverSetupDialog(), schema

### Community 43 - "New Approver Handlers"
Cohesion: 0.47
Nodes (3): ApproverSetupActions(), NewApprover(), NewApproverHandlers()

### Community 44 - "Receiver Channel Setup"
Cohesion: 0.47
Nodes (3): Receiver(), ReceiverActions(), ReceiverBusinessUnit()

### Community 45 - "Roles Management"
Cohesion: 0.47
Nodes (3): RoleAction(), RolePermissions(), Roles()

### Community 46 - "Unit Masterlist"
Cohesion: 0.40
Nodes (3): tags, unitApi, UnitErrorDialog()

### Community 47 - "PMS Type Dialog"
Cohesion: 0.50
Nodes (3): PmsTypeDialog(), schema, pmsTypeStyles

## Knowledge Gaps
- **298 isolated node(s):** `name`, `version`, `private`, `@dnd-kit/core`, `@dnd-kit/sortable` (+293 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **91 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useDisclosure()` connect `Ticket Dialog Menu Actions` to `PMS Params & Data Export`, `Approval Workflow & Notifications`, `Masterlist Tables & Dialogs`, `Approver Ticket Views & SignalR`, `Concern & Issue Handler Dialogs`, `Routing & Page Entry Points`, `Auth & Ticketing State`, `Checklist Management`, `Sidebar & Navigation UI`, `User Management APIs & Dialogs`, `Transfer & Hold Ticket Dialogs`, `Sub-Unit Masterlist`, `Sub-Category Masterlist`, `Service Provider Masterlist`, `Concern Category Masterlist`, `Sites Masterlist`, `Receiver Concern (V2)`, `Location Masterlist`, `PMS Type Masterlist`, `Notification Context`, `New Approver Handlers`, `Receiver Channel Setup`, `Roles Management`?**
  _High betweenness centrality (0.277) - this node is a cross-community bridge._
- **Why does `dependencies` connect `NPM Dependencies` to `PMS Params & Data Export`, `Package Config & Browserslist`, `Sidebar & Navigation UI`, `dayjs`, `@dnd-kit/core`, `@dnd-kit/utilities`, `@emotion/react`, `@emotion/styled`, `exceljs`, `file-saver`, `@fullcalendar/core`, `@fullcalendar/daygrid`, `@fullcalendar/interaction`, `@fullcalendar/list`, `@fullcalendar/react`, `@hookform/resolvers`, `lodash.debounce`, `lottie-react`, `@microsoft/signalr`, `moment`, `@mui/icons-material`, `@mui/material`, `@mui/x-data-grid`, `notistack`, `pdf-lib`, `@pdf-lib/fontkit`, `query-string`, `react-beautiful-dnd`, `react-big-calendar`, `react-chartjs-2`, `react-dnd`, `react-dnd-html5-backend`, `react-dom`, `react-hook-form`, `react-icons`, `react-lottie-player`, `react-phone-number-input`, `react-redux`, `react-router-dom`, `react-scripts`, `react-sortable`, `react-sortablejs`, `react-to-print`, `recharts`, `redux`, `@reduxjs/toolkit`, `sonner`, `sortablejs`, `sweetalert2`, `@testing-library/jest-dom`, `@testing-library/react`, `@tiptap/extension-highlight`, `@tiptap/extension-placeholder`, `@tiptap/extension-text-style`, `@tiptap/extension-underline`, `@tiptap/pm`, `@tiptap/react`, `@tiptap/starter-kit`, `yup`?**
  _High betweenness centrality (0.249) - this node is a cross-community bridge._
- **Why does `Header()` connect `Sidebar & Navigation UI` to `Auth & Ticketing State`, `Ticket Dialog Menu Actions`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _298 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Ticket Dialog Menu Actions` be split into smaller, more focused modules?**
  _Cohesion score 0.07966457023060797 - nodes in this community are weakly interconnected._
- **Should `PMS Params & Data Export` be split into smaller, more focused modules?**
  _Cohesion score 0.06748911465892599 - nodes in this community are weakly interconnected._
- **Should `App Shell & Context Providers` be split into smaller, more focused modules?**
  _Cohesion score 0.06155632984901278 - nodes in this community are weakly interconnected._