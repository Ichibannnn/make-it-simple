import { Box, Card, CardContent, Skeleton, Stack, TableCell, TableRow, Typography } from "@mui/material";
import somethingWentWrong from "../assets/svg/SomethingWentWrong.svg";
import noRecordsFound from "../assets/svg/noRecordsFound.svg";

// Card Something went wrong --
export const SomethingWentWrong = ({ label }) => {
  return (
    <Stack justifyContent="center" alignItems="center" padding={4}>
      <img src={somethingWentWrong} alt="Something Went Wrong" className="something-went-wrong-table" />
      <Typography variant="h6" color="error" align="center">
        {label}
      </Typography>
    </Stack>
  );
};

// Card No record --
export const NoRecordsFound = ({ label }) => {
  return (
    <Stack justifyContent="center" alignItems="center" padding={4}>
      <img src={noRecordsFound} alt="No Records Found" className="norecords-found-table" />
      <Typography variant="h6" align="center">
        {label}
      </Typography>
    </Stack>
  );
};

// Table Something went wrong -- 
export const SomethingWentWrongTable = ({ colSpan, label }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} align="center">
        <img src={somethingWentWrong} alt="Something Went Wrong" className="something-went-wrong-table" />
        <Typography variant="h5" color="#EDF2F7" marginLeft={2}>
          {label}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

// Table No record --
export const NoRecordsFoundTable = ({ colSpan, label }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} align="center">
        <img src={noRecordsFound} alt="No Records Found" className="norecords-found-table" />
        <Typography variant="h5" color="#EDF2F7" marginLeft={2}>
          {label}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

// Table Card --
export const CardSkeleton = ({ titleWidth = 180, contentHeight = 220, animation = "wave", sx }) => (
  <Card variant="outlined" aria-hidden sx={{ borderRadius: 1.5, ...sx }}>
    <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
      <Stack spacing={2.5}>
        <Skeleton variant="rounded" animation={animation} width={titleWidth} height={30} />
        <Skeleton variant="rounded" animation={animation} height={contentHeight} />
      </Stack>
    </CardContent>
  </Card>
);

export const CardListSkeleton = ({ count = 5, layout = "stack", minCardWidth = 300, ...cardProps }) => (
  <Box
    role="status"
    aria-label="Loading"
    sx={
      layout === "grid"
        ? {
            display: "grid",
            gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}px, 1fr))`,
            gap: 2,
          }
        : { display: "flex", flexDirection: "column", gap: 2 }
    }
  >
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} {...cardProps} />
    ))}
  </Box>
);

// Table --
const renderCell = (col, rowIndex) => {
  const { type = "text", width } = col;

  // Slightly vary widths per row so it looks natural, not like a barcode
  const varied = (base) => `${base - ((rowIndex * 7) % 20)}%`;

  switch (type) {
    case "checkbox":
      return <Skeleton variant="rounded" width={20} height={20} sx={{ mx: "auto" }} />;
    case "circle":
      return <Skeleton variant="circular" width={width ?? 28} height={width ?? 28} sx={{ mx: "auto" }} />;
    case "chip":
      return <Skeleton variant="rounded" width={width ?? 110} height={20} sx={{ borderRadius: 4 }} />;
    case "multiline":
      return (
        <>
          <Skeleton variant="text" width={width ?? varied(90)} />
          <Skeleton variant="text" width={varied(55)} />
        </>
      );
    default:
      return <Skeleton variant="text" width={width ?? varied(80)} />;
  }
};

export const TableSkeleton = ({ columns, rows = 8, cellSx }) => (
  <>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <TableRow key={rowIndex} aria-hidden>
        {columns
          .filter((col) => !col.hidden)
          .map((col, colIndex) => (
            <TableCell key={colIndex} padding={col.type === "checkbox" ? "checkbox" : "normal"} align={col.align ?? (col.type === "checkbox" || col.type === "circle" ? "center" : "left")} sx={cellSx}>
              {renderCell(col, rowIndex)}
            </TableCell>
          ))}
      </TableRow>
    ))}
  </>
);
