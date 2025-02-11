export const sidebarNavigationData = [
  {
    id: 1,
    path: "/overview",
    name: "Overview",
  },
  {
    id: 2,
    path: "/user-management",
    name: "User Management",
    sub: [
      {
        id: 1,
        name: "User Account",
        path: "/user-management/user-account",
      },
      {
        id: 2,
        name: "User Role",
        path: "/user-management/user-role",
      },
    ],
  },
  {
    id: 3,
    path: "/masterlist",
    name: "Masterlist",
    sub: [
      {
        id: 1,
        name: "Company",
        path: "/masterlist/company",
      },
      {
        id: 2,
        name: "Business Unit",
        path: "/masterlist/business-unit",
      },
      {
        id: 3,
        name: "Department",
        path: "/masterlist/department",
      },
      {
        id: 4,
        name: "Unit",
        path: "/masterlist/unit",
      },
      {
        id: 5,
        name: "Sub Unit",
        path: "/masterlist/sub-unit",
      },
      {
        id: 6,
        name: "Location",
        path: "/masterlist/location",
      },
      {
        id: 7,
        name: "Category",
        path: "/masterlist/category",
      },

      {
        id: 8,
        name: "Sub Category",
        path: "/masterlist/sub-category",
      },
      {
        id: 9,
        name: "Receiver",
        path: "/masterlist/receiver-setup",
      },
      {
        id: 10,
        name: "Channel",
        path: "/masterlist/channel-setup",
      },
      {
        id: 11,
        name: "Approver",
        path: "/masterlist/approver-setup",
      },
    ],
  },
  {
    id: 4,
    path: "/requestor",
    name: "Requestor",
    sub: [
      {
        id: 1,
        name: "Requestor Concerns",
        path: "/requestor/requestor-concerns",
      },
    ],
  },
  {
    id: 5,
    path: "/receiver",
    name: "Receiver",
    sub: [
      {
        id: 1,
        name: "Receiver Concerns",
        path: "/receiver/receiver-concerns",
      },
    ],
  },
  {
    id: 6,
    path: "/approver",
    name: "Approver",
    sub: [
      {
        id: 1,
        name: "Apprvoval",
        path: "/approver/approval",
      },
    ],
  },
  {
    id: 7,
    path: "/ticketing",
    name: "Ticketing",
    sub: [
      {
        id: 1,
        name: "Tickets",
        path: "/ticketing/issue-handler-tickets",
      },
    ],
  },
  {
    id: 8,
    path: "/reports",
    name: "Reports",
  },
];
