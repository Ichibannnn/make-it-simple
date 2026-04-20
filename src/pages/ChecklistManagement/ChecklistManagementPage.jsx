import { Box, Grid, IconButton, InputAdornment, OutlinedInput, Stack, TextField, Typography, useMediaQuery } from "@mui/material";
import { global } from "../../styles/global";
import { theme } from "../../theme/theme";
import { checklistData } from "../../data";
import { Archive, Filter, FilterList, Inventory, Search } from "@mui/icons-material";
import { checklistStyles } from "./styles/checklistStyles";

import CreateCard from "./CreateCard";
import ChecklistCards from "./ChecklistCards";

const ChecklistManagementPage = () => {
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));

  console.log("Checklist: ", checklistData);

  return (
    <Stack sx={global.layoutContainer}>
      <Stack mb={1}>
        <Stack justifyContent="space-between" sx={global.headerContainer}>
          <Stack>
            <Typography variant={isScreenSmall ? "h5" : "h4"}>Checklist Management</Typography>
            <Typography color="text.secondary" fontSize="small">
              Manage checklists based from the PMS Type
            </Typography>
          </Stack>

          <Stack />
        </Stack>

        <Stack mt={4}>
          <Stack sx={checklistStyles.searchContainer}>
            <Stack direction="row">
              <OutlinedInput
                size="small"
                // value={searchValue}
                // onChange={(e) => dispatch(setSearchValue(e.target.value))}
                placeholder="Search checklist title..."
                startAdornment={<Search sx={global.searchIcon} />}
                sx={checklistStyles.customSearch}
              />

              <IconButton>
                <Inventory sx={checklistStyles.icons} />
              </IconButton>
              <IconButton>
                <FilterList sx={checklistStyles.icons} />
              </IconButton>
            </Stack>
          </Stack>

          <Stack mt={6}>
            {/* Form Grid */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <CreateCard onClick={() => console.log("create new form")} />
              </Grid>

              {checklistData?.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                  <ChecklistCards data={item} />
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ChecklistManagementPage;
