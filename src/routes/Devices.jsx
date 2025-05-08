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
import { fetchDevices } from "../services/deviceService";
import DeviceForm from "../forms/DeviceForm";
import DevicesIcon from "@mui/icons-material/Devices";
import { useNavigate } from "react-router";

const Devices = () => {
  const [open, setOpen] = useState();
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getDevices();
  }, []);

  const getDevices = async () => {
    try {
      setLoading(true);
      const response = await fetchDevices();
      if (response.success) {
        setDevices(response.data);
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
        <PageHeader icon={<DevicesIcon fontSize="large" />} title={"Devices"}>
          <Box sx={{ display: "flex", flexDirection: "row", gap: "1" }}>
            <InfoPopperComponent title="How to use this section">
              You can manage devices here. A device must be registered in the
              p-Chip admin portal before it can be allocated to an account. Make
              sure to click <strong>“Save”</strong> after making changes.
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
          onRowClick={(row) => {
            navigate(`/devices/${row.id}`);
          }}
          data={devices}
          columns={[
            { id: "id", label: "Device ID", type: "string", grow: false },
            { id: "name", label: "Device Name", type: "string", grow: true },
            {
              id: "isActive",
              label: "Is Active",
              type: "boolean",
              grow: false,
            },
            {
              id: "createdBy",
              label: "Created By",
              type: "string",
              grow: false,
            },
            {
              id: "createdAt",
              label: "Created Date",
              type: "date",
              grow: false,
            },
            {
              id: "updatedAt",
              label: "Last Modified Date",
              type: "date",
              grow: false,
            },
          ]}
        />
      </Box>
      <RightDrawer
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        title={"Register a new device"}
      >
        <DeviceForm
          onSuccess={async () => {
            setLoading(true);
            try {
              setOpen(false);
              await getDevices();
            } catch (error) {
              console.log("Error", error);
            } finally {
              setLoading(false);
            }
          }}
        />
      </RightDrawer>
    </Container>
  );
};

export default Devices;
