import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Collapse,
  Divider,
  ListSubheader,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";
import ApiOutlinedIcon from "@mui/icons-material/ApiOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import {
  useLazyGetCompaniesQuery,
  useLazyGetBusinessUnitsQuery,
  useLazyGetDepartmentsQuery,
  useLazyGetUnitsQuery,
  useLazyGetSubUnitsQuery,
  useLazyGetLocationsQuery,
} from "../features/ymir/ymirApi";

import { useLazyGetEmployeesQuery } from "../features/sedar/sedarApi";

import {
  OPTION_SOURCES,
  OPTION_SOURCE_GROUPS,
  OPTION_SOURCE_MAP,
} from "../constants/optionSource";

// ── Shared input sx ──────────────────────────────────────────────────────────
const inputSx = {
  "& .MuiOutlinedInput-root": {
    fontSize: 12,
    "& fieldset": { borderColor: "#30363D" },
    "&:hover fieldset": { borderColor: "#7C3AED" },
    "&.Mui-focused fieldset": { borderColor: "#7C3AED" },
    bgcolor: "rgba(255,255,255,0.02)",
  },
  "& .MuiInputBase-input": { color: "#E6EDF3", py: 0.75, px: 1.25 },
  "& .MuiSelect-icon": { color: "#8B949E" },
};

// ── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status, count }) {
  if (status === "idle") return null;
  if (status === "loading")
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <CircularProgress size={11} sx={{ color: "#7C3AED" }} />
        <Typography sx={{ fontSize: 10, color: "#8B949E" }}>
          Fetching…
        </Typography>
      </Box>
    );
  if (status === "error")
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <ErrorOutlineIcon sx={{ fontSize: 13, color: "#EF4444" }} />
        <Typography sx={{ fontSize: 10, color: "#EF4444" }}>
          Failed to fetch
        </Typography>
      </Box>
    );
  if (status === "success")
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 13, color: "#22C55E" }} />
        <Typography sx={{ fontSize: 10, color: "#22C55E" }}>
          {count} option{count !== 1 ? "s" : ""} loaded
        </Typography>
      </Box>
    );
  return null;
}

// ── Options preview list ─────────────────────────────────────────────────────
function OptionsPreview({ options }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? options : options.slice(0, 5);
  const hasMore = options.length > 5;

  if (options.length === 0) return null;

  return (
    <Box
      sx={{
        mt: 1,
        borderRadius: 1,
        border: "1px solid #30363D",
        overflow: "hidden",
      }}
    >
      {visible.map((opt, i) => (
        <Box
          key={i}
          sx={{
            px: 1.5,
            py: 0.6,
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderBottom: i < visible.length - 1 ? "1px solid #1e242c" : "none",
            bgcolor: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent",
          }}
        >
          <Typography
            sx={{
              fontSize: 9,
              color: "#30363D",
              width: 14,
              textAlign: "right",
              flexShrink: 0,
            }}
          >
            {i + 1}
          </Typography>
          <Typography
            sx={{
              fontSize: 11,
              color: "#E6EDF3",
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {opt}
          </Typography>
        </Box>
      ))}
      {hasMore && (
        <Box
          onClick={() => setExpanded((e) => !e)}
          sx={{
            px: 1.5,
            py: 0.6,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            cursor: "pointer",
            bgcolor: "rgba(124,58,237,0.06)",
            "&:hover": { bgcolor: "rgba(124,58,237,0.1)" },
          }}
        >
          {expanded ? (
            <ExpandLessIcon sx={{ fontSize: 13, color: "#9D5CF6" }} />
          ) : (
            <ExpandMoreIcon sx={{ fontSize: 13, color: "#9D5CF6" }} />
          )}
          <Typography sx={{ fontSize: 10, color: "#9D5CF6", fontWeight: 600 }}>
            {expanded ? "Show less" : `+${options.length - 5} more`}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
/**
 * @param {string[]}  currentOptions   – field.options currently on the field
 * @param {string}    currentSourceId  – field.optionSource (persisted source id)
 * @param {Function}  onOptionsChange  – (options: string[]) => void
 * @param {Function}  onSourceChange   – (sourceId: string) => void
 */
export default function SelectOptionsSource({
  currentOptions,
  currentSourceId,
  onOptionsChange,
  onSourceChange,
}) {
  // ── RTK Query lazy hooks ─────────────────────────────────────────────────
  const [fetchCompanies, companiesResult] = useLazyGetCompaniesQuery();
  const [fetchBusinessUnits, businessUnitsResult] =
    useLazyGetBusinessUnitsQuery();
  const [fetchDepartments, departmentsResult] = useLazyGetDepartmentsQuery();
  const [fetchUnits, unitsResult] = useLazyGetUnitsQuery();
  const [fetchSubUnits, subUnitsResult] = useLazyGetSubUnitsQuery();
  const [fetchLocations, locationsResult] = useLazyGetLocationsQuery();
  const [fetchEmployees, employeesResult] = useLazyGetEmployeesQuery();

  // Map hookKey → { fetch, result }
  const API_HOOKS = {
    companies: { fetch: fetchCompanies, result: companiesResult },
    businessUnits: { fetch: fetchBusinessUnits, result: businessUnitsResult },
    departments: { fetch: fetchDepartments, result: departmentsResult },
    units: { fetch: fetchUnits, result: unitsResult },
    subUnits: { fetch: fetchSubUnits, result: subUnitsResult },
    locations: { fetch: fetchLocations, result: locationsResult },
    employees: { fetch: fetchEmployees, result: employeesResult },
  };

  const [fetchStatus, setFetchStatus] = useState("idle"); // idle | loading | success | error
  const [loadedOptions, setLoadedOptions] = useState(currentOptions ?? []);

  const selectedSource = currentSourceId
    ? OPTION_SOURCE_MAP[currentSourceId]
    : null;

  // ── Apply loaded options back to field ──────────────────────────────────
  const applyOptions = useCallback(
    (opts) => {
      setLoadedOptions(opts);
      onOptionsChange(opts);
    },
    [onOptionsChange],
  );

  // ── Fetch logic ──────────────────────────────────────────────────────────
  const doFetch = useCallback(
    async (source) => {
      if (!source) return;

      if (source.type === "static") {
        applyOptions(source.options);
        setFetchStatus("success");
        return;
      }

      // api source
      const hook = API_HOOKS[source.hookKey];
      if (!hook) {
        setFetchStatus("error");
        return;
      }

      setFetchStatus("loading");
      try {
        const result = await hook.fetch(undefined, true).unwrap(); // preferCacheValue = true
        const transformed = source.transform(result);
        applyOptions(transformed);
        setFetchStatus("success");
      } catch {
        setFetchStatus("error");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [applyOptions],
  );

  // Auto-fetch when source changes
  useEffect(() => {
    if (selectedSource) {
      doFetch(selectedSource);
    } else {
      setFetchStatus("idle");
      setLoadedOptions(currentOptions ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSourceId]);

  // ── Source change handler ────────────────────────────────────────────────
  function handleSourceChange(newId) {
    onSourceChange(newId);
    setFetchStatus("idle");
    setLoadedOptions([]);
  }

  const isApi = selectedSource?.type === "api";
  const isStatic = selectedSource?.type === "static";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {/* ── Source selector ── */}
      <Box>
        <Typography sx={{ fontSize: 11, color: "#8B949E", mb: 0.5 }}>
          Options Source
        </Typography>
        <TextField
          select
          fullWidth
          size="small"
          value={currentSourceId ?? ""}
          onChange={(e) => handleSourceChange(e.target.value || null)}
          sx={inputSx}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                sx: {
                  bgcolor: "#161B22",
                  border: "1px solid #30363D",
                  mt: 0.5,
                  maxHeight: 320,
                  "& .MuiListSubheader-root": {
                    bgcolor: "#0D1117",
                    color: "#8B949E",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    lineHeight: "28px",
                    px: 1.5,
                  },
                },
              },
            },
          }}
        >
          <MenuItem value="">
            <em style={{ color: "#8B949E", fontSize: 12 }}>Manual / None</em>
          </MenuItem>

          {OPTION_SOURCE_GROUPS.map((group) => {
            const groupSources = OPTION_SOURCES.filter(
              (s) => s.group === group,
            );
            return [
              <ListSubheader key={`g-${group}`} disableSticky>
                {group.toUpperCase()}
              </ListSubheader>,
              ...groupSources.map((src) => (
                <MenuItem
                  key={src.id}
                  value={src.id}
                  sx={{ fontSize: 12, color: "#E6EDF3", pl: 2, gap: 1 }}
                >
                  {src.type === "api" ? (
                    <ApiOutlinedIcon
                      sx={{ fontSize: 13, color: "#7C3AED", flexShrink: 0 }}
                    />
                  ) : (
                    <ListAltOutlinedIcon
                      sx={{ fontSize: 13, color: "#8B949E", flexShrink: 0 }}
                    />
                  )}
                  {src.label}
                </MenuItem>
              )),
            ];
          })}
        </TextField>
      </Box>

      {/* ── Source badge + Refresh (API only) ── */}
      {selectedSource && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 1.25,
            py: 0.75,
            borderRadius: 1,
            bgcolor: isApi ? "rgba(124,58,237,0.07)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${isApi ? "rgba(124,58,237,0.25)" : "#30363D"}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            {isApi ? (
              <ApiOutlinedIcon sx={{ fontSize: 13, color: "#9D5CF6" }} />
            ) : (
              <ListAltOutlinedIcon sx={{ fontSize: 13, color: "#8B949E" }} />
            )}
            <Chip
              label={isApi ? "API" : "Static"}
              size="small"
              sx={{
                height: 16,
                fontSize: 9,
                fontWeight: 700,
                bgcolor: isApi
                  ? "rgba(124,58,237,0.2)"
                  : "rgba(255,255,255,0.07)",
                color: isApi ? "#9D5CF6" : "#8B949E",
                border: "none",
                "& .MuiChip-label": { px: 0.75 },
              }}
            />
            <StatusBadge status={fetchStatus} count={loadedOptions.length} />
          </Box>

          {isApi && (
            <Tooltip title="Re-fetch from API" arrow>
              <span>
                <IconButton
                  size="small"
                  disabled={fetchStatus === "loading"}
                  onClick={() => doFetch(selectedSource)}
                  sx={{
                    p: 0.4,
                    color: "#8B949E",
                    "&:hover": {
                      color: "#9D5CF6",
                      bgcolor: "rgba(124,58,237,0.1)",
                    },
                    "&.Mui-disabled": { color: "#30363D" },
                  }}
                >
                  <RefreshIcon
                    sx={{
                      fontSize: 15,
                      animation:
                        fetchStatus === "loading"
                          ? "spin 1s linear infinite"
                          : "none",
                      "@keyframes spin": {
                        from: { transform: "rotate(0deg)" },
                        to: { transform: "rotate(360deg)" },
                      },
                    }}
                  />
                </IconButton>
              </span>
            </Tooltip>
          )}
        </Box>
      )}

      {/* ── Options preview ── */}
      <Collapse in={loadedOptions.length > 0}>
        <Box>
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 700,
              color: "#8B949E",
              letterSpacing: "0.08em",
              mb: 0.5,
            }}
          >
            PREVIEW
          </Typography>
          <OptionsPreview options={loadedOptions} />
        </Box>
      </Collapse>

      {/* ── Manual mode: textarea fallback when no source is selected ── */}
      {!selectedSource && (
        <>
          <Divider sx={{ borderColor: "#30363D" }} />
          <Box>
            <Typography sx={{ fontSize: 11, color: "#8B949E", mb: 0.5 }}>
              Manual Options{" "}
              <Box component="span" sx={{ color: "#30363D", fontSize: 10 }}>
                (one per line)
              </Box>
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={3}
              maxRows={8}
              size="small"
              placeholder={"Option 1\nOption 2\nOption 3"}
              value={(currentOptions ?? []).join("\n")}
              onChange={(e) => {
                const opts = e.target.value
                  .split("\n")
                  .map((s) => s.trimEnd())
                  .filter(Boolean);
                applyOptions(opts);
              }}
              sx={{
                ...inputSx,
                "& .MuiInputBase-input": {
                  color: "#E6EDF3",
                  fontSize: 12,
                  py: 0.75,
                  px: 1.25,
                },
              }}
            />
            {(currentOptions ?? []).length > 0 && (
              <Typography sx={{ fontSize: 10, color: "#8B949E", mt: 0.5 }}>
                {currentOptions.length} option
                {currentOptions.length !== 1 ? "s" : ""}
              </Typography>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
