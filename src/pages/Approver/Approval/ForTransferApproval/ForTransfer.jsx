import { Box, Chip, CircularProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tabs, Tooltip, Typography } from "@mui/material";
import { AccessTimeOutlined, CalendarMonthOutlined } from "@mui/icons-material";
import React, { useState } from "react";

import moment from "moment";
import { theme } from "../../../../theme/theme";
import useDisclosure from "../../../../hooks/useDisclosure";

import noRecordsFound from "../../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../../assets/svg/SomethingWentWrong.svg";

const ForTransfer = () => {
  return <div>For Transfer will be available in next update</div>;
};

export default ForTransfer;
