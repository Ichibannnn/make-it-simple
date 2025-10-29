import { Description as DocxIcon, PictureAsPdf as PdfIcon, Image as ImageIcon, TableChart as ExcelIcon, InsertDriveFile as DefaultIcon } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

export const getAttachmentIcon = (fileName) => {
  const ext = fileName.name.split(".").pop().toLowerCase();

  const baseStyle = {
    mr: 1,
    transition: "transform 0.2s ease, opacity 0.2s ease",
    "&:hover": { transform: "scale(1.1)", opacity: 0.85 },
  };

  switch (ext) {
    case "png":
    case "jpg":
    case "jpeg":
      return (
        <Tooltip title="Image File">
          <ImageIcon sx={{ ...baseStyle, color: "#ff9800" }} />
        </Tooltip>
      );
    case "pdf":
      return (
        <Tooltip title="PDF Document">
          <PdfIcon sx={{ ...baseStyle, color: "#f44336" }} />
        </Tooltip>
      );
    case "doc":
    case "docx":
      return (
        <Tooltip title="Word Document">
          <DocxIcon sx={{ ...baseStyle, color: "#2196f3" }} />
        </Tooltip>
      );
    case "xls":
    case "xlsx":
      return (
        <Tooltip title="Excel Spreadsheet">
          <ExcelIcon sx={{ ...baseStyle, color: "#2e7d32" }} />
        </Tooltip>
      );
    default:
      return (
        <Tooltip title="File">
          <DefaultIcon sx={{ ...baseStyle, color: "#9e9e9e" }} />
        </Tooltip>
      );
  }
};
