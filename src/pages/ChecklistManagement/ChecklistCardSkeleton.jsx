import { Card, Stack, Skeleton, Box } from "@mui/material";
import { checklistStyles } from "./styles/checklistStyles";

const ChecklistCardSkeleton = () => {
  return (
    <Stack direction="row" spacing={2}>
      <Card sx={checklistStyles.folderCards}>
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
