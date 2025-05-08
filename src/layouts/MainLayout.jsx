import { Outlet, useNavigate } from "react-router-dom";
import AppBarComponent from "../components/AppBarComponent";
import { useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { InteractionStatus } from "@azure/msal-browser";
import { fetchUserProfilePermissions } from "../services/authService"; // 🔍 your service to get user profile
import { useUser } from "../providers/UserProvider";
import { setAxiosAuthHandlers } from "../config/axios";

const MainLayout = () => {
  const { accounts, inProgress } = useMsal();
  const navigate = useNavigate();
  const { user, setUser, clearUser } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (inProgress !== InteractionStatus.None) return;

    const initializeUser = async () => {
      if (accounts.length === 0) {
        navigate("/auth");
        return;
      }

      if (!user) {
        const res = await fetchUserProfilePermissions({
          localAccountId: accounts[0].localAccountId,
        });

        if (res.success) {
          setUser(res.data);
        } else {
          navigate("/auth");
          return;
        }
      }

      setLoading(false);
    };

    initializeUser();
  }, [accounts, inProgress, navigate, setUser, user]);

  useEffect(() => {
    setAxiosAuthHandlers({ clearUser, navigate }); // ⬅️ inject once
  }, [clearUser, navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AppBarComponent>
      <Outlet />
    </AppBarComponent>
  );
};

export default MainLayout;
