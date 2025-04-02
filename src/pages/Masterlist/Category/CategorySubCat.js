import { LanOutlined } from "@mui/icons-material";
import {
  Autocomplete,
  Badge,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";

import React, { useRef } from "react";
import useDisclosure from "../../../hooks/useDisclosure";
import { LoadingButton } from "@mui/lab";

export const CategorySubCat = ({ subCategories }) => {
  const ref = useRef();
  const { open, onToggle, onClose } = useDisclosure();

  const onCloseAction = () => {
    onClose();
  };

  return (
    <div>
      <IconButton ref={ref} onClick={onToggle}>
        <Tooltip title="View Permissions">
          <Badge badgeContent={subCategories.length} color="primary">
            <LanOutlined />
          </Badge>
        </Tooltip>
      </IconButton>

      {subCategories.length !== 0 ? (
        <Dialog fullWidth maxWidth="xs" open={open}>
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "center",
              paddingTop: 0,
              paddingBottom: 0,
              marginBlockEnd: "5.28px",
              fontSize: "18px",
              fontWeight: 700,
              color: "#48BB78",
            }}
          >
            View Sub Category
          </DialogTitle>

          <DialogContent>
            <Stack sx={{ padding: "5px", gap: 1.5 }}>
              <Autocomplete
                multiple
                options={subCategories || []}
                defaultValue={subCategories}
                getOptionLabel={(option) => option.subCategory_Description}
                readOnly
                renderInput={(params) => (
                  <TextField {...params} label="Sub Category" />
                )}
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <LoadingButton variant="text" onClick={onCloseAction} size="small">
              Close
            </LoadingButton>
          </DialogActions>
        </Dialog>
      ) : (
        <Menu
          anchorEl={ref.current}
          open={open}
          onClose={onToggle}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <List dense>
            <ListItem>
              <ListItemText primary="No sub unit." sx={{ color: "#D27D0E" }} />
            </ListItem>
          </List>
        </Menu>
      )}
    </div>
  );
};
