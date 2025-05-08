import { Breadcrumbs, Typography, Link as MuiLink } from "@mui/material";
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
    <Breadcrumbs separator="›" aria-label="breadcrumb">
      {breadcrumbs.map((crumb, idx) =>
        idx === breadcrumbs.length - 1 ? (
          <Typography
            key={crumb.to}
            color="text.primary"
            fontWeight={500}
            fontSize="0.875rem"
          >
            {crumb.label}
          </Typography>
        ) : (
          <MuiLink
            key={crumb.to}
            component={Link}
            to={crumb.to}
            underline="hover"
            color="inherit"
            fontSize="0.875rem"
          >
            {crumb.label}
          </MuiLink>
        )
      )}
    </Breadcrumbs>
  );
};

export default BreadcrumbsComponent;
