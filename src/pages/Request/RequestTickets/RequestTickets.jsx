import {
  Button,
  Divider,
  OutlinedInput,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { theme } from "../../../theme/theme";
import {
  AddOutlined,
  EmailOutlined,
  MarkEmailReadOutlined,
  MarkEmailUnreadOutlined,
  Search,
  SendOutlined,
  StickyNote2Outlined,
} from "@mui/icons-material";

import useDebounce from "../../../hooks/useDebounce";
import useDisclosure from "../../../hooks/useDisclosure";

const RequestTickets = () => {
  const [status, setStatus] = useState("true");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  const [editData, setEditData] = useState(null);

  const { open, onToggle, onClose } = useDisclosure();

  const onPageNumberChange = (_, page) => {
    setPageNumber(page + 1);
  };

  const onPageSizeChange = (e) => {
    setPageSize(e.target.value);
  };

  const onDialogClose = () => {
    onClose();
  };

  const onEditAction = (data) => {
    onToggle();
    setEditData(data);
  };

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: theme.palette.bgForm.black1,
        color: "#fff",
        padding: "24px",
      }}
    >
      <Stack>
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Stack justifyItems="left">
            <Typography variant="h4">Tickets</Typography>
          </Stack>

          <Stack justifyItems="space-between" direction="row">
            <Button
              variant="contained"
              size="large"
              color="primary"
              startIcon={<AddOutlined />}
              onClick={onToggle}
            >
              Create Ticket
            </Button>
          </Stack>
        </Stack>

        <Stack direction="row" width="100%" justifyContent="space-between">
          {/* MAIN */}
          <Stack
            sx={{
              backgroundColor: theme.palette.bgForm.black3,
              borderRadius: "20px",
              marginTop: "20px",
              width: "100%",
            }}
          >
            <Stack direction="row" justifyContent="space-between">
              <Tabs value={status} onChange={(_, value) => setStatus(value)}>
                <Tab
                  value=""
                  className="tabs-styling"
                  label="All Tickets"
                  icon={<EmailOutlined />}
                  iconPosition="start"
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                />
                <Tab
                  value="true"
                  className="tabs-styling"
                  label="Pending Tickets"
                  icon={<MarkEmailUnreadOutlined />}
                  iconPosition="start"
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                />
                <Tab
                  value="false"
                  className="tabs-styling"
                  label="Closed Tickets"
                  icon={<MarkEmailReadOutlined />}
                  iconPosition="start"
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                />

                <Tab
                  //   value="false"
                  className="tabs-styling"
                  label="Requested Tickets"
                  icon={<SendOutlined />}
                  iconPosition="start"
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                />

                <Tab
                  //   value="false"
                  className="tabs-styling"
                  label="Concerns"
                  icon={<StickyNote2Outlined />}
                  iconPosition="start"
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                />
              </Tabs>
            </Stack>

            <Divider
              variant="fullWidth"
              sx={{ background: "#2D3748", marginTop: "1px" }}
            />

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ marginTop: "10px", padding: "20px" }}
              gap={4}
            >
              <OutlinedInput
                flex="1"
                placeholder="Search Ticket #: eg 00001"
                startAdornment={
                  <Search sx={{ marginRight: 0.5, color: "#A0AEC0" }} />
                }
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                sx={{
                  flex: 1,
                  borderRadius: "15px",
                  fontSize: "small",
                  fontWeight: 400,
                  lineHeight: "1.4375rem",
                }}
              />
            </Stack>

            <TableContainer>
              <Table sx={{ borderBottom: "none" }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        background: "#1C2536",
                        color: "#D65DB1",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                      align="center"
                    >
                      LINE NO.
                    </TableCell>
                    <TableCell
                      sx={{
                        background: "#1C2536",
                        color: "#D65DB1",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                    >
                      DATE REQUESTED
                    </TableCell>

                    <TableCell
                      sx={{
                        background: "#1C2536",
                        color: "#D65DB1",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                      align="center"
                    >
                      DEPARTMENT
                    </TableCell>

                    <TableCell
                      sx={{
                        background: "#1C2536",
                        color: "#D65DB1",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                      align="center"
                    >
                      TICKET #
                    </TableCell>

                    <TableCell
                      sx={{
                        background: "#1C2536",
                        color: "#D65DB1",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                      align="center"
                    >
                      TICKET DESCRIPTION
                    </TableCell>

                    <TableCell
                      sx={{
                        background: "#1C2536",
                        color: "#D65DB1",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                      align="center"
                    >
                      STATUS
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {/* {isSuccess &&
                !isLoading &&
                !isFetching &&
                data?.value?.category?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell
                      sx={{
                        color: "#EDF2F7",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                      align="center"
                    >
                      {item.id}
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "#EDF2F7",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      {item.category_Description}
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "#EDF2F7",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                      align="center"
                    >
                      <CategorySubCat subCategories={item.subcategories} />
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "#EDF2F7",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                      align="center"
                    >
                      <Chip
                        variant="filled"
                        size="30px"
                        sx={{
                          fontSize: "13px",
                          backgroundColor: item.is_Active
                            ? "#112C32"
                            : "#2D2823",
                          color: item.is_Active ? "#10B981" : "#D27D0E",
                          fontWeight: 800,
                        }}
                        label={item.is_Active ? "ACTIVE" : "INACTIVE"}
                      />
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "#EDF2F7",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                      align="center"
                    >

                    </TableCell>
                  </TableRow>
                ))} */}

                  {/* {isError && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="h5" color="#EDF2F7">
                      Something went wrong.
                    </Typography>
                  </TableCell>
                </TableRow>
              )} */}

                  {/* {(isLoading || isFetching) && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                    <Typography variant="h5" color="#EDF2F7">
                      Please wait...
                    </Typography>
                  </TableCell>
                </TableRow>
              )} */}

                  {/* {isSuccess && !data?.value?.category.length && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="h5" color="#EDF2F7">
                      No records found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )} */}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              sx={{ color: "#A0AEC0", fontWeight: 400 }}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Stack>

          {/* QUICK TICKET */}
          {/* <Stack
            sx={{
              backgroundColor: theme.palette.bgForm.black3,
              borderRadius: "20px",
              marginTop: "20px",
            }}
          >
            <Stack direction="row" justifyContent="space-between">
              <Tabs value={status} onChange={(_, value) => setStatus(value)}>
                <Tab
                  value=""
                  className="tabs-styling"
                  label="All Tickets"
                  icon={<EmailOutlined />}
                  iconPosition="start"
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                />
                <Tab
                  value="true"
                  className="tabs-styling"
                  label="Pending Tickets"
                  icon={<MarkEmailUnreadOutlined />}
                  iconPosition="start"
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                />
                <Tab
                  value="false"
                  className="tabs-styling"
                  label="Closed Tickets"
                  icon={<MarkEmailReadOutlined />}
                  iconPosition="start"
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                />
              </Tabs>
            </Stack>

            <Divider
              variant="fullWidth"
              sx={{ background: "#2D3748", marginTop: "1px" }}
            />

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ marginTop: "10px", padding: "20px" }}
              gap={4}
            ></Stack>
          </Stack> */}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default RequestTickets;
