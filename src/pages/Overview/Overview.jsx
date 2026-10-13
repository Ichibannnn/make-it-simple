import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  useMediaQuery,
  CircularProgress,
  TextField,
  InputAdornment,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Tooltip as MuiTooltip,
  Button,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from "@mui/material";
import {
  Assignment,
  AssignmentLate,
  CheckCircleOutline,
  TaskAlt,
  FiberManualRecord,
  Refresh,
  Search,
  FileDownload,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  BarChart as BarChartIcon,
  TableRows,
} from "@mui/icons-material";

import { theme } from "../../theme/theme";
import { useGetOverviewQuery } from "../../features/api_overview/overviewApi";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from "recharts";
import noRecordsFound from "../../assets/svg/noRecordsFound.svg";

/* -------------------------------------------------------------------------- */
/* KPI configuration — change these to match your department's targets         */
/* -------------------------------------------------------------------------- */

const KPI_TARGET = 90; // % of tickets that must be on time to be "On target"
const KPI_WARNING = 75; // between this and the target = "At risk", below = "Off target"

/*
 * DEMO MODE: while the API can't filter by month/year yet, set this to true.
 * Monthly / yearly numbers are then generated from your real all-time response (see buildMockOverview).
 * Set it to false once the backend supports `year` and `month` params.
 */
const USE_MOCK_DATA = true;

const NOW = new Date();
const CURRENT_YEAR = NOW.getFullYear();
const CURRENT_MONTH = NOW.getMonth() + 1;
const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const PERIODS = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "all", label: "All time" },
];

/* -------------------------------------------------------------------------- */
/* Constants & helpers                                                         */
/* -------------------------------------------------------------------------- */

const COLORS = {
  card: "#111927",
  onTime: "#8884d8",
  delay: "#FF6347",
  accent: "#9e77ed",
  success: "#4caf50",
  warning: "#ffa726",
  muted: "#9fa6ad",
  text: "#EDF2F7",
  border: "rgba(255,255,255,0.12)",
};

const STATUS_COLORS = { success: COLORS.success, warning: COLORS.warning, error: COLORS.delay };

const SORT_OPTIONS = {
  tickets: { label: "Most tickets", fn: (a, b) => b.Tickets - a.Tickets || a.name.localeCompare(b.name) },
  delays: { label: "Most delays", fn: (a, b) => b.Delays - a.Delays || b.Tickets - a.Tickets },
  delayRate: { label: "Highest delay rate", fn: (a, b) => b.delayRate - a.delayRate || b.Tickets - a.Tickets },
  name: { label: "Name (A–Z)", fn: (a, b) => a.name.localeCompare(b.name) },
};

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "onTarget", label: "On target" },
  { value: "below", label: "Below target" },
];

const toNum = (v) => Number(v) || 0;
const roundTo1 = (n) => Math.round(n * 10) / 10;

// "MANALANG, JERIC  QUIAMBAO" -> "Manalang, Jeric Quiambao" (also trims the stray trailing spaces in the API data)
const cleanName = (raw = "") =>
  raw
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/(^|[\s,.-])(\p{L})/gu, (_, sep, ch) => sep + ch.toUpperCase());

const kpiStatus = (onTimeRate) =>
  onTimeRate >= KPI_TARGET ? { label: "On target", color: "success" } : onTimeRate >= KPI_WARNING ? { label: "At risk", color: "warning" } : { label: "Off target", color: "error" };

const normalizeDevelopers = (details) =>
  (details ?? []).map((d) => {
    const tickets = toNum(d.numberOfTicket);
    const delays = toNum(d.numberOfDelay);
    const onTime = Math.max(tickets - delays, 0);
    return {
      id: d.id ?? d.fullName,
      name: cleanName(d.fullName) || "Unknown",
      Tickets: tickets,
      Delays: delays,
      OnTime: onTime,
      delayRate: tickets ? roundTo1((delays / tickets) * 100) : 0,
      onTimeRate: tickets ? roundTo1((onTime / tickets) * 100) : 0,
      percentageTicket: d.percentageTicket,
    };
  });

// Totals are summed from the developer rows so the cards always agree with the chart.
const summarize = (rows) => {
  const tickets = rows.reduce((sum, d) => sum + d.Tickets, 0);
  const delays = rows.reduce((sum, d) => sum + d.Delays, 0);
  return {
    tickets,
    delays,
    onTimeRate: tickets ? roundTo1(((tickets - delays) / tickets) * 100) : 0,
    developers: rows.length,
    meeting: rows.filter((d) => d.Tickets > 0 && d.onTimeRate >= KPI_TARGET).length,
  };
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    "& fieldset": { borderColor: COLORS.border },
    "&:hover fieldset": { borderColor: COLORS.accent },
    "&.Mui-focused fieldset": { borderColor: COLORS.accent },
  },
  "& .MuiInputLabel-root": { color: COLORS.muted },
  "& .MuiSvgIcon-root": { color: COLORS.muted },
};

const toggleSx = {
  "& .MuiToggleButton-root": {
    color: COLORS.muted,
    borderColor: COLORS.border,
    textTransform: "none",
    px: 1.5,
    "&.Mui-selected": { color: "#fff", backgroundColor: "rgba(158,119,237,0.25)" },
    "&.Mui-selected:hover": { backgroundColor: "rgba(158,119,237,0.35)" },
  },
};

const exportToCsv = (rows, periodLabel, periodSlug) => {
  const header = ["Period", "Developer", "Total Tickets", "On Time", "Delayed", "On-Time Rate (%)", "Delay Rate (%)", "KPI Status"];
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = rows.map((r) => [periodLabel, r.name, r.Tickets, r.OnTime, r.Delays, r.onTimeRate, r.delayRate, kpiStatus(r.onTimeRate).label].map(escape).join(","));
  const blob = new Blob([[header.map(escape).join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `mis-developer-kpi-${periodSlug}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

/* -------------------------------------------------------------------------- */
/* Demo data (only used when USE_MOCK_DATA is true)                            */
/* -------------------------------------------------------------------------- */

const MOCK_HISTORY_MONTHS = 24; // pretend the all-time totals were earned over this many months

// Seeded random numbers: the same month always produces the same demo figures
const hashString = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const seededRandom = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const round2 = (n) => Math.round(n * 100) / 100;

/**
 * Turns the real all-time response into a period response with the same shape the API returns.
 * - ticket volume is scaled to the period length, with a per-developer and per-month variation
 * - each developer keeps roughly their own delay rate, plus a department-wide swing per period,
 *   so the "vs last month / year" trends show a mix of better and worse results
 * - future periods return no tickets, so you can see the empty state too
 */
const buildMockOverview = (base, args) => {
  const baseDept = base?.value?.[0];
  if (!baseDept || !args) return base; // all time = the real data

  const { year, month } = args;
  const isFuture = year > CURRENT_YEAR || (month && year === CURRENT_YEAR && month > CURRENT_MONTH);
  const monthsInPeriod = month ? 1 : year === CURRENT_YEAR ? CURRENT_MONTH : 12;
  const periodKey = `${year}-${month ?? "all"}`;

  const periodRand = seededRandom(hashString(periodKey));
  const drift = (periodRand() - 0.5) * 16; // department-wide delay-rate swing of about ±8 points
  const seasonal = month ? 0.8 + periodRand() * 0.4 : 1; // some months are busier than others
  const factor = (monthsInPeriod / MOCK_HISTORY_MONTHS) * seasonal;

  const rows = isFuture
    ? []
    : (baseDept.overviewAnalyticsDetails ?? [])
        .map((d) => {
          const rand = seededRandom(hashString(`${periodKey}-${d.id}`));
          const baseTickets = toNum(d.numberOfTicket);
          const tickets = Math.round(baseTickets * factor * (0.6 + rand() * 0.8));
          const baseRate = baseTickets ? (toNum(d.numberOfDelay) / baseTickets) * 100 : 0;
          const rate = Math.min(100, Math.max(0, baseRate + drift + (rand() - 0.5) * 20));
          return { ...d, numberOfTicket: tickets, numberOfDelay: Math.round((tickets * rate) / 100) };
        })
        .filter((d) => d.numberOfTicket > 0);

  const totalTicket = rows.reduce((sum, d) => sum + d.numberOfTicket, 0);
  const totalDelay = rows.reduce((sum, d) => sum + d.numberOfDelay, 0);

  return {
    ...base,
    value: [
      {
        ...baseDept,
        totalTicket,
        totalDelay,
        overviewAnalyticsDetails: rows.map((d) => ({
          ...d,
          percentageTicket: totalTicket ? round2((d.numberOfTicket / totalTicket) * 100) : 0,
          delayTicketPercentage: d.numberOfTicket ? round2((d.numberOfDelay / d.numberOfTicket) * 100) : 0,
        })),
      },
    ],
  };
};

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

const Overview = () => {
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // KPI period
  const [period, setPeriod] = useState("monthly");
  const [year, setYear] = useState(CURRENT_YEAR);
  const [month, setMonth] = useState(CURRENT_MONTH);

  // Table / chart controls
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("tickets");
  const [statusFilter, setStatusFilter] = useState("all");
  const [view, setView] = useState("chart");

  /*
   * The API must accept these params (see overviewApi change in the notes).
   * `undefined` params are dropped by fetchBaseQuery, so "all time" keeps working as before.
   */
  const queryArgs = useMemo(() => (period === "all" ? undefined : { year, month: period === "monthly" ? month : undefined }), [period, year, month]);

  const prevArgs = useMemo(() => {
    if (period === "yearly") return { year: year - 1 };
    if (period === "monthly") return month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };
    return undefined;
  }, [period, year, month]);

  // Real mode: ask the API for the selected period (+ the previous one for the trend lines).
  // currentData (not data) so a previous period is never shown under the new period's label.
  const realCurrent = useGetOverviewQuery(queryArgs, { skip: USE_MOCK_DATA });
  const realPrev = useGetOverviewQuery(prevArgs, { skip: USE_MOCK_DATA || period === "all" });

  // Demo mode: fetch the all-time response once and derive every period from it.
  const baseQuery = useGetOverviewQuery(undefined, { skip: !USE_MOCK_DATA });
  const baseData = baseQuery.currentData;
  const mockCurrent = useMemo(() => (USE_MOCK_DATA && baseData ? buildMockOverview(baseData, queryArgs) : undefined), [baseData, queryArgs]);
  const mockPrev = useMemo(() => (USE_MOCK_DATA && baseData && prevArgs ? buildMockOverview(baseData, prevArgs) : undefined), [baseData, prevArgs]);

  const data = USE_MOCK_DATA ? mockCurrent : realCurrent.currentData;
  const prevData = USE_MOCK_DATA ? mockPrev : realPrev.currentData;
  const { isFetching, isError, refetch } = USE_MOCK_DATA ? baseQuery : realCurrent;

  const loaded = Boolean(data);
  const showLoading = !loaded && isFetching;

  const department = data?.value?.[0]?.department ?? "Management Information System";
  const developers = useMemo(() => normalizeDevelopers(data?.value?.[0]?.overviewAnalyticsDetails), [data]);
  const current = useMemo(() => summarize(developers), [developers]);

  // Previous period, used only for the "vs last month / year" trend lines
  const previous = useMemo(() => {
    const prevRows = normalizeDevelopers(prevData?.value?.[0]?.overviewAnalyticsDetails);
    const s = summarize(prevRows);
    return s.tickets > 0 ? s : null;
  }, [prevData]);

  const periodLabel = period === "monthly" ? `${MONTHS[month - 1]} ${year}` : period === "yearly" ? `${year}` : "All time";
  const periodSlug = period === "monthly" ? `${year}-${String(month).padStart(2, "0")}` : period === "yearly" ? `${year}` : "all-time";
  const prevLabel = period === "monthly" ? "last month" : "last year";
  const rateStatus = kpiStatus(current.onTimeRate);

  const highlights = useMemo(() => {
    if (!developers.length) return null;
    const top = [...developers].sort(SORT_OPTIONS.tickets.fn)[0];
    const mostDelayed = [...developers].sort(SORT_OPTIONS.delays.fn)[0];
    return { top, mostDelayed };
  }, [developers]);

  // Search + filter + sort, shared by chart, table and CSV export
  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return developers
      .filter((d) => (q ? d.name.toLowerCase().includes(q) : true))
      .filter((d) => (statusFilter === "onTarget" ? d.onTimeRate >= KPI_TARGET : statusFilter === "below" ? d.onTimeRate < KPI_TARGET : true))
      .sort(SORT_OPTIONS[sortBy].fn);
  }, [developers, search, statusFilter, sortBy]);

  const chartHeight = Math.max(rows.length * 44 + 70, 260);
  const hasData = developers.length > 0;
  const hasFilters = search.trim() !== "" || statusFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  return (
    <Stack
      sx={{
        width: "100%",
        height: "auto",
        display: "flex",
        backgroundColor: theme.palette.bgForm.black1,
        color: "#fff",
        padding: isTablet ? "10px" : "15px 94px 25px 94px",
        boxSizing: "border-box",
        gap: 2,
      }}
    >
      {/* Header */}
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} gap={1}>
        <Box>
          <Stack direction="row" gap={1.5} alignItems="center">
            <Typography variant="h4">Overview</Typography>
            {USE_MOCK_DATA && <Chip size="small" color="warning" variant="outlined" label="Demo data" />}
          </Stack>
          <Typography sx={{ color: COLORS.muted, fontSize: "0.9rem" }}>Developer ticket workload · {department}</Typography>
        </Box>

        <Stack direction="row" gap={1} alignItems="center">
          <Button
            variant="outlined"
            size="small"
            startIcon={<FileDownload />}
            disabled={!rows.length}
            onClick={() => exportToCsv(rows, periodLabel, periodSlug)}
            sx={{ textTransform: "none", color: "#fff", borderColor: COLORS.border, "&:hover": { borderColor: COLORS.accent } }}
          >
            Export CSV
          </Button>
          <MuiTooltip title="Refresh data">
            <span>
              <IconButton onClick={() => refetch()} disabled={isFetching} aria-label="Refresh overview data" sx={{ color: "#fff" }}>
                {isFetching ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
              </IconButton>
            </span>
          </MuiTooltip>
        </Stack>
      </Stack>

      {isError && (
        <Alert
          severity="error"
          variant="outlined"
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Try again
            </Button>
          }
        >
          We couldn't load the ticket overview for {periodLabel}. Check your connection and try again.
        </Alert>
      )}

      {/* KPI period selector */}
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} gap={1.5}>
        <Box>
          <Typography sx={{ fontSize: "17px", fontWeight: 600 }}>Performance KPI: {periodLabel}</Typography>
          <Typography sx={{ color: COLORS.muted, fontSize: "13px" }}>Target: {KPI_TARGET}% of tickets completed on time</Typography>
        </Box>

        <Stack direction="row" gap={1.5} flexWrap="wrap" alignItems="center">
          <ToggleButtonGroup size="small" exclusive value={period} onChange={(_, v) => v && setPeriod(v)} aria-label="KPI period" sx={toggleSx}>
            {PERIODS.map((p) => (
              <ToggleButton key={p.value} value={p.value}>
                {p.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          {period !== "all" && (
            <TextField select size="small" label="Year" value={year} onChange={(e) => setYear(Number(e.target.value))} sx={{ ...fieldSx, minWidth: 100 }}>
              {YEAR_OPTIONS.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </TextField>
          )}

          {period === "monthly" && (
            <TextField select size="small" label="Month" value={month} onChange={(e) => setMonth(Number(e.target.value))} sx={{ ...fieldSx, minWidth: 140 }}>
              {MONTHS.map((m, i) => (
                <MenuItem key={m} value={i + 1}>
                  {m}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Stack>
      </Stack>

      {/* KPI cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<CheckCircleOutline sx={{ color: "#fff" }} />}
            iconBg={STATUS_COLORS[rateStatus.color]}
            label="On-time rate"
            value={loaded ? `${current.onTimeRate}%` : "–"}
            footer={
              loaded && (
                <Stack gap={0.75}>
                  <TargetProgress value={current.onTimeRate} target={KPI_TARGET} color={STATUS_COLORS[rateStatus.color]} />
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Chip size="small" variant="outlined" color={rateStatus.color} label={rateStatus.label} />
                    <Typography sx={{ color: COLORS.muted, fontSize: "12px" }}>Target {KPI_TARGET}%</Typography>
                  </Stack>
                  {previous && <DeltaChip current={current.onTimeRate} previous={previous.onTimeRate} mode="points" goodWhen="up" label={prevLabel} />}
                </Stack>
              )
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Assignment sx={{ color: "#fff" }} />}
            iconBg={COLORS.accent}
            label="Total tickets"
            value={loaded ? current.tickets.toLocaleString() : "–"}
            footer={
              loaded && (
                <Stack gap={0.5}>
                  <Typography sx={{ color: COLORS.muted, fontSize: "12px" }}>
                    {current.developers ? `${roundTo1(current.tickets / current.developers)} per developer on average` : "No developers yet"}
                  </Typography>
                  {previous && <DeltaChip current={current.tickets} previous={previous.tickets} mode="percent" goodWhen="up" label={prevLabel} />}
                </Stack>
              )
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<AssignmentLate sx={{ color: "#fff" }} />}
            iconBg={theme.palette.error.main}
            label="Delayed tickets"
            value={loaded ? current.delays.toLocaleString() : "–"}
            footer={
              loaded && (
                <Stack gap={0.5}>
                  <Typography sx={{ color: COLORS.muted, fontSize: "12px" }}>{current.tickets ? `${roundTo1((current.delays / current.tickets) * 100)}% of all tickets` : "No tickets yet"}</Typography>
                  {previous && <DeltaChip current={current.delays} previous={previous.delays} mode="percent" goodWhen="down" label={prevLabel} />}
                </Stack>
              )
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<TaskAlt sx={{ color: "#fff" }} />}
            iconBg="#3b82f6"
            label="Developers on target"
            value={loaded ? `${current.meeting} / ${current.developers}` : "–"}
            footer={
              loaded && (
                <Stack gap={0.75}>
                  <TargetProgress value={current.developers ? (current.meeting / current.developers) * 100 : 0} color="#3b82f6" />
                  <Typography sx={{ color: COLORS.muted, fontSize: "12px" }}>At or above {KPI_TARGET}% on-time</Typography>
                </Stack>
              )
            }
          />
        </Grid>
      </Grid>

      {/* Highlights */}
      {highlights && (
        <Stack direction="row" gap={1} flexWrap="wrap">
          <Chip
            icon={<FiberManualRecord sx={{ fontSize: 12, color: `${COLORS.onTime} !important` }} />}
            label={`Most tickets: ${highlights.top.name} (${highlights.top.Tickets})`}
            variant="outlined"
            sx={{ color: "#fff", borderColor: COLORS.border }}
          />
          {highlights.mostDelayed.Delays > 0 && (
            <Chip
              icon={<FiberManualRecord sx={{ fontSize: 12, color: `${COLORS.delay} !important` }} />}
              label={`Most delays: ${highlights.mostDelayed.name} (${highlights.mostDelayed.Delays})`}
              variant="outlined"
              sx={{ color: "#fff", borderColor: COLORS.border }}
            />
          )}
        </Stack>
      )}

      {/* Distribution panel */}
      <Box sx={{ backgroundColor: theme.palette.bgForm.black3, borderRadius: 1, overflow: "hidden", minHeight: 420 }}>
        {/* Keeps layout stable while refreshing */}
        <Box sx={{ height: 3 }}>{isFetching && loaded && <LinearProgress sx={{ height: 3 }} />}</Box>

        <Box sx={{ p: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", md: "center" }} gap={2} mb={2}>
            <Typography sx={{ color: COLORS.onTime, fontSize: "17px", fontWeight: 600 }}>
              Ticket distribution per developer
              {hasData && (
                <Typography component="span" sx={{ color: COLORS.muted, fontSize: "13px", ml: 1 }}>
                  Showing {rows.length} of {developers.length}
                </Typography>
              )}
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} gap={1.5} alignItems={{ xs: "stretch", sm: "center" }} flexWrap="wrap">
              <TextField
                size="small"
                placeholder="Search developer"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                inputProps={{ "aria-label": "Search developer" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ ...fieldSx, minWidth: 200 }}
              />

              <TextField select size="small" label="Sort by" value={sortBy} onChange={(e) => setSortBy(e.target.value)} sx={{ ...fieldSx, minWidth: 170 }}>
                {Object.entries(SORT_OPTIONS).map(([key, { label }]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>

              <ToggleButtonGroup size="small" exclusive value={statusFilter} onChange={(_, v) => v && setStatusFilter(v)} aria-label="Filter by KPI status" sx={toggleSx}>
                {STATUS_FILTERS.map((f) => (
                  <ToggleButton key={f.value} value={f.value}>
                    {f.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>

              <ToggleButtonGroup size="small" exclusive value={view} onChange={(_, v) => v && setView(v)} aria-label="Switch view" sx={toggleSx}>
                <ToggleButton value="chart" aria-label="Chart view">
                  <BarChartIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton value="table" aria-label="Table view">
                  <TableRows fontSize="small" />
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Stack>

          {/* Loading */}
          {showLoading && (
            <Stack sx={{ width: "100%", minHeight: 300, gap: 1, justifyContent: "center", alignItems: "center" }}>
              <CircularProgress />
              <Typography variant="h5" color={COLORS.text}>
                Please wait...
              </Typography>
            </Stack>
          )}

          {/* No tickets in this period */}
          {loaded && !hasData && (
            <Stack sx={{ width: "100%", minHeight: 300, gap: 1, justifyContent: "center", alignItems: "center" }}>
              <img src={noRecordsFound} alt="No Records Found" className="norecords-found-table" />
              <Typography variant="h5" color={COLORS.text} marginLeft={2}>
                No Tickets Available for {periodLabel}.
              </Typography>
            </Stack>
          )}

          {/* Tickets exist, but filters hide them all */}
          {loaded && hasData && !rows.length && (
            <Stack sx={{ width: "100%", minHeight: 300, gap: 1.5, justifyContent: "center", alignItems: "center" }}>
              <Typography variant="h6" color={COLORS.text}>
                No developers match your filters.
              </Typography>
              {hasFilters && (
                <Button onClick={clearFilters} sx={{ textTransform: "none", color: COLORS.accent }}>
                  Clear filters
                </Button>
              )}
            </Stack>
          )}

          {/* Chart view */}
          {rows.length > 0 && view === "chart" && (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 36, left: 0, bottom: 0 }} barSize={22}>
                <CartesianGrid stroke="rgba(255,255,255,0.15)" horizontal={false} />
                <XAxis type="number" allowDecimals={false} domain={[0, "dataMax + 1"]} tick={{ fill: COLORS.muted, fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={isTablet ? 120 : 190}
                  tick={{ fill: "#fff", fontSize: "12px" }}
                  tickFormatter={(name) => (name.length > (isTablet ? 16 : 28) ? `${name.slice(0, isTablet ? 15 : 27)}…` : name)}
                  interval={0}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#3f305f" }} />
                <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 12 }} formatter={(value) => <span style={{ color: COLORS.text, fontSize: 13 }}>{value}</span>} />

                {/* Stacked: On time + Delayed = Total tickets, so the bar length is the workload */}
                <Bar dataKey="OnTime" stackId="tickets" fill={COLORS.onTime} name="On time" />
                <Bar dataKey="Delays" stackId="tickets" fill={COLORS.delay} name="Delayed">
                  <LabelList dataKey="Tickets" position="right" fill="#fff" fontSize={12} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {/* Table view */}
          {rows.length > 0 && view === "table" && (
            <TableContainer sx={{ maxHeight: 560 }}>
              <Table stickyHeader size="small" aria-label="Developer KPI table">
                <TableHead>
                  <TableRow>
                    {["Developer", "Tickets", "On time", "Delayed", "On-time rate", "KPI status"].map((h, i) => (
                      <TableCell key={h} align={i === 0 ? "left" : "right"} sx={{ backgroundColor: COLORS.card, color: COLORS.muted, borderColor: COLORS.border, fontWeight: 600 }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((r) => {
                    const status = kpiStatus(r.onTimeRate);
                    return (
                      <TableRow key={r.id} hover sx={{ "&:hover": { backgroundColor: "#3f305f !important" } }}>
                        <TableCell sx={{ color: "#fff", borderColor: COLORS.border }}>{r.name}</TableCell>
                        <TableCell align="right" sx={{ color: "#fff", borderColor: COLORS.border }}>
                          {r.Tickets}
                        </TableCell>
                        <TableCell align="right" sx={{ color: "#fff", borderColor: COLORS.border }}>
                          {r.OnTime}
                        </TableCell>
                        <TableCell align="right" sx={{ color: r.Delays ? COLORS.delay : "#fff", borderColor: COLORS.border }}>
                          {r.Delays}
                        </TableCell>
                        <TableCell align="right" sx={{ color: "#fff", borderColor: COLORS.border }}>
                          {r.onTimeRate}%
                        </TableCell>
                        <TableCell align="right" sx={{ borderColor: COLORS.border }}>
                          <Chip size="small" variant="outlined" color={status.color} label={status.label} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
    </Stack>
  );
};

export default Overview;

/* -------------------------------------------------------------------------- */
/* Sub-components                                                              */
/* -------------------------------------------------------------------------- */

const StatCard = ({ icon, iconBg, label, value, footer }) => (
  <Card sx={{ width: "100%", height: "100%", backgroundColor: COLORS.card }}>
    <CardContent>
      <Stack direction="row" spacing={2} alignItems="center">
        {/* Icon with shadowed circle */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexShrink: 0,
            width: 48,
            height: 48,
            backgroundColor: iconBg,
            borderRadius: "50%",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          {icon}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 400, fontSize: "1rem", lineHeight: 1.5, color: COLORS.muted }}>{label}</Typography>
          <Typography variant="h4">{value}</Typography>
        </Box>
      </Stack>

      {footer && <Box mt={1.5}>{footer}</Box>}
    </CardContent>
  </Card>
);

// Progress bar with an optional tick marking the KPI target
const TargetProgress = ({ value, target, color }) => (
  <Box sx={{ position: "relative", pt: 0.5 }}>
    <LinearProgress
      variant="determinate"
      value={Math.min(Math.max(value, 0), 100)}
      aria-label="Progress"
      sx={{
        height: 6,
        borderRadius: 3,
        backgroundColor: "rgba(255,255,255,0.1)",
        "& .MuiLinearProgress-bar": { backgroundColor: color, borderRadius: 3 },
      }}
    />
    {target != null && <Box aria-hidden sx={{ position: "absolute", top: 0, left: `${target}%`, width: 2, height: 14, backgroundColor: "#fff", opacity: 0.8, borderRadius: 1 }} />}
  </Box>
);

// Trend vs the previous period. goodWhen decides whether an increase is green or red.
const DeltaChip = ({ current, previous, mode, goodWhen, label }) => {
  if (previous == null) return null;

  let diff;
  let text;
  if (mode === "points") {
    diff = roundTo1(current - previous);
    text = `${Math.abs(diff)} pts`;
  } else {
    if (!previous) return null;
    diff = roundTo1(((current - previous) / previous) * 100);
    text = `${Math.abs(diff)}%`;
  }

  const flat = diff === 0;
  const good = goodWhen === "up" ? diff > 0 : diff < 0;
  const color = flat ? COLORS.muted : good ? COLORS.success : COLORS.delay;
  const Icon = flat ? TrendingFlat : diff > 0 ? TrendingUp : TrendingDown;

  return (
    <Stack direction="row" gap={0.5} alignItems="center">
      <Icon sx={{ fontSize: 16, color }} />
      <Typography sx={{ color, fontSize: "12px" }}>
        {flat ? "No change" : text} vs {label}
      </Typography>
    </Stack>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const details = payload[0].payload;
  const status = kpiStatus(details.onTimeRate);

  return (
    <Box
      sx={{
        backgroundColor: COLORS.card,
        borderRadius: "8px",
        padding: "10px",
        color: "#fff",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>{label}</Typography>
      <Typography mt={1} sx={{ color: COLORS.onTime, fontSize: "13px", fontWeight: 500 }}>
        Total Tickets: {details.Tickets}
      </Typography>
      <Typography sx={{ color: COLORS.onTime, fontSize: "13px", fontWeight: 500 }}>On Time: {details.OnTime}</Typography>
      <Typography sx={{ color: theme.palette.error.main, fontSize: "13px", fontWeight: 500 }}>Total Delays: {details.Delays}</Typography>

      <Stack mt={0.5}>
        <Stack direction="row" gap={0.5} alignItems="center">
          <FiberManualRecord color="primary" sx={{ fontSize: "12px" }} />
          <Typography sx={{ color: "#fff", fontSize: "12px" }}>Share of Tickets: {details.percentageTicket}%</Typography>
        </Stack>

        <Stack direction="row" gap={0.5} alignItems="center">
          <FiberManualRecord color="error" sx={{ fontSize: "12px" }} />
          <Typography sx={{ color: "#fff", fontSize: "12px" }}>Delay Rate: {details.delayRate}%</Typography>
        </Stack>

        <Stack direction="row" gap={0.5} alignItems="center">
          <FiberManualRecord color={status.color} sx={{ fontSize: "12px" }} />
          <Typography sx={{ color: "#fff", fontSize: "12px" }}>
            KPI: {status.label} ({details.onTimeRate}% on time)
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

// Old Overview
// import { Box, Typography, Grid, Card, CardContent, Stack, useMediaQuery, CircularProgress } from "@mui/material";
// import { Assignment, AssignmentLate, FiberManualRecord } from "@mui/icons-material";

// import { theme } from "../../theme/theme";
// import { useGetOverviewQuery } from "../../features/api_overview/overviewApi";

// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
// import noRecordsFound from "../../assets/svg/noRecordsFound.svg";

// const Overview = () => {
//   const { data, isLoading, isFetching, isSuccess } = useGetOverviewQuery();
//   const isTablet = useMediaQuery(theme.breakpoints.down("md"));

//   const chartData = data?.value?.[0]?.overviewAnalyticsDetails
//     ?.map((detail) => ({
//       name: detail.fullName,
//       Tickets: detail.numberOfTicket,
//       OnTime: Number(detail.numberOfTicket) - Number(detail.numberOfDelay),
//       Delays: detail.numberOfDelay,
//       percentageTicket: detail.percentageTicket,
//       delayTicketPercentage: detail.delayTicketPercentage,
//     }))
//     ?.sort((a, b) => b.Tickets - a.Tickets);

//   return (
//     <Stack
//       sx={{
//         width: "100%",
//         height: "auto",
//         display: "flex",
//         backgroundColor: theme.palette.bgForm.black1,
//         color: "#fff",
//         padding: isTablet ? "10px" : "15px 94px 25px 94px",
//         boxSizing: "border-box",
//       }}
//     >
//       <Stack justifyItems="left" mb={2}>
//         <Typography variant="h4">Overview</Typography>
//       </Stack>

//       <Grid container spacing={2}>
//         {/* Cards */}
//         <Grid item xs={12} sm={6} md={4}>
//           <Card sx={{ width: "100%", height: "100%", backgroundColor: "#111927" }}>
//             <CardContent>
//               <Stack direction="row" spacing={2} alignItems="center">
//                 {/* Icon with Shadowed Circle */}
//                 <Box
//                   sx={{
//                     display: "flex",
//                     width: "100%",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     width: 48,
//                     height: 48,
//                     backgroundColor: "#9e77ed",
//                     borderRadius: "50%",
//                     boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
//                   }}
//                 >
//                   <Assignment sx={{ color: "#fff" }} />
//                 </Box>

//                 <Box>
//                   <Typography sx={{ fontWeight: 400, fontSize: "1rem", lineHeight: 1.5, color: "#9fa6ad" }}>Total Tickets:</Typography>
//                   <Typography variant="h4">{data?.value[0]?.totalTicket ? data?.value[0]?.totalTicket : "0"}</Typography>
//                 </Box>
//               </Stack>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} sm={6} md={4}>
//           <Card sx={{ width: "100%", height: "100%", backgroundColor: "#111927" }}>
//             <CardContent>
//               <Stack direction="row" spacing={2} alignItems="center">
//                 {/* Icon with Shadowed Circle */}
//                 <Box
//                   sx={{
//                     display: "flex",
//                     width: "50%",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     width: 48,
//                     height: 48,
//                     backgroundColor: theme.palette.error.main,
//                     borderRadius: "50%",
//                     boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
//                   }}
//                 >
//                   <AssignmentLate sx={{ color: "#fff" }} />
//                 </Box>

//                 <Box>
//                   <Typography sx={{ fontWeight: 400, fontSize: "1rem", lineHeight: 1.5, color: "#9fa6ad" }}>Delayed Tickets:</Typography>
//                   <Typography variant="h4">{data?.value[0]?.totalDelay ? data?.value[0]?.totalDelay : "0"}</Typography>
//                 </Box>
//               </Stack>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Bar Chart Section */}
//       <Box mt={4} padding={2} sx={{ backgroundColor: theme.palette.bgForm.black3, minHeight: "560px" }}>
//         <Stack direction="row" gap={0.5} alignItems="center" justifyContent="center" sx={{ width: "100%" }} mb={2} mt={2}>
//           <Typography gutterBottom sx={{ color: "#8884d8", fontSize: "17px", fontWeight: 600 }}>
//             Ticket Distribution (Ranked by Tickets)
//           </Typography>
//         </Stack>

//         <ResponsiveContainer width="100%" height={chartData?.length * 40}>
//           <BarChart data={chartData} layout="vertical">
//             <CartesianGrid stroke="#ccc" horizontal={false} />
//             <XAxis type="number" domain={[0, 5]} />
//             <YAxis type="category" dataKey="name" width={150} tick={{ fill: "#fff", fontSize: "12px" }} interval={0} />
//             <Tooltip content={<CustomTooltip />} cursor={{ fill: "#3f305f" }} />

//             {/* <Legend wrapperStyle={{ padding: 10 }} formatter={(value, entry) => <Typography sx={{ color: entry.color, fontSize: "12px", fontWeight: 600 }}>{value}</Typography>} />
//             <Bar dataKey="Tickets" stackId="a" fill="#8884d8" name="Total Tickets" />
//             <Bar dataKey="Delays" stackId="a" fill="#FF6347" name="Total Delays" /> */}

//             <Bar dataKey="Tickets" fill="#8884d8" label={{ position: "right", fill: "#fff", fontSize: 12 }} name="Total Tickets" />
//             <Bar
//               dataKey="Delays"
//               fill="#FF6347"
//               label={{
//                 position: "right",
//                 fill: "#fff",
//                 fontSize: 12,
//                 formatter: (value) => (value > 0 ? value : ""),
//               }}
//               name="Total Delay (%)"
//             />
//           </BarChart>

//           {(isLoading || isFetching) && (
//             <Stack sx={{ width: "100%", gap: 1, justifyContent: "center", alignItems: "center" }}>
//               <CircularProgress />
//               <Typography variant="h5" color="#EDF2F7">
//                 Please wait...
//               </Typography>
//             </Stack>
//           )}

//           {isSuccess && !chartData?.length && (
//             <Stack sx={{ width: "100%", gap: 1, justifyContent: "center", alignItems: "center" }}>
//               <img src={noRecordsFound} alt="No Records Found" className="norecords-found-table" />
//               <Typography variant="h5" color="#EDF2F7" marginLeft={2}>
//                 No Tickets Available.
//               </Typography>
//             </Stack>
//           )}
//         </ResponsiveContainer>
//       </Box>
//     </Stack>
//   );
// };

// export default Overview;

// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload?.length) {
//     const details = payload[0].payload;
//     return (
//       <Box
//         sx={{
//           backgroundColor: "#111927",
//           borderRadius: "8px",
//           padding: "10px",
//           color: "#fff",
//           boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
//         }}
//       >
//         <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>{label}</Typography>
//         <Typography mt={1} sx={{ color: "#8884d8", fontSize: "13px", fontWeight: 500 }}>
//           Total Tickets: {details.Tickets}
//         </Typography>

//         <Typography sx={{ color: theme.palette.error.main, fontSize: "13px", fontWeight: 500 }}>Total Delays: {details.Delays}</Typography>

//         <Stack mt={0.5}>
//           <Stack direction="row" gap={0.5} alignItems="center">
//             <FiberManualRecord color="primary" sx={{ fontSize: "12px" }} />
//             <Typography sx={{ color: "#fff", fontSize: "12px" }}>Ticket Percentage: {details.percentageTicket}%</Typography>
//           </Stack>

//           <Stack direction="row" gap={0.5} alignItems="center">
//             <FiberManualRecord color="error" sx={{ fontSize: "12px" }} />
//             <Typography sx={{ color: "#fff", fontSize: "12px" }}>Delay Percentage: {details.delayTicketPercentage}%</Typography>
//           </Stack>
//         </Stack>
//       </Box>
//     );
//   }
//   return null;
// };
