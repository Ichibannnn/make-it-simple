import React from "react";

const TestIssueTicketDetails = () => {
  return (
    <div>
      {/* Ticket Details */}
      {isScreenSmall ? (
        <>
          <Stack
            sx={{
              width: "100%",
              padding: 1,
              border: "1px solid #2D3748",
              borderRadius: "20px 20px 0 0",
            }}
          >
            <Box sx={{ ml: 2 }}>
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: "500",
                  fontSize: "12px",
                }}
              >
                Ticket Number:
              </Typography>
            </Box>
            
            <Box sx={{ ml: 2 }}>
              <Typography
                sx={{
                  color: theme.palette.text.main,
                  fontWeight: "500",
                  fontSize: "12px",
                }}
              >{`${moment(data?.created_At).format("YYYY")}-${data?.ticketConcernId}`}</Typography>
            </Box>
          </Stack>

          <Stack
            sx={{
              width: "100%",
              padding: 1,
              border: "1px solid #2D3748",
            }}
          >
            <Box sx={{ ml: 2 }}>
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: "500",
                  fontSize: "12px",
                }}
              >
                Request Type:
              </Typography>
            </Box>
            <Box sx={{ ml: 2 }}>
              <Typography
                sx={{
                  color: theme.palette.text.main,
                  fontWeight: "500",
                  fontSize: "12px",
                }}
              >
                {data?.request_Type}
              </Typography>
            </Box>
          </Stack>

          {data?.request_Type === "Rework" && (
            <Stack
              sx={{
                width: "100%",
                padding: 1,
                border: "1px solid #2D3748",
              }}
            >
              <Box sx={{ ml: 2 }}>
                <Typography
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: "500",
                    fontSize: "12px",
                  }}
                >
                  Rework Ticket #:
                </Typography>
              </Box>
              <Box sx={{ ml: 2 }}>
                <Typography
                  sx={{
                    color: theme.palette.text.main,
                    fontWeight: "500",
                    fontSize: "12px",
                  }}
                >{`${data?.backJobId} - ${data?.back_Job_Concern}`}</Typography>
              </Box>
            </Stack>
          )}

          <Stack
            sx={{
              width: "100%",
              padding: 1,
              border: "1px solid #2D3748",
            }}
          >
            <Box sx={{ ml: 2 }}>
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: "500",
                  fontSize: "12px",
                }}
              >
                Department:
              </Typography>
            </Box>
            <Box sx={{ ml: 2 }}>
              <Typography
                sx={{
                  color: theme.palette.text.main,
                  fontWeight: "500",
                  fontSize: "12px",
                }}
              >{`${data?.department_Code} - ${data?.department_Name}`}</Typography>
            </Box>
          </Stack>

          <Stack
            sx={{
              width: "100%",
              padding: 1,
              border: "1px solid #2D3748",
            }}
          >
            <Box sx={{ ml: 2 }}>
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: "500",
                  fontSize: "12px",
                }}
              >
                Channel:
              </Typography>
            </Box>
            <Box sx={{ ml: 2 }}>
              <Typography
                sx={{
                  color: theme.palette.text.main,
                  fontWeight: "500",
                  fontSize: "12px",
                }}
              >
                {data?.channel_Name}
              </Typography>
            </Box>
          </Stack>

          <Stack
            sx={{
              width: "100%",
              padding: 1,
              border: "1px solid #2D3748",
            }}
          >
            <Box sx={{ ml: 2 }}>
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: "500",
                  fontSize: "12px",
                }}
              >
                Category:
              </Typography>
            </Box>

            {data?.getOpenTicketCategories?.length > 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  ml: 1,
                }}
              >
                {data?.getOpenTicketCategories?.map((item, i) => (
                  <Box key={i}>
                    <Chip
                      variant="filled"
                      size="small"
                      label={item.category_Description ? item.category_Description : "-"}
                      sx={{
                        backgroundColor: theme.palette.bgForm.black_1,
                        fontSize: "10px",
                        color: "#ffffff",
                        borderRadius: "none",
                        maxWidth: "300px",
                      }}
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ ml: 2 }}>
                <Typography
                  sx={{
                    color: theme.palette.text.main,
                    fontWeight: "500",
                    fontSize: "12px",
                  }}
                >
                  -
                </Typography>
              </Box>
            )}
          </Stack>

          <Stack
            sx={{
              width: "100%",
              padding: 1,
              border: "1px solid #2D3748",
            }}
          >
            <Box sx={{ ml: 2 }}>
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: "500",
                  fontSize: "12px",
                }}
              >
                Sub Category:
              </Typography>
            </Box>

            {data?.getOpenTicketSubCategories?.length > 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  ml: 1,
                }}
              >
                {data?.getOpenTicketSubCategories?.map((item, i) => (
                  <Box key={i}>
                    <Chip
                      variant="filled"
                      size="small"
                      label={item.subCategory_Description ? item.subCategory_Description : "-"}
                      sx={{
                        backgroundColor: theme.palette.bgForm.black_1,
                        fontSize: "10px",
                        color: "#ffffff",
                        borderRadius: "none",
                        maxWidth: "300px",
                      }}
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ ml: 2 }}>
                <Typography
                  sx={{
                    color: theme.palette.text.main,
                    fontWeight: "500",
                    fontSize: "12px",
                  }}
                >
                  -
                </Typography>
              </Box>
            )}
          </Stack>

          {/* Concern Category*/}
          {(data?.ticket_Status === "For Closing Ticket" || data?.ticket_Status === "For Confirmation" || data?.ticket_Status === "Closed") && (
            <Stack
              sx={{
                width: "100%",
                padding: 1,
                border: "1px solid #2D3748",
              }}
            >
              <Box sx={{ ml: 2 }}>
                <Typography
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: "500",
                    fontSize: "12px",
                  }}
                >
                  Concern Category:
                </Typography>
              </Box>

              <Box sx={{ ml: 2 }}>
                <Typography
                  sx={{
                    color: theme.palette.text.main,
                    fontWeight: "500",
                    fontSize: "12px",
                  }}
                >
                  {data?.getForClosingTickets?.[0]?.categoryConcernName ? data?.getForClosingTickets?.[0]?.categoryConcernName : "-"}
                </Typography>
              </Box>
            </Stack>
          )}

          <Stack sx={{ padding: 1, border: "1px solid #2D3748" }}>
            <Box sx={{ ml: 2 }}>
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: "500",
                  fontSize: "12px",
                }}
              >
                Assigned to:
              </Typography>
            </Box>

            <Box sx={{ ml: 2 }}>
              <Typography
                sx={{
                  color: theme.palette.text.main,
                  fontWeight: "500",
                  fontSize: "12px",
                }}
              >
                {data?.issue_Handler}
              </Typography>
            </Box>
          </Stack>

          {/* For OnHold Remarks */}
          {data?.ticket_Status === "For On-Hold" && (
            <Stack
              sx={{
                width: "100%",
                padding: 1,
                border: "1px solid #2D3748",
              }}
            >
              <Box sx={{ ml: 2 }}>
                <Typography
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: "500",
                    fontSize: "12px",
                  }}
                >
                  Hold Reason:
                </Typography>
              </Box>

              <Box sx={{ ml: 2 }}>
                <Typography
                  sx={{
                    color: theme.palette.text.main,
                    fontWeight: "500",
                    fontSize: "12px",
                    wordBreak: "break-word",
                  }}
                >
                  {data?.getForOnHolds?.[0]?.reason}
                </Typography>
              </Box>
            </Stack>
          )}

          {/* OnHold Remarks */}
          {data?.ticket_Status === "On-Hold" && (
            <Stack
              sx={{
                width: "100%",
                padding: 1,
                border: "1px solid #2D3748",
              }}
            >
              <Box sx={{ ml: 2 }}>
                <Typography
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: "500",
                    fontSize: "12px",
                  }}
                >
                  On Hold Reason:
                </Typography>
              </Box>

              <Box sx={{ ml: 2 }}>
                <Typography
                  sx={{
                    color: theme.palette.text.main,
                    fontWeight: "500",
                    fontSize: "12px",
                    wordBreak: "break-word",
                  }}
                >
                  {data?.getOnHolds?.[0]?.reason}
                </Typography>
              </Box>
            </Stack>
          )}

          {/* Transfer Remarks */}
          {data?.ticket_Status === "For Transfer" && (
            <Stack
              sx={{
                width: "100%",
                padding: 1,
                border: "1px solid #2D3748",
              }}
            >
              <Box sx={{ ml: 2 }}>
                <Typography
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: "500",
                    fontSize: "12px",
                  }}
                >
                  Transfer Remarks:
                </Typography>
              </Box>

              <Box sx={{ ml: 2 }}>
                <Typography
                  sx={{
                    color: theme.palette.text.main,
                    fontWeight: "500",
                    fontSize: "12px",
                    wordBreak: "break-word",
                  }}
                >
                  {data?.getForTransferTickets?.[0]?.transfer_Remarks}
                </Typography>
              </Box>
            </Stack>
          )}

          {/* Transfer Approval Remarks */}
          {data?.ticket_Status === "Transfer Approval" && (
            <Stack
              sx={{
                width: "100%",
                padding: 1,
                border: "1px solid #2D3748",
              }}
            >
              <Box sx={{ ml: 2 }}>
                <Typography
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: "500",
                    fontSize: "12px",
                  }}
                >
                  Transfer Remarks:
                </Typography>
              </Box>

              <Box sx={{ ml: 2 }}>
                <Typography
                  sx={{
                    color: theme.palette.text.main,
                    fontWeight: "500",
                    fontSize: "12px",
                    wordBreak: "break-word",
                  }}
                >
                  {data?.transferApprovalTickets?.[0]?.transfer_Remarks}
                </Typography>
              </Box>
            </Stack>
          )}

          <Stack
            sx={{
              width: "100%",
              padding: 1,
              border: "1px solid #2D3748",
            }}
          >
            <Box sx={{ ml: 2 }}>
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: "500",
                  fontSize: "12px",
                }}
              >
                Date Needed:
              </Typography>
            </Box>

            <Box sx={{ ml: 2 }}>
              <Typography
                sx={{
                  color: theme.palette.text.main,
                  fontWeight: "500",
                  fontSize: "12px",
                }}
              >
                {data?.date_Needed ? moment(data?.date_Needed).format("LL") : "--"}
              </Typography>
            </Box>
          </Stack>

          <Stack
            sx={{
              width: "100%",
              padding: 1,
              border: "1px solid #2D3748",
            }}
          >
            <Box sx={{ ml: 2 }}>
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: "500",
                  fontSize: "12px",
                }}
              >
                Target Date:
              </Typography>
            </Box>

            <Box sx={{ ml: 2 }}>
              <Typography
                sx={{
                  color: theme.palette.text.main,
                  fontWeight: "500",
                  fontSize: "12px",
                }}
              >
                {moment(data?.target_Date).format("LL")}
              </Typography>
            </Box>
          </Stack>

          {/* Closing Date with Remarks */}
          {(channelNameValidation === "HMU - IT Hardware Support (Hardware Concern)" && data?.ticket_Status === "") ||
            (channelNameValidation === "HMU - IT Hardware Support (Hardware Concern)" && data?.ticket_Status === "For Closing Ticket") ||
            (channelNameValidation === "HMU - IT Hardware Support (Hardware Concern)" && data?.ticket_Status === "Closed") ||
            (channelNameValidation === "HMU - IT Hardware Support (Hardware Concern)" && data?.ticket_Status === "For Confirmation" && (
              <>
                <Stack
                  sx={{
                    width: "100%",
                    padding: 1,
                    border: "1px solid #2D3748",
                  }}
                >
                  <Box sx={{ ml: 2 }}>
                    <Typography
                      sx={{
                        color: theme.palette.text.secondary,
                        fontWeight: "500",
                        fontSize: "12px",
                      }}
                    >
                      Backdate:
                    </Typography>
                  </Box>

                  <Box sx={{ ml: 2 }}>
                    <Typography
                      sx={{
                        color: theme.palette.text.main,
                        fontWeight: "500",
                        fontSize: "12px",
                      }}
                    >
                      {data?.getForClosingTickets?.[0]?.backDate ? moment(data?.getForClosingTickets?.[0]?.backDate).format("LL") : "--"}
                    </Typography>
                  </Box>
                </Stack>

                <Stack
                  sx={{
                    width: "100%",
                    padding: 1,
                    border: "1px solid #2D3748",
                  }}
                >
                  <Box sx={{ ml: 2 }}>
                    <Typography
                      sx={{
                        color: theme.palette.text.secondary,
                        fontWeight: "500",
                        fontSize: "12px",
                      }}
                    >
                      Backdate Remarks:
                    </Typography>
                  </Box>

                  <Box sx={{ ml: 2 }}>
                    <Typography
                      sx={{
                        color: theme.palette.text.main,
                        fontWeight: "500",
                        fontSize: "12px",
                      }}
                    >
                      {data?.getForClosingTickets?.[0]?.backDateRemarks ? data?.getForClosingTickets?.[0]?.backDateRemarks : "--"}
                    </Typography>
                  </Box>
                </Stack>
              </>
            ))}

          <Stack
            sx={{
              width: "100%",
              padding: 1,
              border: "1px solid #2D3748",
            }}
          >
            <Box sx={{ ml: 2 }}>
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: "500",
                  fontSize: "12px",
                }}
              >
                Ticket Description:
              </Typography>
            </Box>
            <Box sx={{ ml: 2 }}>
              <Typography
                sx={{
                  color: theme.palette.text.main,
                  fontWeight: "500",
                  fontSize: "12px",
                  wordBreak: "break-word",
                }}
              >
                {data?.concern_Description?.split("\r\n").map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </Typography>
            </Box>
          </Stack>

          <Stack
            sx={{
              width: "100%",
              padding: 1,
              border: "1px solid #2D3748",
            }}
          >
            <Box sx={{ ml: 2 }}>
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: "500",
                  fontSize: "12px",
                }}
              >
                Notes:
              </Typography>
            </Box>

            <Box sx={{ ml: 2 }}>
              <Typography
                sx={{
                  color: theme.palette.text.main,
                  fontWeight: "500",
                  fontSize: "12px",
                  wordBreak: "break-word",
                }}
              >
                {data?.notes !== null ? data?.notes : "--"}
              </Typography>
            </Box>
          </Stack>

          {/* Resolution */}
          {(data?.ticket_Status === "For Closing Ticket" || data?.ticket_Status === "For Confirmation" || data?.ticket_Status === "Closed") && (
            <Stack
              sx={{
                width: "100%",
                padding: 1,
                border: "1px solid #2D3748",
                borderRadius: "0 0 20px 20px",
              }}
            >
              <Box sx={{ ml: 2 }}>
                <Typography
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: "500",
                    fontSize: "12px",
                  }}
                >
                  Resolution:
                </Typography>
              </Box>

              <Box sx={{ ml: 2 }}>
                <Typography
                  sx={{
                    color: theme.palette.text.main,
                    fontWeight: "500",
                    fontSize: "12px",
                    wordBreak: "break-word",
                  }}
                >
                  {data?.getForClosingTickets?.[0]?.resolution?.split("\r\n").map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
                </Typography>
              </Box>
            </Stack>
          )}
        </>
      ) : (
        <>
          <Stack
            direction="row"
            sx={{
              padding: 1,
              border: "1px solid #2D3748",
              borderRadius: "20px 20px 0 0",
            }}
          >
            <Box sx={{ width: "15%", ml: 2 }}>
              <Typography
                sx={{
                  textAlign: "right",
                  color: theme.palette.text.secondary,
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Ticket Number:
              </Typography>
            </Box>
            <Box sx={{ width: "10%" }} />
            <Box sx={{ width: "75%", ml: 2 }}>
              <Typography
                sx={{
                  color: theme.palette.text.main,
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >{`${moment(data?.created_At).format("YYYY")}-${data?.ticketConcernId}`}</Typography>
            </Box>
          </Stack>

          <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
            <Box sx={{ width: "15%", ml: 2 }}>
              <Typography
                sx={{
                  textAlign: "right",
                  color: theme.palette.text.secondary,
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Request Type:
              </Typography>
            </Box>
            <Box sx={{ width: "10%" }} />
            <Box sx={{ width: "75%", ml: 2 }}>
              <Typography
                sx={{
                  color: theme.palette.text.main,
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                {data?.request_Type}
              </Typography>
            </Box>
          </Stack>

          {data?.request_Type === "Back Job" && (
            <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
              <Box sx={{ width: "15%", ml: 2 }}>
                <Typography
                  sx={{
                    textAlign: "right",
                    color: theme.palette.text.secondary,
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  Rework Ticket Number:
                </Typography>
              </Box>
              <Box sx={{ width: "10%" }} />
              <Box sx={{ width: "75%", ml: 2 }}>
                <Typography
                  sx={{
                    color: theme.palette.text.main,
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >{`${data?.backJobId} - ${data?.back_Job_Concern}`}</Typography>
              </Box>
            </Stack>
          )}

          <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
            <Box sx={{ width: "15%", ml: 2 }}>
              <Typography
                sx={{
                  textAlign: "right",
                  color: theme.palette.text.secondary,
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Department:
              </Typography>
            </Box>
            <Box sx={{ width: "10%" }} />
            <Box sx={{ width: "75%", ml: 2 }}>
              <Typography
                sx={{
                  color: theme.palette.text.main,
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >{`${data?.department_Code} - ${data?.department_Name}`}</Typography>
            </Box>
          </Stack>

          <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
            <Box sx={{ width: "15%", ml: 2 }}>
              <Typography
                sx={{
                  textAlign: "right",
                  color: theme.palette.text.secondary,
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Channel:
              </Typography>
            </Box>
            <Box sx={{ width: "10%" }} />
            <Box sx={{ width: "75%", ml: 2 }}>
              <Typography
                sx={{
                  color: theme.palette.text.main,
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                {data?.channel_Name}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
            <Box sx={{ width: "15%", ml: 2 }}>
              <Typography
                sx={{
                  textAlign: "right",
                  color: theme.palette.text.secondary,
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Category:
              </Typography>
            </Box>
            <Box sx={{ width: "10%" }} />

            {data?.getOpenTicketCategories?.length > 0 ? (
              <Box sx={{ width: "75%", ml: 2 }}>
                <Stack direction="row" gap={1} sx={{ width: "100%" }}>
                  {data?.getOpenTicketCategories?.map((item, i) => (
                    <Box key={i}>
                      <Chip
                        variant="filled"
                        size="small"
                        label={item.category_Description ? item.category_Description : "-"}
                        sx={{
                          backgroundColor: theme.palette.bgForm.black_1,
                          color: "#ffffff",
                          borderRadius: "none",
                          maxWidth: "300px",
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              </Box>
            ) : (
              <Box sx={{ width: "75%", ml: 2 }}>
                <Typography
                  sx={{
                    color: theme.palette.text.main,
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  -
                </Typography>
              </Box>
            )}
          </Stack>

          <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
            <Box sx={{ width: "15%", ml: 2 }}>
              <Typography
                sx={{
                  textAlign: "right",
                  color: theme.palette.text.secondary,
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Sub Category:
              </Typography>
            </Box>
            <Box sx={{ width: "10%" }} />

            {data?.getOpenTicketSubCategories?.length > 0 ? (
              <Box sx={{ width: "75%", ml: 2 }}>
                <Stack direction="row" gap={1} sx={{ width: "100%" }}>
                  {data?.getOpenTicketSubCategories?.map((item, i) => (
                    <Box key={i}>
                      <Chip
                        variant="filled"
                        size="small"
                        label={item.subCategory_Description ? item.subCategory_Description : "-"}
                        sx={{
                          backgroundColor: theme.palette.bgForm.black_1,
                          color: "#ffffff",
                          borderRadius: "none",
                          maxWidth: "300px",
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
                <Typography
                  sx={{
                    color: theme.palette.text.main,
                    fontWeight: "500",
                    fontSize: "14px",
                    wordBreak: "break-word",
                  }}
                >
                  {data?.subCategory_Description}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ width: "75%", ml: 2 }}>
                <Typography
                  sx={{
                    color: theme.palette.text.main,
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  -
                </Typography>
              </Box>
            )}
          </Stack>

          {/* Concern Category */}
          {(data?.ticket_Status === "For Closing Ticket" || data?.ticket_Status === "For Confirmation" || data?.ticket_Status === "Closed") && (
            <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
              <Box sx={{ width: "15%", ml: 2 }}>
                <Typography
                  sx={{
                    textAlign: "right",
                    color: theme.palette.text.secondary,
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  Concern Category:
                </Typography>
              </Box>
              <Box sx={{ width: "10%" }} />
              <Box sx={{ width: "75%", ml: 2 }}>
                <Typography
                  sx={{
                    color: theme.palette.text.main,
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  {data?.getForClosingTickets?.[0]?.categoryConcernName ? data?.getForClosingTickets?.[0]?.categoryConcernName : "-"}
                </Typography>
              </Box>
            </Stack>
          )}

          <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
            <Box sx={{ width: "15%", ml: 2 }}>
              <Typography
                sx={{
                  textAlign: "right",
                  color: theme.palette.text.secondary,
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Assigned to:
              </Typography>
            </Box>
            <Box sx={{ width: "10%" }} />
            <Box sx={{ width: "75%", ml: 2 }}>
              <Typography
                sx={{
                  color: theme.palette.text.main,
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                {data?.issue_Handler}
              </Typography>
            </Box>
          </Stack>

          {/* For OnHold Remarks */}
          {data?.ticket_Status === "For On-Hold" && (
            <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
              <Box sx={{ width: "15%", ml: 2 }}>
                <Typography
                  sx={{
                    textAlign: "right",
                    color: theme.palette.text.secondary,
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  Hold Reason:
                </Typography>
              </Box>
              <Box sx={{ width: "10%" }} />
              <Box sx={{ width: "75%", ml: 2 }}>
                <Typography
                  sx={{
                    color: theme.palette.text.main,
                    fontWeight: "500",
                    fontSize: "14px",
                    wordBreak: "break-word",
                  }}
                >
                  {data?.getForOnHolds?.[0]?.reason}
                </Typography>
              </Box>
            </Stack>
          )}

          {/* OnHold Remarks */}
          {data?.ticket_Status === "On-Hold" && (
            <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
              <Box sx={{ width: "15%", ml: 2 }}>
                <Typography
                  sx={{
                    textAlign: "right",
                    color: theme.palette.text.secondary,
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  On Hold Reason:
                </Typography>
              </Box>
              <Box sx={{ width: "10%" }} />
              <Box sx={{ width: "75%", ml: 2 }}>
                <Typography
                  sx={{
                    color: theme.palette.text.main,
                    fontWeight: "500",
                    fontSize: "14px",
                    wordBreak: "break-word",
                  }}
                >
                  {data?.getOnHolds?.[0]?.reason}
                </Typography>
              </Box>
            </Stack>
          )}

          {/* Transfer Remarks */}
          {data?.ticket_Status === "For Transfer" && (
            <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
              <Box sx={{ width: "15%", ml: 2 }}>
                <Typography
                  sx={{
                    textAlign: "right",
                    color: theme.palette.text.secondary,
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  Transfer Remarks:
                </Typography>
              </Box>
              <Box sx={{ width: "10%" }} />
              <Box sx={{ width: "75%", ml: 2 }}>
                <Typography
                  sx={{
                    color: theme.palette.text.main,
                    fontWeight: "500",
                    fontSize: "14px",
                    wordBreak: "break-word",
                  }}
                >
                  {data?.getForTransferTickets?.[0]?.transfer_Remarks}
                </Typography>
              </Box>
            </Stack>
          )}

          {/* Transfer Approval Remarks */}
          {data?.ticket_Status === "Transfer Approval" && (
            <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
              <Box sx={{ width: "15%", ml: 2 }}>
                <Typography
                  sx={{
                    textAlign: "right",
                    color: theme.palette.text.secondary,
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  Transfer Remarks:
                </Typography>
              </Box>
              <Box sx={{ width: "10%" }} />
              <Box sx={{ width: "75%", ml: 2 }}>
                <Typography
                  sx={{
                    color: theme.palette.text.main,
                    fontWeight: "500",
                    fontSize: "14px",
                    wordBreak: "break-word",
                  }}
                >
                  {data?.transferApprovalTickets?.[0]?.transfer_Remarks}
                </Typography>
              </Box>
            </Stack>
          )}

          <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
            <Box sx={{ width: "15%", ml: 2 }}>
              <Typography
                sx={{
                  textAlign: "right",
                  color: theme.palette.text.secondary,
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Date Needed:
              </Typography>
            </Box>
            <Box sx={{ width: "10%" }} />
            <Box sx={{ width: "75%", ml: 2 }}>
              <Typography
                sx={{
                  color: theme.palette.text.main,
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                {data?.date_Needed ? moment(data?.date_Needed).format("LL") : "--"}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
            <Box sx={{ width: "15%", ml: 2 }}>
              <Typography
                sx={{
                  textAlign: "right",
                  color: theme.palette.text.secondary,
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Target Date:
              </Typography>
            </Box>
            <Box sx={{ width: "10%" }} />
            <Box sx={{ width: "75%", ml: 2 }}>
              <Typography
                sx={{
                  color: theme.palette.text.main,
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                {moment(data?.target_Date).format("LL")}
              </Typography>
            </Box>
          </Stack>

          {/* Closing Date with Remarks */}
          {(channelNameValidation === "HMU - IT Hardware Support (Hardware Concern)" && data?.ticket_Status === "") ||
            (channelNameValidation === "HMU - IT Hardware Support (Hardware Concern)" && data?.ticket_Status === "For Closing Ticket") ||
            (channelNameValidation === "HMU - IT Hardware Support (Hardware Concern)" && data?.ticket_Status === "Closed") ||
            (channelNameValidation === "HMU - IT Hardware Support (Hardware Concern)" && data?.ticket_Status === "For Confirmation" && (
              <>
                <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                  <Box sx={{ width: "15%", ml: 2 }}>
                    <Typography
                      sx={{
                        textAlign: "right",
                        color: theme.palette.text.secondary,
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      Backdate:
                    </Typography>
                  </Box>
                  <Box sx={{ width: "10%" }} />
                  <Box sx={{ width: "75%", ml: 2 }}>
                    <Typography
                      sx={{
                        color: theme.palette.text.main,
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      {data?.getForClosingTickets?.[0]?.backDate ? moment(data?.getForClosingTickets?.[0]?.backDate).format("LL") : "--"}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
                  <Box sx={{ width: "15%", ml: 2 }}>
                    <Typography
                      sx={{
                        textAlign: "right",
                        color: theme.palette.text.secondary,
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      Backdate Remarks:
                    </Typography>
                  </Box>
                  <Box sx={{ width: "10%" }} />
                  <Box sx={{ width: "75%", ml: 2 }}>
                    <Typography
                      sx={{
                        color: theme.palette.text.main,
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      {data?.getForClosingTickets?.[0]?.backDateRemarks ? data?.getForClosingTickets?.[0]?.backDateRemarks : "--"}
                    </Typography>
                  </Box>
                </Stack>
              </>
            ))}

          <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
            <Box sx={{ width: "15%", ml: 2 }}>
              <Typography
                sx={{
                  textAlign: "right",
                  color: theme.palette.text.secondary,
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Ticket Description:
              </Typography>
            </Box>
            <Box sx={{ width: "10%" }} />

            <Box sx={{ width: "75%", ml: 2 }}>
              <Typography
                sx={{
                  color: theme.palette.text.main,
                  fontWeight: "500",
                  fontSize: "14px",
                  wordBreak: "break-word",
                }}
              >
                {data?.concern_Description?.split("\r\n").map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" sx={{ padding: 1, border: "1px solid #2D3748" }}>
            <Box sx={{ width: "15%", ml: 2 }}>
              <Typography
                sx={{
                  textAlign: "right",
                  color: theme.palette.text.secondary,
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Notes:
              </Typography>
            </Box>
            <Box sx={{ width: "10%" }} />
            <Box sx={{ width: "75%", ml: 2 }}>
              <Typography
                sx={{
                  color: theme.palette.text.main,
                  fontWeight: "500",
                  fontSize: "14px",
                  wordBreak: "break-word",
                }}
              >
                {data?.notes !== null ? data?.notes : "--"}
              </Typography>
            </Box>
          </Stack>

          {/* Resolution */}
          {(data?.ticket_Status === "For Closing Ticket" || data?.ticket_Status === "For Confirmation" || data?.ticket_Status === "Closed") && (
            <Stack
              direction="row"
              sx={{
                padding: 1,
                border: "1px solid #2D3748",
                borderRadius: "0 0 20px 20px",
              }}
            >
              <Box sx={{ width: "15%", ml: 2 }}>
                <Typography
                  sx={{
                    textAlign: "right",
                    color: theme.palette.text.secondary,
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  Resolution:
                </Typography>
              </Box>
              <Box sx={{ width: "10%" }} />
              <Box sx={{ width: "75%", ml: 2 }}>
                <Typography
                  sx={{
                    color: theme.palette.text.main,
                    fontWeight: "500",
                    fontSize: "14px",
                    wordBreak: "break-word",
                  }}
                >
                  {data?.getForClosingTickets?.[0]?.resolution?.split("\r\n").map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
                </Typography>
              </Box>
            </Stack>
          )}
        </>
      )}
    </div>
  );
};

export default TestIssueTicketDetails;
