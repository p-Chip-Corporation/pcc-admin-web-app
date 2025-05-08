import React from "react";
import { useMsal } from "@azure/msal-react";
import { MenuItem } from "@mui/material";
import { useUser } from "../providers/UserProvider";
import { logoutUser } from "../services/authService";

export default function SignOutButton({ method = "redirect", onClick }) {
  const { instance } = useMsal();
  const { clearUser } = useUser();

  const handleLogout = async () => {
    if (onClick) onClick(); // close the dropdown, etc.
    clearUser();
    await logoutUser();

    if (method === "popup") {
      instance.logoutPopup({
        postLogoutRedirectUri: "/",
        mainWindowRedirectUri: "/",
      });
    } else {
      instance.logoutRedirect({
        postLogoutRedirectUri: "/",
      });
    }
  };

  return <MenuItem onClick={handleLogout}>Sign Out</MenuItem>;
}
