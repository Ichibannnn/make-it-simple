import React, { useRef } from "react";
// import { Folder } from "@mui/icons-material";
import { Card, CardActionArea, CardContent, IconButton, Stack, Typography } from "@mui/material";
import Lottie from "lottie-react";
import Folder from "../../assets/lotties/folder-yellow.json";
import { checklistStyles } from "./styles/checklistStyles";
import { MoreVertOutlined } from "@mui/icons-material";

const ChecklistCards = ({ data }) => {
  const lottieRef = useRef();

  return (
    <Card variant="outlined" sx={{ position: "relative", "&:hover": { borderColor: "primary.main" } }}>
      <CardActionArea>
        <CardContent>
          <Stack justifyContent="center" sx={{ width: "100%" }}>
            <div
              style={{
                width: 150,
                marginBottom: 4,
                cursor: "pointer",
              }}
              onMouseEnter={() => {
                lottieRef.current.stop();
                lottieRef.current.play();
              }}
            >
              <Lottie lottieRef={lottieRef} animationData={Folder} loop={false} autoplay={false} />
            </div>
          </Stack>

          <Stack>
            <Typography sx={checklistStyles.cardTitle}>{data?.title}</Typography>

            <Stack direction="row" justifyContent="space-between">
              <Stack mt={2}>
                <Typography sx={checklistStyles.cardDetails}>{data?.description}</Typography>

                <Stack mt={1}>
                  <Typography sx={checklistStyles.cardDetails} color={data?.status === "Active" ? "success" : "error"}>
                    {data?.status}
                  </Typography>
                  <Typography sx={checklistStyles.cardDetails}>{data?.createdAt}</Typography>
                </Stack>
              </Stack>

              <Stack mt={2}>
                <IconButton>
                  <MoreVertOutlined />
                </IconButton>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ChecklistCards;
