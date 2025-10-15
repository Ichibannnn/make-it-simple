import { Badge, Divider, OutlinedInput, Stack, Tab, Tabs, Typography, useMediaQuery } from "@mui/material";
import { DiscountOutlined, PendingOutlined, Search, WifiProtectedSetupOutlined } from "@mui/icons-material";

import { useEffect, useState } from "react";
import { theme } from "../../../theme/theme";
import useDebounce from "../../../hooks/useDebounce";

import { useGetNotificationQuery } from "../../../features/api_notification/notificationApi";
import {
  useGetViewDelayedTicketsApproverQuery,
  useGetViewHoldTicketsApproverQuery,
  useGetViewOpenTicketsApproverQuery,
} from "../../../features/api_ticketing/approver/viewTIcketApproverApi";

import ApproverOpenTicket from "./ApproverOpenTicket/ApproverOpenTicket";
import ApproverCloseTicket from "./ApproverClosedTicket/ApproverCloseTicket";
import ApproverHoldTicket from "./ApproverHoldTicket/ApproverHoldTicket";

const ViewTicketsPage = () => {
  const [tabNavigation, setTabNavigation] = useState("1");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));

  const { data: notificationBadge } = useGetNotificationQuery();

  const {
    data: viewOpenTicketApproverData,
    isLoading: viewOpenTicketApproverIsLoading,
    isFetching: viewOpenTicketApproverIsFetching,
    isSuccess: viewOpenTicketApproverIsSuccess,
    isError: viewOpenTicketApproverIsError,
  } = useGetViewOpenTicketsApproverQuery({
    Search: search,
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const {
    data: viewDelayedTicketApproverData,
    isLoading: viewDelayedTicketApproverIsLoading,
    isFetching: viewDelayedTicketApproverIsFetching,
    isSuccess: viewDelayedTicketApproverIsSuccess,
    isError: viewDelayedTicketApproverIsError,
  } = useGetViewDelayedTicketsApproverQuery({
    Search: search,
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const {
    data: viewOnHoldTicketApproverData,
    isLoading: viewOnHoldTicketApproverIsLoading,
    isFetching: viewOnHoldTicketApproverIsFetching,
    isSuccess: viewOnHoldTicketApproverIsSuccess,
    isError: viewOnHoldTicketApproverIsError,
  } = useGetViewHoldTicketsApproverQuery({
    Search: search,
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const onStatusChange = (_, newValue) => {
    setTabNavigation(newValue);
    setPageNumber(1);
    setPageSize(100);
    setSearchValue("");
  };

  useEffect(() => {
    if (searchValue) {
      setPageNumber(1);
    }
  }, [searchValue]);

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: theme.palette.bgForm.black1,
        color: "#fff",
        padding: isScreenSmall ? "20px" : "14px 44px 44px 44px",
      }}
    >
      <Stack>
        <Stack direction="row" justifyContent="space-between">
          <Stack>
            <Stack justifyItems="left">
              <Typography variant={isScreenSmall ? "h5" : "h4"}>View Tickets</Typography>
            </Stack>
            <Stack justifyItems="space-between" direction="row" marginTop={1}></Stack>
          </Stack>
        </Stack>
      </Stack>

      <Stack
        sx={{
          backgroundColor: theme.palette.bgForm.black3,
          borderRadius: "20px",
          marginTop: "10px",
        }}
      >
        <Stack direction="row" justifyContent="space-between" paddingLeft={1} paddingRight={1}>
          <Tabs
            value={tabNavigation}
            onChange={onStatusChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              ".MuiTab-root": {
                minWidth: isScreenSmall ? "80px" : "120px",
                fontSize: { xs: "10px", sm: "12px", md: "13px" },
              },
              ".MuiTabs-scrollButtons": {
                color: "#fff",
                "&.Mui-disabled": {
                  opacity: 0.3,
                },
              },
            }}
          >
            <Tab
              value="1"
              className="tabs-styling"
              label="Open Tickets"
              icon={
                <Badge
                  // badgeContent={notificationBadge?.value?.forApprovalClosingNotif}
                  max={100000}
                  color="warning"
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  sx={{
                    ".MuiBadge-badge": {
                      fontSize: "0.55rem",
                      fontWeight: 400,
                    },
                  }}
                >
                  <DiscountOutlined />
                </Badge>
              }
              iconPosition="start"
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                ".MuiBadge-badge": {
                  color: "#ffff",
                },
              }}
            />

            <Tab
              value="2"
              className="tabs-styling"
              label="Delayed Tickets"
              icon={
                <Badge
                  // badgeContent={notificationBadge?.value?.forApprovalClosingNotif}
                  max={100000}
                  color="warning"
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  sx={{
                    ".MuiBadge-badge": {
                      fontSize: "0.55rem",
                      fontWeight: 400,
                    },
                  }}
                >
                  <DiscountOutlined />
                </Badge>
              }
              iconPosition="start"
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                ".MuiBadge-badge": {
                  color: "#ffff",
                },
              }}
            />

            <Tab
              value="3"
              className="tabs-styling"
              label="Hold Tickets"
              icon={
                <Badge
                  // badgeContent={notificationBadge?.value?.forApprovalClosingNotif}
                  max={100000}
                  color="warning"
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  sx={{
                    ".MuiBadge-badge": {
                      fontSize: "0.55rem",
                      fontWeight: 400,
                    },
                  }}
                >
                  <DiscountOutlined />
                </Badge>
              }
              iconPosition="start"
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                ".MuiBadge-badge": {
                  color: "#ffff",
                },
              }}
            />
          </Tabs>
        </Stack>

        <Divider variant="fullWidth" sx={{ background: "#2D3748", marginTop: "1px" }} />

        <Stack sx={{ width: "100%", padding: 1 }}>
          <OutlinedInput
            placeholder="Search"
            startAdornment={<Search sx={{ marginRight: 0.5, color: "#A0AEC0" }} />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{
              borderRadius: "15px",
              fontSize: "small",
              fontWeight: 400,
              lineHeight: "1.4375rem",
            }}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {tabNavigation === "1" ? (
            <>
              <ApproverOpenTicket
                data={viewOpenTicketApproverData}
                isLoading={viewOpenTicketApproverIsLoading}
                isFetching={viewOpenTicketApproverIsFetching}
                isSuccess={viewOpenTicketApproverIsSuccess}
                isError={viewOpenTicketApproverIsError}
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
              />
            </>
          ) : tabNavigation === "2" ? (
            <>
              <ApproverCloseTicket
                data={viewDelayedTicketApproverData}
                isLoading={viewDelayedTicketApproverIsLoading}
                isFetching={viewDelayedTicketApproverIsFetching}
                isSuccess={viewDelayedTicketApproverIsSuccess}
                isError={viewDelayedTicketApproverIsError}
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
              />
            </>
          ) : (
            <>
              <ApproverHoldTicket
                data={viewOnHoldTicketApproverData}
                isLoading={viewOnHoldTicketApproverIsLoading}
                isFetching={viewOnHoldTicketApproverIsFetching}
                isSuccess={viewOnHoldTicketApproverIsSuccess}
                isError={viewOnHoldTicketApproverIsError}
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
              />
            </>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ViewTicketsPage;
