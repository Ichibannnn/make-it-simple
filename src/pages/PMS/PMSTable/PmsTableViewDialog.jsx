import { Close } from "@mui/icons-material";
import {
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import useDisclosure from "../../../hooks/useDisclosure";

import { global } from "../../../styles/global";
import { pmsStyles } from "../styles/pmsStyles";
import { details } from "../../../data";

import ShowChecklistDialog from "./ShowChecklistDialog";
import PmsTableDetailsActions from "./PmsTableDetailsAction";

const PmsTableViewDialog = ({ open, onClose }) => {
  const {
    open: openShowChecklist,
    onToggle: onShowChecklistToggle,
    onClose: onShowChecklistClose,
  } = useDisclosure();

  const tableHeader = [
    "STORE",
    "TICKET NO.",
    "MONTH",
    "DONE ON",
    "STATUS",
    "ACTION",
  ];

  const onShowCheclistAction = () => {
    onShowChecklistToggle();
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={(event, reason) => {
          if (reason === "backdropClick") {
            event.stopPropagation();
            return;
          }
          onClose();
        }}
        disableEscapeKeyDown={false}
        sx={pmsStyles.dialog}
        PaperProps={{ style: { ...global.paperDialog } }}
      >
        <DialogContent sx={pmsStyles.dialogContent}>
          <Stack sx={pmsStyles.dialogTitleBackground}>
            <Stack sx={pmsStyles.dialogTitleContainer}>
              <Typography sx={pmsStyles.dialogTitleText}>DETAILS</Typography>

              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            </Stack>
          </Stack>

          <Stack>
            <TableContainer>
              <Table size="small" stickyHeader sx={{ borderBottom: "none" }}>
                <TableHead sx={{ whiteSpace: "nowrap" }}>
                  <TableRow>
                    {tableHeader?.map((header, index) => (
                      <TableCell key={index} sx={global.tableCelHeader}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {details?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell sx={global.tableCellBody}>
                        {item.store}
                      </TableCell>
                      <TableCell sx={global.tableCellBody}>
                        {item.ticketNumber}
                      </TableCell>
                      <TableCell sx={global.tableCellBody}>
                        {item.month}
                      </TableCell>
                      <TableCell sx={global.tableCellBody}>
                        {item.doneOn ? item.doneOn : "--"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          variant="filled"
                          sx={{
                            fontSize: "13px",
                            backgroundColor:
                              item.status === "Done" ? "#112C32" : "#2D2823",
                            color:
                              item.status === "Done" ? "#10B981" : "#D27D0E",
                            fontWeight: 800,
                          }}
                          label={item.status === "Done" ? "DONE" : "PENDING"}
                        />
                      </TableCell>
                      <TableCell sx={global.tableCellBody}>
                        <PmsTableDetailsActions
                          data={item}
                          onShowChecklist={onShowCheclistAction}
                        />
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* {isError && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <img src={somethingWentWrong} alt="Something Went Wrong" className="something-went-wrong-table" />
                        <Typography variant="h5" color="#EDF2F7" marginLeft={2}>
                          Something went wrong.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}

                  {(isLoading || isFetching) && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <CircularProgress />
                        <Typography variant="h5" color="#EDF2F7">
                          Please wait...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}

                  {isSuccess && !data?.length && !isLoading && !isFetching && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <img src={noRecordsFound} alt="No Records Found" className="norecords-found-table" />
                        <Typography variant="h5" color="#EDF2F7" marginLeft={2}>
                          No records found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )} */}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </DialogContent>
      </Dialog>

      <ShowChecklistDialog data={details} />
    </>
  );
};

export default PmsTableViewDialog;
