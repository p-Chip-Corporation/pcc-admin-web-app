import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { Button } from "@mui/material";
import MicrosoftIcon from "@mui/icons-material/Microsoft"; // ✅ missing import

export const SignInButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch((e) => {
      console.error("Login error", e);

      // Force logout in case MSAL cached invalid state
      instance.logoutRedirect({
        postLogoutRedirectUri: "/auth",
      });
    });
  };

  return (
    <Button
      variant="contained"
      startIcon={<MicrosoftIcon />}
      onClick={() => handleLogin()} // ✅ fixed syntax
      sx={{ width: "100%" }}
    >
      Sign in with Microsoft
    </Button>
  );
};
