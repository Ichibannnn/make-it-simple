import TextFieldsIcon from "@mui/icons-material/TextFields";
import NotesIcon from "@mui/icons-material/Notes";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TagIcon from "@mui/icons-material/Tag";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
import TableChartIcon from "@mui/icons-material/TableChart";
import DrawIcon from "@mui/icons-material/Draw";

export const FIELD_GROUPS = [
  {
    group: "BASIC",
    fields: [
      { type: "text", label: "Text", Icon: TextFieldsIcon },
      { type: "textarea", label: "Textarea", Icon: NotesIcon },
      { type: "select", label: "Dropdown", Icon: ArrowDropDownCircleIcon },
      { type: "date", label: "Date", Icon: CalendarTodayIcon },
      { type: "time", label: "Time", Icon: AccessTimeIcon },
      { type: "number", label: "Number", Icon: TagIcon },
    ],
  },
  {
    group: "LAYOUT",
    fields: [{ type: "section", label: "Section Header", Icon: ViewHeadlineIcon }],
  },
  {
    group: "ADVANCED",
    fields: [
      { type: "checklist", label: "Checklist Table", Icon: TableChartIcon },
      { type: "signature", label: "Signature Pad", Icon: DrawIcon },
    ],
  },
];

export const FIELD_TYPE_MAP = Object.fromEntries(
  FIELD_GROUPS.flatMap((g) => g.fields).map((f) => [f.type, f]),
);

export const TYPE_CHIP_LABEL = {
  text: "Text",
  textarea: "Textarea",
  select: "Dropdown",
  date: "Date",
  time: "Time",
  number: "Number",
  section: "Section",
  checklist: "Checklist",
  signature: "Signature",
};
