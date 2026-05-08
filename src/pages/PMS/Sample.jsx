import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Drawer,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  IconButton,
  Typography,
  Box,
  Stack,
  FormHelperText,
  Divider,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";

// ─────────────────────────────────────────────
// REUSABLE TABLE
//
// New prop:
//   renderRowActions(row) — optional render prop.
//   Parent returns extra <IconButton> elements per row.
//   Edit button is always rendered by the table itself.
// ─────────────────────────────────────────────

function ReusableTable({
  columns,
  rows,
  onAdd,
  onEdit,
  onOpenEdit,
  renderForm,
  renderRowActions, // ← NEW: optional extra action buttons per row
  schema,
  dialogTitle,
  drawerWidth = 400,
}) {
  const [open, setOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleOpenAdd = () => {
    setEditingRow(null);
    reset({});
    setOpen(true);
  };

  const handleOpenEdit = (row) => {
    setEditingRow(row);
    reset({});
    onOpenEdit ? onOpenEdit(row, setValue) : Object.entries(row).forEach(([k, v]) => setValue(k, v));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingRow(null);
    reset({});
  };

  const internalSubmit = handleSubmit((data) => {
    editingRow ? onEdit?.({ ...editingRow, ...data }) : onAdd?.(data);
    handleClose();
  });

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={700}>
          {dialogTitle}
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd} sx={{ borderRadius: 2 }}>
          Add New
        </Button>
      </Stack>

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: "primary.main" }}>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.field} sx={{ color: "white", fontWeight: 700 }}>
                  {col.headerName}
                </TableCell>
              ))}
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow key={row.id ?? idx} hover>
                {columns.map((col) => (
                  <TableCell key={col.field}>{col.renderCell ? col.renderCell(row[col.field], row) : row[col.field]}</TableCell>
                ))}

                {/* Actions cell — Edit is always present, extra actions injected by parent */}
                <TableCell>
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Edit">
                      <IconButton size="small" color="primary" onClick={() => handleOpenEdit(row)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {/* ✅ Parent injects its own buttons here */}
                    {renderRowActions?.(row)}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Drawer anchor="right" open={open} onClose={handleClose} PaperProps={{ sx: { width: drawerWidth, display: "flex", flexDirection: "column" } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 3, py: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            {editingRow ? `Edit ${dialogTitle}` : `Add ${dialogTitle}`}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>

        <Divider />

        <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 3 }}>
          <Stack spacing={2}>{renderForm(control, errors)}</Stack>
        </Box>

        <Divider />

        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={internalSubmit} variant="contained">
            {editingRow ? "Update" : "Save"}
          </Button>
        </Stack>
      </Drawer>
    </Box>
  );
}

// ─────────────────────────────────────────────
// USER ACCOUNT PAGE  (has Archive button)
// ─────────────────────────────────────────────
const accountSchema = yup.object({
  name: yup.string().required("Full name is required").min(3, "At least 3 characters"),
  email: yup.string().required("Email is required").email("Must be a valid email"),
  status: yup.string().required("Status is required").oneOf(["Active", "Inactive"]),
});

const ACCOUNT_COLUMNS = [
  { field: "name", headerName: "Full Name" },
  { field: "email", headerName: "Email" },
  {
    field: "status",
    headerName: "Status",
    renderCell: (val) => <Chip label={val} size="small" color={val === "Active" ? "success" : "default"} />,
  },
  {
    field: "archived",
    headerName: "Archived",
    renderCell: (val) => (val ? <Chip label="Archived" size="small" color="warning" /> : <Chip label="Active" size="small" variant="outlined" />),
  },
];

function UserAccountPage() {
  const [rows, setRows] = useState([
    { id: 1, name: "Maria Santos", email: "maria@example.com", status: "Active", archived: false },
    { id: 2, name: "Juan dela Cruz", email: "juan@example.com", status: "Inactive", archived: false },
  ]);

  const handleAdd = (data) => setRows((p) => [...p, { id: Date.now(), archived: false, ...data }]);
  const handleEdit = (updated) => setRows((p) => p.map((r) => (r.id === updated.id ? updated : r)));

  // ✅ Toggle archived flag — no drawer needed
  const handleArchive = (row) => setRows((p) => p.map((r) => (r.id === row.id ? { ...r, archived: !r.archived } : r)));

  const handleOpenEdit = (row, setValue) => {
    setValue("name", row.name);
    setValue("email", row.email);
    setValue("status", row.status);
  };

  // ✅ Archive button only exists in this page
  const renderRowActions = (row) => (
    <Tooltip title={row.archived ? "Unarchive" : "Archive"}>
      <IconButton size="small" color={row.archived ? "warning" : "default"} onClick={() => handleArchive(row)}>
        {row.archived ? <UnarchiveIcon fontSize="small" /> : <ArchiveIcon fontSize="small" />}
      </IconButton>
    </Tooltip>
  );

  const renderAccountForm = (control, errors) => (
    <>
      <Controller
        name="name"
        control={control}
        defaultValue=""
        render={({ field }) => <TextField {...field} label="Full Name" fullWidth error={!!errors.name} helperText={errors.name?.message} />}
      />
      <Controller
        name="email"
        control={control}
        defaultValue=""
        render={({ field }) => <TextField {...field} label="Email" fullWidth error={!!errors.email} helperText={errors.email?.message} />}
      />
      <Controller
        name="status"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.status}>
            <InputLabel>Status</InputLabel>
            <Select {...field} label="Status">
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
            <FormHelperText>{errors.status?.message}</FormHelperText>
          </FormControl>
        )}
      />
    </>
  );

  return (
    <ReusableTable
      dialogTitle="User Account"
      columns={ACCOUNT_COLUMNS}
      rows={rows}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onOpenEdit={handleOpenEdit}
      renderForm={renderAccountForm}
      renderRowActions={renderRowActions} // ← archive injected here
      schema={accountSchema}
    />
  );
}

// ─────────────────────────────────────────────
// USER ROLE PAGE  (no archive button)
// ─────────────────────────────────────────────
const roleSchema = yup.object({
  roleName: yup.string().required("Role name is required").min(2, "At least 2 characters"),
  description: yup.string().required("Description is required").max(200, "Max 200 characters"),
  permissions: yup.array().of(yup.string()).min(1, "Select at least one permission"),
});

const ROLE_COLUMNS = [
  { field: "roleName", headerName: "Role Name" },
  { field: "description", headerName: "Description" },
  {
    field: "permissions",
    headerName: "Permissions",
    renderCell: (val) => (
      <Stack direction="row" spacing={0.5} flexWrap="wrap">
        {(val ?? []).map((p) => (
          <Chip key={p} label={p} size="small" color="primary" variant="outlined" />
        ))}
      </Stack>
    ),
  },
];

const ALL_PERMISSIONS = ["Read", "Write", "Delete", "Admin"];

function UserRolePage() {
  const [rows, setRows] = useState([
    { id: 1, roleName: "Admin", description: "Full access", permissions: ["Read", "Write", "Delete", "Admin"] },
    { id: 2, roleName: "Viewer", description: "Read-only role", permissions: ["Read"] },
  ]);

  const handleAdd = (data) => setRows((p) => [...p, { id: Date.now(), ...data }]);
  const handleEdit = (updated) => setRows((p) => p.map((r) => (r.id === updated.id ? updated : r)));

  const handleOpenEdit = (row, setValue) => {
    setValue("roleName", row.roleName);
    setValue("description", row.description);
    setValue("permissions", row.permissions ?? []);
  };

  const renderRoleForm = (control, errors) => (
    <>
      <Controller
        name="roleName"
        control={control}
        defaultValue=""
        render={({ field }) => <TextField {...field} label="Role Name" fullWidth error={!!errors.roleName} helperText={errors.roleName?.message} />}
      />
      <Controller
        name="description"
        control={control}
        defaultValue=""
        render={({ field }) => <TextField {...field} label="Description" fullWidth multiline rows={3} error={!!errors.description} helperText={errors.description?.message} />}
      />
      <Controller
        name="permissions"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.permissions}>
            <InputLabel>Permissions</InputLabel>
            <Select
              {...field}
              multiple
              label="Permissions"
              renderValue={(selected) => (
                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                  {selected.map((v) => (
                    <Chip key={v} label={v} size="small" />
                  ))}
                </Stack>
              )}
            >
              {ALL_PERMISSIONS.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.permissions?.message}</FormHelperText>
          </FormControl>
        )}
      />
    </>
  );

  return (
    <ReusableTable
      dialogTitle="User Role"
      columns={ROLE_COLUMNS}
      rows={rows}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onOpenEdit={handleOpenEdit}
      renderForm={renderRoleForm}
      // renderRowActions not passed → only Edit button appears
      schema={roleSchema}
    />
  );
}

// ─────────────────────────────────────────────
// APP SHELL
// ─────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("accounts");
  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: "auto" }}>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        Admin Panel
      </Typography>
      <Stack direction="row" spacing={1} mb={3}>
        {["accounts", "roles"].map((t) => (
          <Button key={t} variant={tab === t ? "contained" : "outlined"} onClick={() => setTab(t)} sx={{ textTransform: "capitalize", borderRadius: 2 }}>
            {t === "accounts" ? "User Accounts" : "User Roles"}
          </Button>
        ))}
      </Stack>
      {tab === "accounts" ? <UserAccountPage /> : <UserRolePage />}
    </Box>
  );
}
