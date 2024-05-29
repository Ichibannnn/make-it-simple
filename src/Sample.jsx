<TableRow>
  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
    <Collapse in={openCollapse[item.requestTransactionId]} timeout="auto" unmountOnExit>
      <Box sx={{ margin: 1 }}>
        <Typography
          component="div"
          sx={{
            color: theme.palette.text.main,
            fontSize: "17px",
            fontWeight: 600,
          }}
        >
          <Stack direction="row" gap={1} alignItems="center">
            TICKETS
          </Stack>
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  color: "#EDF2F7",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
                align="center"
              >
                <IconButton size="small" onClick={() => handleCollapseToggle(item.requestTransactionId)}>
                  {openCollapse[item.requestTransactionId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </IconButton>
              </TableCell>

              <TableCell
                sx={{
                  background: "#1C2536",
                  color: "#EDF2F7",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
                align="center"
              >
                TICKET NO.
              </TableCell>

              <TableCell
                sx={{
                  background: "#1C2536",
                  color: "#EDF2F7",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
              >
                TICKET DESCRIPTION
              </TableCell>

              <TableCell
                sx={{
                  background: "#1C2536",
                  color: "#EDF2F7",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
              >
                <Stack direction="row" alignItems="center" gap={0.5}>
                  <AccessTimeOutlined sx={{ fontSize: "16px" }} />
                  START DATE
                </Stack>
              </TableCell>

              <TableCell
                sx={{
                  background: "#1C2536",
                  color: "#EDF2F7",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
              >
                <Stack direction="row" alignItems="center" gap={0.5}>
                  <AccessTimeOutlined sx={{ fontSize: "16px" }} />
                  TARGET DATE
                </Stack>
              </TableCell>

              <TableCell
                sx={{
                  background: "#1C2536",
                  color: "#EDF2F7",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
              >
                REMARKS
              </TableCell>

              <TableCell
                sx={{
                  background: "#1C2536",
                  color: "#EDF2F7",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
              >
                STATUS
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {item?.openTickets?.map((subItem) => (
              <TableRow key={subItem.ticketConcernId}>
                <TableCell
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "14px",
                    fontWeight: 500,
                    maxWidth: "700px",
                  }}
                  align="center"
                >
                  {subItem.ticketConcernId}
                </TableCell>

                <TableCell
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "14px",
                    fontWeight: 500,
                    maxWidth: "700px",
                  }}
                >
                  {subItem.concern_Description}
                </TableCell>

                <TableCell
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "14px",
                    fontWeight: 500,
                    maxWidth: "700px",
                  }}
                >
                  {moment(subItem.start_Date).format("YYYY-MM-DD")}
                </TableCell>

                <TableCell
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "14px",
                    fontWeight: 500,
                    maxWidth: "700px",
                  }}
                >
                  {moment(subItem.target_Date).format("YYYY-MM-DD")}
                </TableCell>

                {/* <TableCell
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "14px",
                  fontWeight: 500,
                  maxWidth: "700px",
                }}
              >
                {subItem.dateClose}
              </TableCell> */}

                <TableCell
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "14px",
                    fontWeight: 500,
                    maxWidth: "700px",
                  }}
                >
                  <Chip
                    variant="filled"
                    size="small"
                    label={subItem.remarks === "On-Time" ? "On-Time" : subItem.remarks === "Delayed" ? "Delayed" : ""}
                    sx={{
                      backgroundColor: subItem.remarks === "On-Time" ? "#00913c" : subItem.remarks === "Delayed" ? "#a32421" : "transparent",
                      color: "#ffffffde",
                      borderRadius: "none",
                    }}
                  />
                </TableCell>

                <TableCell
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "14px",
                    fontWeight: 500,
                    maxWidth: "700px",
                  }}
                >
                  <Chip
                    variant="filled"
                    size="small"
                    label={subItem.ticket_Status === "Open Ticket" ? "Open" : "Pending"}
                    sx={{
                      backgroundColor: subItem.ticket_Status === "Open Ticket" ? "#00913c" : "#ec9d29",
                      color: "#ffffffde",
                      borderRadius: "none",
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Stack sx={{ alignItems: "end", marginTop: 2 }}>
          {/* <Stack /> */}
          <Button variant="contained" color="primary" onClick={() => handleAddTicketToggle(item.requestTransactionId)}>
            {addTicketForm[item.requestTransactionId] ? "Cancel" : "Add Ticket"}
          </Button>
        </Stack>

        {addTicketForm[item.requestTransactionId] && (
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
            <Controller
              name="ticketDescription"
              control={control}
              render={({ field: { ref, value, onChange } }) => {
                return <TextField inputRef={ref} size="small" value={value} label="Ticket Description" onChange={onChange} autoComplete="off" fullWidth sx={{ mb: 2 }} />;
              }}
            />
            {/* 
          <Controller
            control={control}
            name=""
            render={({ field: { ref, value, onChange } }) => {
              return (
                <TextField
                  inputRef={ref}
                  size="medium"
                  value={value}
                  placeholder="Ex. System Name - Concern"
                  onChange={onChange}
                  sx={{
                    width: "80%",
                  }}
                  autoComplete="off"
                  rows={6}
                  multiline
                />
              );
            }}
          /> */}

            <Stack direction="row" gap={1}>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    size="small"
                    label="Start Date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.startDate}
                    helperText={errors.startDate?.message}
                    sx={{ mb: 2 }}
                  />
                )}
              />

              <Controller
                name="targetDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    size="small"
                    label="Target Date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.targetDate}
                    helperText={errors.targetDate?.message}
                    sx={{ mb: 2 }}
                  />
                )}
              />
            </Stack>

            <Stack sx={{ alignItems: "end" }}>
              <Button type="submit" variant="contained" color="primary" disabled={!watch("ticketDescription")}>
                Save
              </Button>
            </Stack>
          </Box>
        )}
      </Box>
    </Collapse>
  </TableCell>
</TableRow>;
