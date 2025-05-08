import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  AccountBox as AccountBoxIcon,
  Devices as DevicesIcon,
  People as PeopleIcon,
  MailOutline as MailOutlineIcon,
  QrCodeScanner as QrCodeScannerIcon,
} from "@mui/icons-material";

const tiles = [
  {
    title: "Accounts",
    icon: <AccountBoxIcon sx={{ fontSize: 50 }} />,
    description:
      "Manage customer or organizational accounts within the platform.",
    path: "/accounts",
  },
  {
    title: "Devices",
    icon: <DevicesIcon sx={{ fontSize: 50 }} />,
    description: "Register, monitor, and manage connected device hardware.",
    path: "/devices",
  },
  {
    title: "Users",
    icon: <PeopleIcon sx={{ fontSize: 50 }} />,
    description: "Create, assign, and control user access and roles.",
    path: "/users",
  },
  {
    title: "Account Invitations",
    icon: <MailOutlineIcon sx={{ fontSize: 50 }} />,
    description:
      "Send and track invitations for account access and activation.",
    path: "/account-activation",
  },
  {
    title: "Account Devices",
    icon: <QrCodeScannerIcon sx={{ fontSize: 50 }} />,
    description: "Link and manage devices specific to account ownership.",
    path: "/account-devices",
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="xl"
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        textAlign: "center",
      }}
    >
      <Box maxWidth="md" mb={6}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Welcome to the p-Chip Cloud Administrator Portal
        </Typography>
        <Typography variant="h6" color="text.secondary">
          The p-Chip Cloud Administrator Portal is your command center for
          managing digital assets, identity, security, and infrastructure across
          the p-Chip ecosystem. Empower your team, streamline operations, and
          stay informed with a powerful suite of tools designed for scalable,
          secure, and efficient enterprise administration.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 4,
        }}
      >
        {tiles.map(({ title, icon, description, path }) => (
          <Box
            key={title}
            sx={{
              flex: "1 1 300px", // flexible but minimum ~300px per tile
              maxWidth: "350px",
            }}
          >
            <Paper
              elevation={4}
              sx={{
                p: 4,
                height: "100%",
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.03)" },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 2,
              }}
              onClick={() => navigate(path)}
            >
              {icon}
              <Typography variant="h6" fontWeight="bold">
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default Home;
