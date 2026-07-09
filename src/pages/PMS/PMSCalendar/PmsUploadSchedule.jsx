import { CheckCircleOutline, Close, FileUploadOutlined } from "@mui/icons-material";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
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
import { RiFileExcel2Line } from "react-icons/ri";
import * as XLSX from "xlsx";

import { pmsStyles } from "../styles/pmsStyles";
import { theme } from "../../../theme/theme";
import { useRef } from "react";
import { useState } from "react";
import useDisclosure from "../../../hooks/useDisclosure";
import moment from "moment";

const PmsUploadSchedule = ({ openUploadSchedule, onCloseUploadSchedule }) => {
  const uploadFileRef = useRef();
  const [excelData, setExcelData] = useState([]);
  const [fileName, setFileName] = useState("");

  const { open: openPreview, onClose: onClosePreview, onToggle: onPreviewToggle } = useDisclosure();

  const handleUploadButtonClick = () => {
    uploadFileRef.current.click();
  };

  const handleFileHandler = async (fileData) => {
    // console.log("FileData: ", fileData);

    if (!fileData) return;

    setFileName(fileData.name);

    const data = await fileData.arrayBuffer();
    const workbook = XLSX.read(data, { cellDates: true });

    const initialSheet = workbook.Sheets[workbook.SheetNames[0]];
    // raw: false formats cells (so date serials like 46234 become readable dates instead of numbers)
    const jsonData = XLSX.utils.sheet_to_json(initialSheet, { raw: false, dateNF: "yyyy-mm-dd" });
    console.log("jsonData:", jsonData);

    handleFileToJson(jsonData);
  };

  const handleFileToJson = (jsonData) => {
    setExcelData([]);

    jsonData.forEach((row) => {
      Object.keys(row).forEach((key) => {
        let newKey = key.trim().toLowerCase().replace(/ /g, "_");

        // Trim string values so trailing/leading spaces from the excel file don't leak into the payload
        const value = typeof row[key] === "string" ? row[key].trim() : row[key];

        if (key !== newKey) {
          delete row[key];
        }

        row[newKey] = value;
      });
    });

    setExcelData(jsonData);
    onPreviewToggle();
  };

  // console.log("ExcelData: ", excelData);

  const getExcelData = () => excelData.map((item) => item);

  const previewColumns = excelData.length ? Object.keys(excelData[0]) : [];

  const onSubmitHandler = () => {
    const getData = getExcelData();
    const payload = getData.map((item) => {
      return {
        code: item.code || "",
        name: item.name || "",
        region_code: item.region_code || "",
        region_name: item.region_name || "",
        area_code: item.area_code || "",
        area_name: item.area_name || "",
        schedule_date: moment(item.schedule_date).format("YYYY-MM-DD") || "",
      };
    });

    console.log("Payload: ", payload);
  };

  const handleClosePreview = () => {
    onClosePreview();
    setExcelData([]);
    setFileName("");

    if (uploadFileRef.current) {
      uploadFileRef.current.value = "";
    }
  };

  return (
    <>
      <Dialog
        sx={pmsStyles.dialog}
        fullWidth
        maxWidth="sm"
        open={openUploadSchedule}
        onClose={(event, reason) => {
          if (reason === "backdropClick") {
            event.stopPropagation();
            return;
          }
          onCloseUploadSchedule();
        }}
        PaperProps={{
          style: { overflow: "auto", border: "2px solid #4b586f" },
        }}
        disableEscapeKeyDown={false}
      >
        <DialogContent sx={pmsStyles.dialogContent}>
          <Stack sx={pmsStyles.dialogStackContainer}>
            <Stack sx={pmsStyles.dashedUploadBox}>
              <RiFileExcel2Line fontSize="40px" color="#A0AEC0" />
              <Typography variant="title" color="text.main" mt={1}>
                Upload Excel File
              </Typography>
              <Typography variant="subTitle" color="text.secondary">
                Drag and drop your file here or click to browse
              </Typography>

              <Stack mt={4} direction="row" gap={1}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<FileUploadOutlined />}
                  sx={pmsStyles.selectFileButton}
                  onClick={() => handleUploadButtonClick()}
                >
                  Select File
                </Button>
              </Stack>

              <input
                type="file"
                ref={uploadFileRef}
                style={{ display: "none" }}
                accept=".xlsx, .xls"
                onChange={(event) => handleFileHandler(event.target.files[0])}
              />
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack sx={{ width: "100%", padding: 2 }} direction="row" gap={1}>
            <Button variant="outlined" onClick={onCloseUploadSchedule} fullWidth>
              Cancel
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        sx={pmsStyles.dialog}
        fullWidth
        maxWidth="lg"
        open={openPreview}
        onClose={(event, reason) => {
          if (reason === "backdropClick") {
            event.stopPropagation();
            return;
          }
          handleClosePreview();
        }}
        PaperProps={{
          style: { overflow: "auto", border: "2px solid #4b586f" },
        }}
      >
        <Stack sx={pmsStyles.dialogHeaderContainer}>
          <Stack sx={{ ...pmsStyles.dialogHeaderText, alignItems: "flex-start" }}>
            <Stack direction="row" alignItems="center" gap={1.5}>
              <Stack
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  backgroundColor: "rgba(72, 187, 120, 0.12)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <RiFileExcel2Line fontSize="22px" color={theme.palette.success.main} />
              </Stack>
              <Stack>
                <Typography variant="title" sx={pmsStyles.dialogTitleText}>
                  Preview Imported File
                </Typography>
                <Typography variant="subTitle" color="text.secondary">
                  Review the records below before submitting
                </Typography>
              </Stack>
            </Stack>

            <IconButton onClick={handleClosePreview}>
              <Close />
            </IconButton>
          </Stack>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={1}
          sx={{
            px: 3,
            py: 1.5,
            backgroundColor: theme.palette.bgForm.black1,
            borderBottom: "1px solid #2D3748",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            gap={1}
            sx={{ minWidth: 0, color: theme.palette.text.secondary }}
          >
            <RiFileExcel2Line fontSize="16px" />
            <Typography
              variant="subTitle"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.main,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {fileName || "No file selected"}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" gap={1}>
            <Chip
              size="small"
              label={`${excelData.length} ${excelData.length === 1 ? "record" : "records"}`}
              sx={{ fontWeight: 600, fontSize: "11px", backgroundColor: theme.palette.secondary.main }}
            />
            <Chip
              size="small"
              label={`${previewColumns.length} ${previewColumns.length === 1 ? "column" : "columns"}`}
              sx={{
                fontWeight: 600,
                fontSize: "11px",
                backgroundColor: theme.palette.bgForm.black2,
                border: "1px solid #2D3748",
              }}
            />
          </Stack>
        </Stack>

        <DialogContent sx={{ padding: 3 }}>
          <TableContainer
            sx={{
              maxHeight: "500px",
              border: "1px solid #2D3748",
              borderRadius: "8px",
            }}
          >
            <Table
              stickyHeader
              size="small"
              sx={{
                "& .MuiTableCell-root": {
                  borderBottom: "1px solid #2D3748",
                  padding: "10px 16px",
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      fontSize: "12px",
                      backgroundColor: theme.palette.bgForm.black1,
                      color: theme.palette.text.main,
                      whiteSpace: "nowrap",
                      width: "56px",
                    }}
                  >
                    #
                  </TableCell>
                  {previewColumns.map((column) => (
                    <TableCell
                      key={column}
                      sx={{
                        fontWeight: 700,
                        fontSize: "12px",
                        letterSpacing: "0.4px",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                        backgroundColor: theme.palette.bgForm.black1,
                        color: theme.palette.text.main,
                        borderBottom: "2px solid #2D3748",
                      }}
                    >
                      {column.replace(/_/g, " ")}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {getExcelData().map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "transparent" : theme.palette.bgForm.black2,
                      transition: "background-color 0.15s ease",
                      "&:hover": { backgroundColor: "#252E3E" },
                      "&:hover .MuiTableCell-root": { backgroundColor: "transparent" },
                    }}
                  >
                    <TableCell
                      sx={{ fontSize: "12px", color: theme.palette.text.secondary, fontWeight: 600 }}
                    >
                      {index + 1}
                    </TableCell>
                    {previewColumns.map((column) => (
                      <TableCell
                        key={column}
                        sx={{
                          fontSize: "13px",
                          fontWeight: 500,
                          color: theme.palette.text.main,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row[column] === undefined || row[column] === "" ? (
                          <span style={{ color: theme.palette.text.secondary }}>-</span>
                        ) : (
                          row[column]
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

                {!excelData.length && (
                  <TableRow>
                    <TableCell colSpan={previewColumns.length + 1} align="center" sx={{ py: 5 }}>
                      <Typography variant="subTitle" color="text.secondary">
                        No data found in the imported file.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>

        <Divider sx={{ borderColor: "#2D3748" }} />

        <DialogActions>
          <Stack
            sx={{ width: "100%", padding: 2 }}
            direction="row"
            gap={1}
            justifyContent="flex-end"
            alignItems="center"
          >
            <Button variant="outlined" onClick={handleClosePreview}>
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<CheckCircleOutline />}
              onClick={onSubmitHandler}
              disabled={!excelData.length}
            >
              Submit
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PmsUploadSchedule;
