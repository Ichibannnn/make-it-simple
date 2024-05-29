import {
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
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
  Tooltip,
  Typography,
} from "@mui/material";
import {
  AddOutlined,
  ArrowDownward,
  ArrowUpward,
  CalendarMonthOutlined,
  ChecklistRtlOutlined,
  ClearAllOutlined,
  FiberManualRecord,
  KeyboardArrowDown,
  KeyboardArrowUp,
  PendingActionsOutlined,
  RotateRightOutlined,
  Search,
} from "@mui/icons-material";

import React, { useEffect, useState } from "react";
import { theme } from "../../../theme/theme";
import moment from "moment";

import noRecordsFound from "../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../assets/svg/SomethingWentWrong.svg";

import useDebounce from "../../../hooks/useDebounce";
import useDisclosure from "../../../hooks/useDisclosure";

const IssueHandlerTickets = () => {
  const [status, setStatus] = useState("");
  const [ascending, setAscending] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  return <div>Tickets</div>;
};

export default IssueHandlerTickets;
