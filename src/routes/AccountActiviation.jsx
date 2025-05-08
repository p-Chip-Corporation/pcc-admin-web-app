import {
  Box,
  CircularProgress,
  Container,
  IconButton,
  Paper,
} from "@mui/material";
import PageHeader from "../components/PageHeader";
import PaginatedTableComponent from "../components/PaginatedTableComponent";
import InfoPopperComponent from "../components/InfoPopperComponent";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useEffect, useState } from "react";
import RightDrawer from "../components/RightDrawerComponent";
import AccountActivationForm from "../forms/AccountActiviationForm";
import { fetchAccountActivations } from "../services/accountActivationService";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

const AccountActivation = () => {
  const [open, setOpen] = useState();
  const [loading, setLoading] = useState(true);
  const [accountActivations, setAccountActivations] = useState([]);

  useEffect(() => {
    getAccountActivations();
  }, []);

  const getAccountActivations = async () => {
    try {
      setLoading(true);
      const response = await fetchAccountActivations();
      if (response.success) {
        setAccountActivations(response.data);
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };

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
      maxWidth="xl"
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        width: "100%",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          width: "100%",
          height: "100%",
          padding: 1,
          gap: 2,
        }}
      >
        <PageHeader icon={<MailOutlineIcon fontSize="large" />}  title={"Account Invitations"}>
          <Box sx={{ display: "flex", flexDirection: "row", gap: "1" }}>
            <InfoPopperComponent title="How to use this section">
              Here you can manage account invitations that will be sent to the
              email you sepcify. Only one account invitation can be sent at a
              time. The user you specify will be set as the account
              administrator on successful authentication. Make sure to click{" "}
              <strong>“Save”</strong> after making changes.
            </InfoPopperComponent>

            <IconButton
              onClick={() => {
                setOpen(true);
              }}
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </Box>
        </PageHeader>
        <PaginatedTableComponent
        onRowClick={() => {
          
        }}
          data={accountActivations}
          columns={[
            { id: "id", label: "ID", grow: false },
            { id: "accountName", label: "Account Name", grow: true },
            { id: "email", label: "Email Address", grow: false },
            { id: "issueDate", label: "Issue Date", grow: false },
            { id: "expiryDate", label: "Expiry Date", grow: false },
            { id: "isClaimed", label: "Claimed", grow: false, type: "boolean" },
            { id: "claimedDate", label: "Claimed Date", grow: false },
            { id: "createdBy", label: "Created By", grow: false },
            { id: "createdAt", label: "Created Date", grow: false },
          ]}
        />
      </Box>
      <RightDrawer
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        title={"Issue An Account Invitation"}
      >
        {open && (
          <AccountActivationForm
            onSuccess={async () => {
              setLoading(true);
              try {
                setOpen(false);
                await getAccountActivations();
              } catch (error) {
                console.log("Error", error);
              } finally {
                setLoading(false);
              }
            }}
          />
        )}
      </RightDrawer>
    </Container>
  );
};

export default AccountActivation;
