# Graph Report - .  (2026-08-26)

## Corpus Check
- 320 files · ~315,380 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 996 nodes · 2349 edges · 160 communities (54 shown, 106 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.72)
- Token cost: 65,477 input · 0 output

## Community Hubs (Navigation)
- Auth & Route Guarding
- PMS Reminder Calendar
- Notification API Layer
- Ticket Transfer/Hold Actions
- Closing Ticket History (SignalR)
- App Bootstrap & Store
- Concern & Attachments API
- Header & Password Change
- Channel & Category API
- Checklist Rich Text Editor
- Ticket Reports API
- Package Config & Tooling
- Sidebar Menu Icons
- Checklist Field Options UI
- Receiver & Category Concern API
- Approver Ticket Menu Actions
- Form Builder Canvas
- MIS Service Report Sections
- Notification Context Provider
- Third-Party Deps (crypto/dnd)
- Helpdesk HTML Entry Point
- Checklist Field Type Config
- Business/Category Table Views
- Checklist Form Renderer
- Store List Data Index
- Category Management Dialog
- Approver Management
- Department/OneCharging API
- Checklist Schema Validation
- Business Unit & User API
- Ymir Location/Unit Management
- Checklist Form Draft Storage
- Receiver Management UI
- Reusable Table Sample
- Role Permission Checkboxes
- SweetAlert & SubCategory UI
- For-Transfer Ticket Dialogs
- Service Provider Management
- Sub-Unit Management
- Receiver Ticket Assignment
- Site Management Dialog
- Approver Setup
- Role & Permissions Management
- User Account Management
- Bundled Font Licenses
- Concern Return/Tickets UI
- Department Management
- PMS Schedule Add Form
- Company API
- Location API
- Service Provider API
- Sub-Unit API
- Unit API
- Overview API
- PMS Calendar API
- Login Auth Slice
- Checklist Management Params
- Location Error Dialogs
- Ticketing Redux Slice
- dayjs Dependency
- dnd-kit Sortable Dependency
- Emotion React Dependency
- Emotion Styled Dependency
- Excel Export Dependency
- File Saver Dependency
- FullCalendar Core Dependency
- FullCalendar Day Grid Dependency
- FullCalendar Interaction Dependency
- FullCalendar List Dependency
- FullCalendar React Dependency
- Hook Form Resolvers Dependency
- Lodash Debounce Dependency
- Lottie React Dependency
- SignalR Client Dependency
- MUI Icons Dependency
- MUI Lab Dependency
- MUI Material Dependency
- MUI Data Grid Dependency
- MUI Date Pickers Dependency
- Notistack Dependency
- PDF-lib Dependency
- PDF-lib Fontkit Dependency
- Query String Dependency
- React Beautiful DnD Dependency
- React Big Calendar Dependency
- React ChartJS Dependency
- React DnD Dependency
- React DnD HTML5 Backend
- React DOM Dependency
- React Dropzone Dependency
- React Hook Form Dependency
- React Icons Dependency
- React Lottie Player Dependency
- React Phone Input Dependency
- React Redux Dependency
- React Router DOM Dependency
- React Scripts Dependency
- React Sortable Dependency
- React SortableJS Dependency
- Redux Dependency
- Redux Toolkit Dependency
- Sonner Toast Dependency
- SortableJS Dependency
- SweetAlert2 Dependency
- Swiper Dependency
- Testing Library Jest-DOM
- Testing Library User Event
- Tiptap Highlight Extension
- Tiptap Placeholder Extension
- Tiptap Text Style Extension
- Tiptap Underline Extension
- Tiptap ProseMirror Dependency
- Tiptap React Dependency
- Tiptap Starter Kit Dependency
- Web Vitals Dependency
- Category Actions Menu
- Category Concern Actions Menu
- Site Actions Menu
- Concern View Menu Actions
- Issue Handler Concern Actions
- View Ticket Menu Actions
- Attachment Download Queries
- Approver Query Hooks
- Channel Query Hooks
- Receiver Query Hooks
- Business Unit Query Hooks
- Category Query Hooks
- Category Concern Query Hooks
- Checklist Query Hooks
- Company Query Hooks
- Department Query Hooks
- Location Query Hooks
- Approver Setup Query Hooks
- One-Charging Query Hooks
- PMS Type Query Hooks
- Service Provider Query Hooks
- Sites Query Hooks
- Sub-Category Query Hooks
- Sub-Unit Query Hooks
- Unit Query Hooks
- Notification Message Query Hooks
- PMS Calendar Query Hooks
- Ticket Reports Query Hooks
- Requestor Concern Query Hooks
- Receiver Concern Query Hooks
- Ticket Approval Query Hooks
- Approver Ticket View Queries
- Issue Handler Ticket Queries
- Closing Ticket Query Hooks
- SMS Notification Mutation
- Role Management Query Hooks
- User Account Query Hooks
- Masterlist Lazy Query Hooks

## God Nodes (most connected - your core abstractions)
1. `useDisclosure()` - 187 edges
2. `theme` - 99 edges
3. `useDebounce()` - 61 edges
4. `api` - 36 edges
5. `notificationApi` - 31 edges
6. `getAttachmentIcon()` - 27 edges
7. `notificationMessageApi` - 26 edges
8. `masterlistStyles` - 22 edges
9. `useSignalRConnection()` - 10 edges
10. `FormBuilder()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `MIS Service Report Final v1` --semantically_similar_to--> `MIS Service Report (Original)`  [INFERRED] [semantically similar]
  src/pdf/MIS_SRFinal_v1.pdf → public/pdf/MIS_ServiceReport.pdf
- `MIS-Helpdesk HTML Entry Point` --conceptually_related_to--> `MIS-Helpdesk`  [INFERRED]
  public/index.html → README.md
- `ManageTicketDialog()` --references--> `moment`  [EXTRACTED]
  src/pages/Tickets/IssueHandlerConcerns/ManageTicketDialog.jsx → package.json
- `Root Div` --conceptually_related_to--> `React JS`  [INFERRED]
  public/index.html → README.md
- `N/A Category System Option` --conceptually_related_to--> `Category System Field`  [INFERRED]
  src/pdf/MIS_ServiceReport_NAv1.pdf → public/pdf/MIS_ServiceReport.pdf

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **MIS-Helpdesk Tech Stack** — readme_react, readme_redux_toolkit, readme_signalr, readme_material_ui [EXTRACTED 1.00]
- **MIS Service Report Core Form Sections** — public_pdf_mis_servicereport_job_order, public_pdf_mis_servicereport_category, public_pdf_mis_servicereport_activity, public_pdf_mis_servicereport_category_system, public_pdf_mis_servicereport_signatories [INFERRED 0.75]
- **MIS Service Report Form Version Family** — public_pdf_mis_servicereport, src_pdf_mis_srfinal_v1, src_pdf_mis_srfinal_v2, src_pdf_mis_srfinal_v3, src_pdf_mis_srfinal_v4, src_pdf_mis_servicereport_nav1 [INFERRED 0.85]
- **Plus Jakarta Sans Font Licensing** — src_assets_font_plus_jakarta_sans_readme_plus_jakarta_sans_font, src_assets_font_plus_jakarta_sans_ofl_sil_open_font_license, src_assets_font_plus_jakarta_sans_ofl_plus_jakarta_sans_project_authors [EXTRACTED 1.00]
- **Bundled Font Assets & Open Licensing Pattern** — src_assets_font_plus_jakarta_sans_readme_plus_jakarta_sans_font, src_assets_font_roboto_license_roboto_font, src_assets_font_plus_jakarta_sans_ofl_sil_open_font_license, src_assets_font_roboto_license_apache_license_2_0 [INFERRED 0.75]

## Communities (160 total, 106 thin omitted)

### Community 0 - "Auth & Route Guarding"
Cohesion: 0.06
Nodes (30): AuthRedirect(), sidebarNavigationData, PermittedRoutes(), PageNotFound(), StyledBox, Private(), pmsTypeApi, tags (+22 more)

### Community 1 - "PMS Reminder Calendar"
Cohesion: 0.09
Nodes (24): xlsx, pmsReminderParamsApi, { useGetPmsReminderQuery }, DEFAULT_PARAMS, usePmsCalendarParams(), DEFAULT_PARAMS, usePmsReminderParams(), Pms() (+16 more)

### Community 2 - "Notification API Layer"
Cohesion: 0.15
Nodes (23): notificationMessageApi, tags, notificationApi, tags, tags, DisapprovedOnHoldDialog(), DisapproveSelectedDialog(), schema (+15 more)

### Community 3 - "Ticket Transfer/Hold Actions"
Cohesion: 0.09
Nodes (17): useDisclosure(), ForTransferDialogMenuActions(), OnHoldApprovalMenuActions(), Channel(), ChannelActions(), ChecklistCardActions(), LocationSubUnit(), SubCategoryActions() (+9 more)

### Community 4 - "Closing Ticket History (SignalR)"
Cohesion: 0.11
Nodes (16): useSignalRConnection(), ClosingTicketHistory(), ApproverCloseTicket(), ApproverHoldTicket(), ApproverOpenTicket(), ViewTicketsPage(), ApproverSetupDialog(), schema (+8 more)

### Community 5 - "App Bootstrap & Store"
Cohesion: 0.08
Nodes (19): App(), router, store, ParameterContext, ParameterProvider(), SignalRContext, SignalRProvider(), useSignalR() (+11 more)

### Community 6 - "Concern & Attachments API"
Cohesion: 0.13
Nodes (17): moment, moment, attachmentsApi, tags, tags, IssueHandlerClosingDialog(), schema, IssueHandlerHoldDialog() (+9 more)

### Community 7 - "Header & Password Change"
Cohesion: 0.16
Nodes (15): changePasswordSchema, concernApi, concernReceiverApi, tags, ticketApprovalApi, concernIssueHandlerApi, tags, closingTicketApi (+7 more)

### Community 8 - "Channel & Category API"
Cohesion: 0.15
Nodes (15): channelApi, tags, categoryApi, tags, subCategoryApi, tags, ConcernDialog(), ConcernMenuActions() (+7 more)

### Community 9 - "Checklist Rich Text Editor"
Cohesion: 0.16
Nodes (12): RichTextEditor(), checklistManagementApi, tags, ChecklistCards(), ChecklistCardSkeleton(), CreateNewChecklistDialog(), schema, ChecklistManagementPage() (+4 more)

### Community 10 - "Ticket Reports API"
Cohesion: 0.16
Nodes (12): reportsApi, tags, AllTicketsHistory(), CloseTicketsHistory(), CloseTicketTarget(), MisClosedTickets(), OnHoldTicketsHistory(), OpenTicketsHistory() (+4 more)

### Community 11 - "Package Config & Tooling"
Cohesion: 0.09
Nodes (21): browserslist, development, production, eslintConfig, extends, name, private, scripts (+13 more)

### Community 12 - "Sidebar Menu Icons"
Cohesion: 0.14
Nodes (13): react, react, getMenuIcon(), getSubMenuIcon(), Header(), MainContent(), CollapsedGroup(), Sidebar() (+5 more)

### Community 13 - "Checklist Field Options UI"
Cohesion: 0.14
Nodes (12): inputSx, SelectOptionsSource(), COLUMN_TYPES, defaultChecklistColumns(), hasStatusColumn(), newColId(), REQUIRE_WHEN, OPTION_SOURCE_GROUPS (+4 more)

### Community 14 - "Receiver & Category Concern API"
Cohesion: 0.14
Nodes (12): receiverApi, tags, categoryConcernApi, tags, approverSetupApi, tags, sitesApi, tags (+4 more)

### Community 15 - "Approver Ticket Menu Actions"
Cohesion: 0.11
Nodes (9): TargetApprovalMenuActions(), TicketApprovalMenuActions(), ApproverChannels(), ChannelMembers(), CategorySubCat(), PmsTypeActions(), ListOfChannels(), ManageForClosingMenuActions() (+1 more)

### Community 16 - "Form Builder Canvas"
Cohesion: 0.12
Nodes (14): BuilderTopBar(), CanvasField(), FormCanvas(), SaveFormDialog(), saveSchema, C, dialogInput, formBuilderStyles (+6 more)

### Community 17 - "MIS Service Report Sections"
Cohesion: 0.13
Nodes (17): MIS Service Report (Original), Activity Section, Category Section, Category System Field, Issue Description Section, Job Order Section, Resolution / Remarks Section, Signatories Section (Prepared/Received/Closed by) (+9 more)

### Community 18 - "Notification Context Provider"
Cohesion: 0.17
Nodes (9): NotificationContext, useNotification(), tags, ViewClosingDialog(), CloseDisappprove(), schema, CloseTicketsTab(), ClosingTicketActions() (+1 more)

### Community 19 - "Third-Party Deps (crypto/dnd)"
Cohesion: 0.13
Nodes (15): crypto-js, @dnd-kit/core, @dnd-kit/utilities, dependencies, crypto-js, @dnd-kit/core, @dnd-kit/utilities, react-to-print (+7 more)

### Community 20 - "Helpdesk HTML Entry Point"
Cohesion: 0.14
Nodes (15): MIS-Helpdesk HTML Entry Point, Root Div, Data Fetching & Caching, Material UI, MIS-Helpdesk, Moment.js, React JS, React Hook Form (+7 more)

### Community 21 - "Checklist Field Type Config"
Cohesion: 0.16
Nodes (9): getChecklistColumns(), FIELD_GROUPS, FIELD_TYPE_MAP, TYPE_CHIP_LABEL, ADVANCED_TYPES, ChecklistPreview(), FieldPalette(), canvasFieldStyles (+1 more)

### Community 22 - "Business/Category Table Views"
Cohesion: 0.21
Nodes (10): useDebounce(), Business(), TABLE_COLUMNS, Category(), Company(), TABLE_COLUMNS, CategoryConcern(), OneCharging() (+2 more)

### Community 23 - "Checklist Form Renderer"
Cohesion: 0.16
Nodes (7): isColumnRequired(), ChecklistRender(), FormRenderer(), RENDERERS, TextRender(), formRendererStyles, pickerSlotProps()

### Community 24 - "Store List Data Index"
Cohesion: 0.18
Nodes (11): checklistData, data, details, storeListData, CONFIRM_DIALOG_THEME, loadingButtonHtml(), STATUS_TABS, StoreList() (+3 more)

### Community 25 - "Category Management Dialog"
Cohesion: 0.23
Nodes (9): STATUS_TABS, TABLE_COLUMNS, CategoryDialog(), schema, STATUS_TABS, TABLE_COLUMNS, CategoryConcernDialog(), schema (+1 more)

### Community 26 - "Approver Management"
Cohesion: 0.19
Nodes (7): approverApi, tags, Approver(), ApproverActions(), ApproverDialog(), approverSchema, subUnitSchema

### Community 27 - "Department/OneCharging API"
Cohesion: 0.17
Nodes (8): departmentApi, tags, oneChargingApi, tags, roleApi, tags, PendingAccountDialog(), PendingAccountsTab()

### Community 28 - "Checklist Schema Validation"
Cohesion: 0.27
Nodes (11): deserialize(), deserializeField(), exprToRequireWhen(), fieldValidation(), migrate(), MIGRATIONS, normalizeChecklistColumns(), requireWhenToExpr() (+3 more)

### Community 29 - "Business Unit & User API"
Cohesion: 0.22
Nodes (7): businessUnitApi, tags, { useLazyGetEmployeesQuery }, tags, userApi, UserAccountDialog(), UserAccountWarningDialog()

### Community 30 - "Ymir Location/Unit Management"
Cohesion: 0.22
Nodes (6): ymirApi, Location(), TABLE_COLUMNS, TABLE_COLUMNS, Unit(), UnitErrorDialog()

### Community 31 - "Checklist Form Draft Storage"
Cohesion: 0.47
Nodes (7): clearDraft(), getMaxId(), getNewFormSessionKey(), hasDraft(), readDraft(), writeDraft(), FormBuilder()

### Community 32 - "Receiver Management UI"
Cohesion: 0.27
Nodes (6): Receiver(), ReceiverActions(), ReceiverBusinessUnit(), businessUnitSchema, ReceiverDialog(), schema

### Community 33 - "Reusable Table Sample"
Cohesion: 0.20
Nodes (5): ACCOUNT_COLUMNS, accountSchema, ALL_PERMISSIONS, ROLE_COLUMNS, roleSchema

### Community 34 - "Role Permission Checkboxes"
Cohesion: 0.20
Nodes (9): approverCheckbox, masterlistCheckbox, parentCheckbox, receiverCheckbox, requestCheckbox, RoleAddDialog(), schema, ticketingCheckbox (+1 more)

### Community 35 - "SweetAlert & SubCategory UI"
Cohesion: 0.31
Nodes (6): sweetAlertDialog(), STATUS_TABS, SubCategory(), TABLE_COLUMNS, schema, SubCategoryDialog()

### Community 36 - "For-Transfer Ticket Dialogs"
Cohesion: 0.33
Nodes (6): ForTransfer(), schema, TransferApprovalDialog(), DisapproveSelectedDialog(), schema, TransferDisapproveDialog()

### Community 37 - "Service Provider Management"
Cohesion: 0.28
Nodes (6): ServiceProvider(), STATUS_TABS, TABLE_COLUMNS, ServiceProviderActions(), schema, ServiceProviderDialog()

### Community 38 - "Sub-Unit Management"
Cohesion: 0.28
Nodes (6): STATUS_TABS, SubUnit(), TABLE_COLUMNS, schema, SubUnitAddDialog(), SubUnitErrorDialog()

### Community 39 - "Receiver Ticket Assignment"
Cohesion: 0.31
Nodes (6): ReceiverAddTicketDialog(), AssignTicketDrawer(), MenuActions(), NewReceiverConcern(), requestorSchema, ViewConcernDetails()

### Community 40 - "Site Management Dialog"
Cohesion: 0.33
Nodes (5): schema, SiteDialog(), Sites(), STATUS_TABS, TABLE_COLUMNS

### Community 41 - "Approver Setup"
Cohesion: 0.47
Nodes (3): ApproverSetupActions(), NewApprover(), NewApproverHandlers()

### Community 42 - "Role & Permissions Management"
Cohesion: 0.47
Nodes (3): RoleAction(), RolePermissions(), Roles()

### Community 43 - "User Account Management"
Cohesion: 0.47
Nodes (3): UserAccountAction(), UserAccountPermissions(), UserAccounts()

### Community 44 - "Bundled Font Licenses"
Cohesion: 0.50
Nodes (5): Plus Jakarta Sans Project Authors, SIL Open Font License 1.1 (OFL), Plus Jakarta Sans (Variable Font), Apache License 2.0, Roboto Font

### Community 45 - "Concern Return/Tickets UI"
Cohesion: 0.50
Nodes (3): { useGetNotificationQuery }, ConcernReturn(), schema

### Community 46 - "Department Management"
Cohesion: 0.50
Nodes (3): Department(), TABLE_COLUMNS, DepartmentErrorDialog()

## Knowledge Gaps
- **300 isolated node(s):** `name`, `version`, `private`, `@dnd-kit/core`, `@dnd-kit/sortable` (+295 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **106 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useDisclosure()` connect `Ticket Transfer/Hold Actions` to `Auth & Route Guarding`, `PMS Reminder Calendar`, `Notification API Layer`, `Closing Ticket History (SignalR)`, `Concern & Attachments API`, `Header & Password Change`, `Channel & Category API`, `Checklist Rich Text Editor`, `Sidebar Menu Icons`, `Approver Ticket Menu Actions`, `Notification Context Provider`, `Business/Category Table Views`, `Store List Data Index`, `Category Management Dialog`, `Approver Management`, `Department/OneCharging API`, `Business Unit & User API`, `Ymir Location/Unit Management`, `Receiver Management UI`, `SweetAlert & SubCategory UI`, `For-Transfer Ticket Dialogs`, `Service Provider Management`, `Sub-Unit Management`, `Receiver Ticket Assignment`, `Site Management Dialog`, `Approver Setup`, `Role & Permissions Management`, `User Account Management`, `Concern Return/Tickets UI`, `Department Management`, `PMS Schedule Add Form`, `Location Error Dialogs`, `Category Actions Menu`, `Category Concern Actions Menu`, `Site Actions Menu`, `Concern View Menu Actions`, `Issue Handler Concern Actions`, `View Ticket Menu Actions`?**
  _High betweenness centrality (0.273) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Third-Party Deps (crypto/dnd)` to `PMS Reminder Calendar`, `Concern & Attachments API`, `Package Config & Tooling`, `Sidebar Menu Icons`, `dayjs Dependency`, `dnd-kit Sortable Dependency`, `Emotion React Dependency`, `Emotion Styled Dependency`, `Excel Export Dependency`, `File Saver Dependency`, `FullCalendar Core Dependency`, `FullCalendar Day Grid Dependency`, `FullCalendar Interaction Dependency`, `FullCalendar List Dependency`, `FullCalendar React Dependency`, `Hook Form Resolvers Dependency`, `Lodash Debounce Dependency`, `Lottie React Dependency`, `SignalR Client Dependency`, `MUI Icons Dependency`, `MUI Lab Dependency`, `MUI Material Dependency`, `MUI Data Grid Dependency`, `MUI Date Pickers Dependency`, `Notistack Dependency`, `PDF-lib Dependency`, `PDF-lib Fontkit Dependency`, `Query String Dependency`, `React Beautiful DnD Dependency`, `React Big Calendar Dependency`, `React ChartJS Dependency`, `React DnD Dependency`, `React DnD HTML5 Backend`, `React DOM Dependency`, `React Dropzone Dependency`, `React Hook Form Dependency`, `React Icons Dependency`, `React Lottie Player Dependency`, `React Phone Input Dependency`, `React Redux Dependency`, `React Router DOM Dependency`, `React Scripts Dependency`, `React Sortable Dependency`, `React SortableJS Dependency`, `Redux Dependency`, `Redux Toolkit Dependency`, `Sonner Toast Dependency`, `SortableJS Dependency`, `SweetAlert2 Dependency`, `Swiper Dependency`, `Testing Library Jest-DOM`, `Testing Library User Event`, `Tiptap Highlight Extension`, `Tiptap Placeholder Extension`, `Tiptap Text Style Extension`, `Tiptap Underline Extension`, `Tiptap ProseMirror Dependency`, `Tiptap React Dependency`, `Tiptap Starter Kit Dependency`, `Web Vitals Dependency`?**
  _High betweenness centrality (0.245) - this node is a cross-community bridge._
- **Why does `Header()` connect `Sidebar Menu Icons` to `Ticket Transfer/Hold Actions`, `Header & Password Change`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _300 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Auth & Route Guarding` be split into smaller, more focused modules?**
  _Cohesion score 0.05782312925170068 - nodes in this community are weakly interconnected._
- **Should `PMS Reminder Calendar` be split into smaller, more focused modules?**
  _Cohesion score 0.09487179487179487 - nodes in this community are weakly interconnected._
- **Should `Notification API Layer` be split into smaller, more focused modules?**
  _Cohesion score 0.14509246088193456 - nodes in this community are weakly interconnected._