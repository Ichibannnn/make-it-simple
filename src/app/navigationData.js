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
        name: "One Charging",
        path: "/masterlist/one-charging",
      },

      {
        id: 2,
        name: "Category",
        path: "/masterlist/category",
      },

      {
        id: 3,
        name: "Sub Category",
        path: "/masterlist/sub-category",
      },
      {
        id: 4,
        name: "Concern Category",
        path: "/masterlist/concern-category",
      },
      {
        id: 5,
        name: "Receiver",
        path: "/masterlist/receiver-setup",
      },
      {
        id: 6,
        name: "Channel Setup",
        path: "/masterlist/channel-setup",
      },
      {
        id: 7,
        name: "Service Provider",
        path: "/masterlist/service-provider",
      },
      {
        id: 8,
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
        name: "Approval",
        path: "/approver/approval",
      },
      {
        id: 2,
        name: "View Tickets",
        path: "/approver/view-tickets",
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
