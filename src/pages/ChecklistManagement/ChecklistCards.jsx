import React, { useRef } from "react";
import { MoreVertOutlined } from "@mui/icons-material";
import { Card, CardActionArea, CardContent, IconButton, Stack, Typography } from "@mui/material";

import Lottie from "lottie-react";
import Folder from "../../assets/lotties/folder-yellow.json";

import moment from "moment";
import { theme } from "../../theme/theme";
import { checklistStyles } from "./styles/checklistStyles";

const ChecklistCards = ({ data }) => {
  const lottieRef = useRef();
  const isHovering = useRef(false);

  const TOTAL_FRAMES = 101;
  const MID_FRAME = TOTAL_FRAMES / 2;

  const handleMouseEnter = () => {
    isHovering.current = true;
    lottieRef.current.setDirection(1);
    lottieRef.current.goToAndPlay(0, true);
  };

  const handleMouseLeave = () => {
    isHovering.current = false;
    lottieRef.current.setDirection(-1);
    lottieRef.current.play();
  };

  const handleEnterFrame = (e) => {
    // Stop at mid frame ONLY when hovering and playing forward
    if (isHovering.current && e.direction === 1 && Math.floor(e.currentTime) >= MID_FRAME) {
      lottieRef.current.pause();
    }
    // Stop at frame 0 ONLY when not hovering and playing backward
    if (!isHovering.current && e.direction === -1 && Math.floor(e.currentTime) <= 0) {
      lottieRef.current.pause();
    }
  };

  return (
    <>
      <Card
        variant="outlined"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{ position: "relative", "&:hover": { borderColor: "primary.main", cursor: "pointer" }, borderRadius: 2 }}
      >
        <CardActionArea>
          <CardContent>
            <Stack justifyContent="center" sx={{ width: "100%" }}>
              <div
                style={{
                  width: 150,
                  marginBottom: 4,
                  cursor: "pointer",
                }}
              >
                <Lottie lottieRef={lottieRef} animationData={Folder} loop={false} autoplay={false} onEnterFrame={handleEnterFrame} />
              </div>
            </Stack>

            <Stack>
              <Typography sx={checklistStyles.cardTitle}>{data?.title}</Typography>

              <Stack direction="row" justifyContent="space-between">
                <Stack mt={2}>
                  <Typography sx={checklistStyles.cardDescription}>{data?.description}</Typography>

                  <Stack mt={1}>
                    <Typography sx={{ ...checklistStyles.cardDetails, color: data?.isActive ? theme.palette.success.main : theme.palette.error.main }}>
                      {data?.isActive ? "Active" : "Inactive"}
                    </Typography>
                    <Typography sx={checklistStyles.cardDetails}>{`Created at: ${moment(data?.createdAt).format("LL")}`}</Typography>
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
    </>
  );
};

export default ChecklistCards;
