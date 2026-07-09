import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import IcecreamOutlinedIcon from "@mui/icons-material/IcecreamOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";

import {
  AssessmentOutlined,
  AttachFileOutlined,
  AutoAwesomeMotionOutlined,
  BackupTableOutlined,
  BallotOutlined,
  BuildCircleOutlined,
  BusinessOutlined,
  CategoryOutlined,
  ConfirmationNumberOutlined,
  ContactsOutlined,
  CreditScoreOutlined,
  DiscountOutlined,
  DynamicFeedOutlined,
  EqualizerOutlined,
  FactCheckOutlined,
  FolderOutlined,
  GroupsOutlined,
  HubOutlined,
  ManageAccountsOutlined,
  NumbersOutlined,
  PermIdentityOutlined,
  StorefrontOutlined,
  StoreMallDirectoryOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";

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
    AssessmentOutlined: <AssessmentOutlined />,
    BuildCircleOutlined: <BuildCircleOutlined />,
    FolderOutlined: <FolderOutlined />,
  };

  return iconMap[iconName] || <IcecreamOutlinedIcon />;
};

export const getSubMenuIcon = (iconName) => {
  const iconMap = {
    // User Management
    PermIdentityOutlinedIcon: <PermIdentityOutlined fontSize="small" />,
    ManageAccountsOutlinedIcon: <ManageAccountsOutlined fontSize="small" />,
    // Masterlist
    BusinessOutlinedIcon: <BusinessOutlined fontSize="small" />,
    HubOutlined: <HubOutlined fontSize="small" />,
    CategoryOutlined: <CategoryOutlined fontSize="small" />,
    AutoAwesomeMotionOutlined: <AutoAwesomeMotionOutlined fontSize="small" />,
    ContactsOutlined: <ContactsOutlined fontSize="small" />,
    GroupsOutlined: <GroupsOutlined fontSize="small" />,
    StorefrontOutlined: <StorefrontOutlined fontSize="small" />,
    StoreMallDirectoryOutlined: <StoreMallDirectoryOutlined fontSize="small" />,
    BackupTableOutlined: <BackupTableOutlined fontSize="small" />,
    // Requestor / Receiver
    DiscountOutlined: <DiscountOutlined fontSize="small" />,
    // Ticketing
    ConfirmationNumberOutlined: <ConfirmationNumberOutlined fontSize="small" />,
    // Approver
    FactCheckOutlined: <FactCheckOutlined fontSize="small" />,
    VisibilityOutlined: <VisibilityOutlined fontSize="small" />,
  };

  return iconMap[iconName] || <NumbersOutlined fontSize="small" />;
};
