import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import IcecreamOutlinedIcon from "@mui/icons-material/IcecreamOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";

import {
  AttachFileOutlined,
  BallotOutlined,
  DynamicFeedOutlined,
  NumbersOutlined,
} from "@mui/icons-material";

export const getMenuIcon = (iconName) => {
  const iconMap = {
    PeopleOutlinedIcon: <PeopleOutlinedIcon />,
    ChecklistOutlinedIcon: <ChecklistOutlinedIcon />,
    DynamicFeedOutlined: <DynamicFeedOutlined />,
    NumbersOutlined: <NumbersOutlined />,
    AttachFileOutlined: <AttachFileOutlined />,
    BallotOutlined: <BallotOutlined />,
  };

  return iconMap[iconName] || <IcecreamOutlinedIcon />;
};

export const getSubMenuIcon = (iconName) => {
  const iconMap = {
    // User Management
    PermIdentityOutlinedIcon: <PermIdentityOutlinedIcon />,
    ManageAccountsOutlinedIcon: <ManageAccountsOutlinedIcon />,

    // Masterlist
    BusinessOutlinedIcon: <BusinessOutlinedIcon />,
    AccountTreeOutlinedIcon: <AccountTreeOutlinedIcon />,
  };

  return iconMap[iconName] || <IcecreamOutlinedIcon />;
};
