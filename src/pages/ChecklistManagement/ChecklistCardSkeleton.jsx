import { Card, Stack, Skeleton, Box } from "@mui/material";

const ChecklistCardSkeleton = () => {
  return (
    <Stack direction="row" spacing={2}>
      {/* Checklist Card Skeleton */}
      <Card
        sx={{
          width: "100%",
          height: "100%",
          bgcolor: "#111c2d",
          borderRadius: 2,
          p: 2,
        }}
      >
        <Stack spacing={1}>
          {/* Folder Icon */}
          <Skeleton variant="rounded" width={170} height={150} />

          {/* Title */}
          <Skeleton variant="text" width="40%" height={28} />

          {/* Subtitle */}
          <Skeleton variant="text" width="60%" height={18} />

          {/* Status */}
          <Skeleton variant="text" width="90%" height={18} />

          {/* Date */}
          <Skeleton variant="text" width="90%" height={18} />
        </Stack>
      </Card>
    </Stack>
  );
};

export default ChecklistCardSkeleton;
