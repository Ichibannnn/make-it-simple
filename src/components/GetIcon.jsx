import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import IcecreamOutlinedIcon from "@mui/icons-material/IcecreamOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";

import { AttachFileOutlined, BallotOutlined, ConfirmationNumberOutlined, CreditScoreOutlined, DynamicFeedOutlined, EqualizerOutlined, NumbersOutlined } from "@mui/icons-material";

export const getMenuIcon = (iconName) => {
  const iconMap = {
    EqualizerOutlined: <EqualizerOutlined />,
    PeopleOutlinedIcon: <PeopleOutlinedIcon />,
    ChecklistOutlinedIcon: <ChecklistOutlinedIcon />,
    DynamicFeedOutlined: <DynamicFeedOutlined />,
    NumbersOutlined: <NumbersOutlined />,
    AttachFileOutlined: <AttachFileOutlined />,
    BallotOutlined: <BallotOutlined />,
    ConfirmationNumberOutlined: <ConfirmationNumberOutlined />,
    CreditScoreOutlined: <CreditScoreOutlined />,
  };

  return iconMap[iconName] || <IcecreamOutlinedIcon />;
};

export const getSubMenuIcon = (iconName) => {
  const iconMap = {
    // // User Management
    // PermIdentityOutlinedIcon: <PermIdentityOutlinedIcon />,
    // ManageAccountsOutlinedIcon: <ManageAccountsOutlinedIcon />,
    // // Masterlist
    // BusinessOutlinedIcon: <BusinessOutlinedIcon />,
    // LanOutlined: <LanOutlined />,
    // DomainAddOutlined: <DomainAddOutlined />,
    // AccountTreeOutlined: <AccountTreeOutlined />,
    // ListOutlined: <ListOutlined />,
    // RoomOutlined: <RoomOutlined />,
    // CategoryOutlined: <CategoryOutlined />,
    // AutoAwesomeMotionOutlined: <AutoAwesomeMotionOutlined />,
    // // Request
    // ConfirmationNumberOutlined: <ConfirmationNumberOutlined />,
    // BookmarkAddOutlined: <BookmarkAddOutlined />,
    // DiscountOutlined: <DiscountOutlined />,
    // // Channel Setup
    // ContactsOutlined: <ContactsOutlined />,
    // HubOutlined: <HubOutlined />,
    // GroupsOutlined: <GroupsOutlined />,
  };

  return iconMap[iconName] || <IcecreamOutlinedIcon />;
};
