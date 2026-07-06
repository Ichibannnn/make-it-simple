import {
  Grid,
  IconButton,
  OutlinedInput,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import { global } from "../../styles/global";
import { theme } from "../../theme/theme";
import { checklistData } from "../../data";
import { Inventory, Search } from "@mui/icons-material";

import useDebounce from "../../hooks/useDebounce";
import { checklistStyles } from "./styles/checklistStyles";
import { useGetChecklistsQuery } from "../../features/api masterlist/checklist_management/checklistManagementApi";

import CreateCard from "./CreateCard";
import ChecklistCards from "./ChecklistCards";
import ChecklistCardSkeleton from "./ChecklistCardSkeleton";

const ChecklistManagementPage = () => {
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));

  const [status, setStatus] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  const queryParams = {
    Status: status,
    Search: search,
  };

  const { data, isLoading, isFetching, isSuccess } =
    useGetChecklistsQuery(queryParams);

  const renderSkeleton = () => {
    const renderSkeletonRows = () => {
      return Array.from(new Array(9)).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
          <ChecklistCardSkeleton />
        </Grid>
      ));
    };
    return renderSkeletonRows();
  };

  return (
    <Stack sx={global.layoutContainer}>
      <Stack mb={1}>
        <Stack justifyContent="space-between" sx={global.headerContainer}>
          <Stack>
            <Typography variant={isScreenSmall ? "h5" : "h4"}>
              Checklist Management
            </Typography>
            <Typography color="text.secondary" fontSize="small"></Typography>
          </Stack>
          <Stack />
        </Stack>

        <Stack mt={4}>
          <Stack sx={checklistStyles.searchContainer}>
            <Stack direction="row">
              <OutlinedInput
                size="small"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search checklist title..."
                startAdornment={<Search sx={global.searchIcon} />}
                sx={checklistStyles.customSearch}
              />

              <IconButton
                onClick={() => setStatus(!status)}
                title={!status ? "Active" : "Inactive"}
              >
                <Inventory sx={checklistStyles.icons} />
              </IconButton>
              {/* <IconButton>
                <FilterList sx={checklistStyles.icons} />
              </IconButton> */}
            </Stack>
          </Stack>

          <Stack mt={6}>
            {/* Form Grid */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <CreateCard />
              </Grid>

              {/* {(isLoading || isFetching) && renderSkeleton()}

              {isSuccess &&
                !isLoading &&
                !isFetching &&
                data?.value?.checklistManagement?.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                    <ChecklistCards data={item} />
                  </Grid>
                ))} */}

              {checklistData?.value?.checklistManagement?.map((item, index) => (
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
