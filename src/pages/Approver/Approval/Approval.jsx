import { Badge, Divider, OutlinedInput, Stack, Tab, Tabs, Typography } from "@mui/material";
import { DiscountOutlined, Search, WifiProtectedSetupOutlined } from "@mui/icons-material";

import React, { useEffect, useState } from "react";
import { theme } from "../../../theme/theme";
import useDebounce from "../../../hooks/useDebounce";

import TicketApproval from "./TicketApproval/TicketApproval";
import ForTransfer from "./ForTransferApproval/ForTransfer";

import { useGetTicketApprovalQuery, useGetTransferApprovalQuery } from "../../../features/api_ticketing/approver/ticketApprovalApi";
import { useNotification } from "../../../context/NotificationContext";

const Approval = () => {
  const [tabNavigation, setTabNavigation] = useState("1");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  const { data: notification } = useNotification();

  console.log("Approval: ", notification);

  const {
    data: ticketApprovalData,
    isLoading: ticketApprovalIsLoading,
    isFetching: ticketApprovalIsFetching,
    isSuccess: ticketApprovalIsSuccess,
    isError: ticketApprovalIsError,
  } = useGetTicketApprovalQuery({
    Search: search,
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const {
    data: transferData,
    isLoading: transferIsLoading,
    isFetching: transferIsFetching,
    isSuccess: transferIsSuccess,
    isError: transferIsError,
  } = useGetTransferApprovalQuery({
    Search: search,
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const onStatusChange = (_, newValue) => {
    setTabNavigation(newValue);
    setPageNumber(1);
    setPageSize(5);
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
        padding: "14px 44px 44px 44px",
      }}
    >
      <Stack>
        <Stack direction="row" justifyContent="space-between">
          <Stack>
            <Stack justifyItems="left">
              <Typography variant="h4">Approval</Typography>
            </Stack>
            <Stack justifyItems="space-between" direction="row" marginTop={1}></Stack>
          </Stack>
        </Stack>
      </Stack>

      <Stack
        sx={{
          backgroundColor: theme.palette.bgForm.black3,
          borderRadius: "20px",
          marginTop: "20px",
        }}
      >
        <Stack direction="row" justifyContent="space-between">
          <Tabs value={tabNavigation} onChange={onStatusChange}>
            <Tab
              value="1"
              className="tabs-styling"
              label="Tickets"
              icon={
                <Badge
                  badgeContent={notification?.value?.forApprovalClosingNotif}
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
              label="For Transfer"
              icon={
                <Badge
                  badgeContent={notification?.value?.forApprovalTransferNotif}
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
                  <WifiProtectedSetupOutlined />
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

          <Stack sx={{ alignItems: "center", justifyContent: "center" }}>
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
        </Stack>

        <Divider variant="fullWidth" sx={{ background: "#2D3748", marginTop: "1px" }} />

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ marginTop: "10px", padding: "20px" }} gap={4}>
          {tabNavigation === "1" ? (
            <>
              <TicketApproval
                data={ticketApprovalData}
                isLoading={ticketApprovalIsLoading}
                isFetching={ticketApprovalIsFetching}
                isSuccess={ticketApprovalIsSuccess}
                isError={ticketApprovalIsError}
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
              />
            </>
          ) : (
            <>
              <ForTransfer
                data={transferData}
                isLoading={transferIsLoading}
                isFetching={transferIsFetching}
                isSuccess={transferIsSuccess}
                isError={transferIsError}
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

export default Approval;
