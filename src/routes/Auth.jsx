import {
  Box,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import logo from "../assets/logo-light.png";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { SignInButton } from "../components/SignInButton";
import { authenticateUserAcccess } from "../services/authService";

const Auth = () => {
  const { accounts } = useMsal();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (accounts.length > 0) {
        const res = await authenticateUserAcccess(accounts[0]);
        if (res.success) {
          navigate("/");
        } else {
          console.error("Backend authentication failed:", res.error);
        }
      } else {
        setLoading(false);
      }
    };

    initAuth();
  }, [accounts, navigate]);

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
    <Container
      maxWidth="sm"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper elevation={2} sx={{ padding: 4, width: "100%", borderRadius: 1 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
          <Box
            component="img"
            src={logo}
            sx={{ height: 80, width: "auto", objectFit: "cover" }}
          />

          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 600,
              textAlign: "center",
              color: "primary",
              letterSpacing: 0.5,
              mb: 1,
            }}
          >
            Administrator Portal
          </Typography>

          <SignInButton />

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 3 }}
          >
            This portal is restricted to authorized p-Chip Cloud personnel only.
            Unauthorized access is strictly prohibited. All access attempts are
            logged. Unauthorized users attempting to access this system will be
            subject to legal action under state and federal law.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Auth;
