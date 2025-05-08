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
import AccountDeviceForm from "../forms/AccountDeviceForm";
import { fetchAccountDevices } from "../services/accountDeviceService";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

const AccountDevices = () => {
  const [open, setOpen] = useState();
  const [loading, setLoading] = useState(true);
  const [accountDevices, setAccountDevices] = useState([]);

  useEffect(() => {
    getAccountActivations();
  }, []);

  const getAccountActivations = async () => {
    try {
      setLoading(true);
      const response = await fetchAccountDevices();
      if (response.success) {
        setAccountDevices(response.data);
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
        <PageHeader
          icon={<QrCodeScannerIcon fontSize="large" />}
          title={"Account Devices"}
        >
          <Box sx={{ display: "flex", flexDirection: "row", gap: "1" }}>
            <InfoPopperComponent title="How to use this section">
              You can manage customer devices here. Important note. A device can
              only be allocated to one account at a time. To reallocate the
              devices, make sure to remove it from the current account before
              allocating it to another account. Make sure to click{" "}
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
          data={accountDevices}
          columns={[
            { id: "id", label: "ID", grow: false },
            { id: "accountName", label: "Account Name", grow: true },
            { id: "deviceName", label: "Device Name", grow: false },
            {
              id: "isActive",
              label: "Is Active",
              grow: false,
              type: "boolean",
            },
            { id: "createdBy", label: "Created By", grow: false },
            {
              id: "createdAt",
              label: "Created Date",
              grow: false,
              type: "date",
            },
            {
              id: "updatedAt",
              label: "Last Modified Date",
              grow: false,
              type: "date",
            },
          ]}
        />
      </Box>
      <RightDrawer
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        title={"Register device to an account"}
      >
        {open && (
          <AccountDeviceForm
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

export default AccountDevices;
