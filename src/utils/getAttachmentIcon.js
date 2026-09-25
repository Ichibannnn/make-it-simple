// Original document-style file-type icons (not Microsoft/Adobe logo assets).
// Folded-corner document shape + brand-associated color + short label,
// same convention used by most generic icon packs for file types.

const DocumentBase = ({ color, label, labelSize = 8 }) => (
  <svg width="28" height="28" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    {/* page */}
    <path d="M7 2h13l7 7v19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#2A2F3A" stroke={color} strokeWidth="1.2" />
    {/* folded corner */}
    <path d="M20 2v6a1 1 0 0 0 1 1h6z" fill={color} opacity="0.85" />
    {/* colored footer band with label */}
    <rect x="5" y="21" width="22" height="9" rx="1.5" fill={color} />
    <text x="16" y="27.5" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize={labelSize} fill="#fff">
      {label}
    </text>
  </svg>
);

export const ExcelIcon = () => <DocumentBase color="#1D6F42" label="XLS" />;
export const WordIcon = () => <DocumentBase color="#2B579A" label="DOC" />;
export const PdfIcon = () => <DocumentBase color="#D93025" label="PDF" />;
export const GenericFileIcon = () => <DocumentBase color="#5C6B7A" label="FILE" labelSize={7} />;
export const ImageFileIcon = () => <DocumentBase color="#E8A400" label="IMG" />;

// Drop-in replacement for the existing utils/getAttachmentIcon.
// Accepts either a plain filename string or the {name, size, file} shape
// already used elsewhere in AddTicketDialog.
export const getAttachmentIcon = (fileNameOrObj) => {
  const name = typeof fileNameOrObj === "string" ? fileNameOrObj : fileNameOrObj?.name || "";
  const ext = name.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "xls":
    case "xlsx":
      return <ExcelIcon />;
    case "doc":
    case "docx":
      return <WordIcon />;
    case "pdf":
      return <PdfIcon />;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "webp":
      return <ImageFileIcon />;
    default:
      return <GenericFileIcon />;
  }
};

export default getAttachmentIcon;
