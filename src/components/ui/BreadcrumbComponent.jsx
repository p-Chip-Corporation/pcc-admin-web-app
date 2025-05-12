import {
  Breadcrumbs,
  Typography,
  Link as MuiLink,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const navgList = [
  { label: "Home", route: "/" },
  { label: "Accounts", route: "/accounts" },
  { label: "Devices", route: "/devices" },
  { label: "Users", route: "/users" },
  { label: "Account Invitations", route: "/account-activation" },
  { label: "Account Devices", route: "/account-devices" },
];

const BreadcrumbsComponent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  const breadcrumbs = pathnames.map((segment, index) => {
    const fullPath = "/" + pathnames.slice(0, index + 1).join("/");
    const matched = navgList.find((item) => item.route === fullPath);

    return {
      label: matched?.label ?? decodeURIComponent(segment),
      to: fullPath,
    };
  });

  return (
    <Breadcrumbs
      separator="›"
      aria-label="breadcrumb"
      sx={{ color: "inherit" }}
    >
      {isMobile
        ? breadcrumbs.map((crumb) => (
            <MuiLink
              key={crumb.to}
              component={Link}
              to={crumb.to}
              underline="hover"
              fontWeight={500}
              color="inherit"
            >
              {crumb.label.toUpperCase()}
            </MuiLink>
          ))
        : breadcrumbs.map((crumb, idx) => (
            <Typography
              key={crumb.to}
              fontWeight={idx < breadcrumbs.length - 1 ? 500 : 400}
              fontSize="0.75rem"
              color="inherit"
            >
              {crumb.label.toUpperCase()}
            </Typography>
          ))}
    </Breadcrumbs>
  );
};

export default BreadcrumbsComponent;
