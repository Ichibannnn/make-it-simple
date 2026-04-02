import { FileUploadOutlined } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from "@mui/material";
import { RiFileExcel2Line } from "react-icons/ri";

import { pmsStyles } from "../styles/pmsStyles";
import { useRef } from "react";
import { useState } from "react";

const PmsUploadSchedule = ({ openUploadSchedule, onCloseUploadSchedule }) => {
  const uploadFileRef = useRef();
  const [excelData, setExcelData] = useState([]);

  const handleUploadButtonClick = () => {
    uploadFileRef.current.click();
  };

  const handleFileOnChange = (fileDate) => {
    console.log("File:", fileDate);
    // const file = event.target.files[0];
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
                onChange={(event) => handleFileOnChange(event.target.files[0])}
              />
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack sx={{ width: "100%", padding: 2 }} direction="row" gap={1}>
            <Button
              variant="outlined"
              onClick={onCloseUploadSchedule}
              fullWidth
            >
              Cancel
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PmsUploadSchedule;
