import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Avatar,
  Menu,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import logo from "../assets/logo-white.png";

const drawerWidth = 240;

import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import DevicesIcon from "@mui/icons-material/Devices";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { useNavigate } from "react-router";
import SignOutButton from "./SignOutButton";
import { useUser } from "../providers/UserProvider";

const navgList = [
  {
    label: "Home",
    icon: <HomeIcon />,
    route: "/",
  },
  {
    label: "Accounts",
    icon: <AccountBoxIcon />,
    route: "/accounts",
  },
  {
    label: "Devices",
    icon: <DevicesIcon />,
    route: "/devices",
  },
  {
    label: "Users",
    icon: <PeopleIcon />,
    route: "/users",
  },
  {
    label: "Account Invitations",
    icon: <MailOutlineIcon />,
    route: "/account-activation",
  },
  {
    label: "Account Devices",
    icon: <QrCodeScannerIcon />,
    route: "/account-devices",
  },
];

export default function AppBarComponent({ children }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const menuOpen = Boolean(menuAnchor);
  const { user } = useUser();
  console.log("User", user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleMenuOpen = (event) => setMenuAnchor(event.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  const toggleDrawer = () => setOpen(!open);

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2, cursor: "pointer" }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "end", gap: 1 }}>
            <Box
              component={"img"}
              height={40}
              width={"auto"}
              src={logo}
              sx={{ objectFit: "cover" }}
            />
            {!isMobile && (
              <Typography
                fontWeight={"bold"}
                variant="h6"
                noWrap
                component="div"
              >
                Administrator Portal
              </Typography>
            )}
          </Box>

          <Box sx={{ flexGrow: 1 }} />
          {!isMobile && <Typography>Welcome, {user.name}</Typography>}

          <IconButton onClick={handleMenuOpen} size="small" sx={{ ml: 2 }}>
            <Avatar
              alt={user.name}
              src="/avatar.png"
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>

          <Menu
            anchorEl={menuAnchor}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <SignOutButton onClick={handleMenuClose} />
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={open}
        onClose={() => setOpen(false)} // 🔑 this is the close handler
        ModalProps={{ keepMounted: true }} // ✅ improves performance
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <List>
          {navgList.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={() => {
                  toggleDrawer();
                  navigate(`${item.route}`);
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        sx={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
          paddingTop: 1,
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Box sx={{ flex: 1, overflow: "auto", padding: 1 }}>{children}</Box>
      </Box>
    </Box>
  );
}
