import React from "react";

const AssetTagUpdate = () => {
  return (
    <div>
      {/* Asset Tags (Upcoming update) */}
      <Stack sx={sx.twoColsBox}>
        <Stack
          direction={isScreenSmall ? "column" : "row"}
          sx={{ width: "100%", gap: 1 }}
        >
          {/*  Asset Tag*/}
          <Stack sx={{ width: isScreenSmall ? "100%" : "50%" }}>
            <Typography sx={{ fontSize: "13px" }}>Asset Tag</Typography>
            <Controller
              control={control}
              name="AssetTag"
              render={({ field: { ref, value, onChange } }) => {
                return (
                  <TextField
                    inputRef={ref}
                    size="small"
                    value={value}
                    placeholder="Enter Asset Tag"
                    onChange={onChange}
                    error={!!errors.AssetTag}
                    sx={{
                      width: "100%",
                    }}
                    InputProps={{
                      style: {
                        fontSize: "13px",
                      },
                    }}
                    InputLabelProps={{
                      style: {
                        fontSize: "13px",
                      },
                    }}
                    autoComplete="off"
                  />
                );
              }}
            />
            {errors.AssetTag && (
              <Typography color="error" sx={{ fontSize: "12px" }}>
                {errors.AssetTag.message}
              </Typography>
            )}
          </Stack>

          {/* Ongoing 1 */}
          <Stack sx={{ width: isScreenSmall ? "100%" : "50%" }}>
            <Typography sx={{ fontSize: "13px" }}>Ongoing Update</Typography>
            <Controller
              control={control}
              name=""
              render={({ field: { ref, value, onChange } }) => {
                return (
                  <TextField
                    inputRef={ref}
                    size="small"
                    value={value}
                    placeholder="Ongoing Update"
                    onChange={onChange}
                    // error={!!errors.AssetTag}
                    sx={{
                      width: "100%",
                    }}
                    InputProps={{
                      style: {
                        fontSize: "13px",
                      },
                    }}
                    InputLabelProps={{
                      style: {
                        fontSize: "13px",
                      },
                    }}
                    autoComplete="off"
                    disabled
                  />
                );
              }}
            />
            {/* {errors.AssetTag && (
                                <Typography color="error" sx={{ fontSize: "12px" }}>
                                  {errors.AssetTag.message}
                                </Typography>
                              )} */}
          </Stack>
        </Stack>
      </Stack>

      <Stack sx={sx.twoColsBox}>
        <Stack
          direction={isScreenSmall ? "column" : "row"}
          sx={{ width: "100%", gap: 1 }}
        >
          {/*  Ongoing 2*/}
          <Stack sx={{ width: isScreenSmall ? "100%" : "50%" }}>
            <Typography sx={{ fontSize: "13px" }}>Ongoing Update</Typography>
            <Controller
              control={control}
              name="AssetTag"
              render={({ field: { ref, value, onChange } }) => {
                return (
                  <TextField
                    inputRef={ref}
                    size="small"
                    value={value}
                    placeholder="Ongoing Update"
                    onChange={onChange}
                    error={!!errors.AssetTag}
                    sx={{
                      width: "100%",
                    }}
                    InputProps={{
                      style: {
                        fontSize: "13px",
                      },
                    }}
                    InputLabelProps={{
                      style: {
                        fontSize: "13px",
                      },
                    }}
                    autoComplete="off"
                    disabled
                  />
                );
              }}
            />
            {/* {errors.AssetTag && (
                                <Typography color="error" sx={{ fontSize: "12px" }}>
                                  {errors.AssetTag.message}
                                </Typography>
                              )} */}
          </Stack>

          {/* Ongoing 3 */}
          <Stack sx={{ width: isScreenSmall ? "100%" : "50%" }}>
            <Typography sx={{ fontSize: "13px" }}>Ongoing Update</Typography>
            <Controller
              control={control}
              name=""
              render={({ field: { ref, value, onChange } }) => {
                return (
                  <TextField
                    inputRef={ref}
                    size="small"
                    value={value}
                    placeholder="Ongoing Update"
                    onChange={onChange}
                    // error={!!errors.AssetTag}
                    sx={{
                      width: "100%",
                    }}
                    InputProps={{
                      style: {
                        fontSize: "13px",
                      },
                    }}
                    InputLabelProps={{
                      style: {
                        fontSize: "13px",
                      },
                    }}
                    autoComplete="off"
                    disabled
                  />
                );
              }}
            />
            {/* {errors.AssetTag && (
                                <Typography color="error" sx={{ fontSize: "12px" }}>
                                  {errors.AssetTag.message}
                                </Typography>
                              )} */}
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};

export default AssetTagUpdate;
