import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { createSearchParams, useNavigate, useParams } from "react-router";
import PageHeader from "../../components/layout/DetailPageHeader";
import { Tabs, Tab } from "@mui/material";
import { fetchAccountDevices } from "../../services/accountDeviceService";
import PreviewTableComponent from "../../components/ui/tables/PreviewTableComponent";
import AccountForm from "../../forms/AccountForm";
import RightDrawer from "../../components/RightDrawerComponent";
import { fetchDeviceById } from "../../services/deviceService";
import DeviceForm from "../../forms/DeviceForm";
import FlexLayout from "../../components/layout/FlexLayout";
import FlexComponent from "../../components/containers/FlexComponent";
import FlexFieldWithLabel from "../../components/containers/FlexFieldWithLabel";

const DeviceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState();
  const [loading, setLoading] = useState(true);
  const [deviceDetails, setDeviceDetails] = useState(null);
  const [accounts, setAccounts] = useState({
    loaded: false,
    data: [],
  });
  const [loadingTabContent, setLoadingTabContent] = useState(true);
  const [deviceAction, setDeviceAction] = useState({
    mode: "",
    title: "",
  });

  console.log("Device details", deviceDetails);

  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  useEffect(() => {
    getDeviceDetails();
  }, []);

  useEffect(() => {
    if (!deviceDetails) {
      return;
    }

    if (tabIndex === 0 && !accounts.loaded) {
      getAccounts();
    }
  }, [tabIndex, deviceDetails]);

  const getDeviceDetails = async () => {
    try {
      setLoading(true);

      const request = await fetchDeviceById({ id: id });
      if (request.success) {
        setDeviceDetails(request.data);
        setTabIndex(0);
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };

  const getAccounts = async () => {
    if (!deviceDetails) {
      return;
    }

    try {
      setLoadingTabContent(true);
      const request = await fetchAccountDevices({ deviceId: deviceDetails.id }); // filter by deviceId

      if (request.success) {
        setAccounts({ loaded: true, data: request.data });
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoadingTabContent(false);
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
    <FlexLayout>
      <FlexComponent component={Paper} fit={true}>
        <PageHeader
          title={deviceDetails.name}
          subheader={"Account"}
          breadcrumbs={true}
        >
          <Button
            variant="contained"
            size="small"
            sx={{ borderRadius: 1 }}
            onClick={() => {
              setDeviceAction({
                mode: "edit",
                title: `Edit ${deviceDetails.name}`,
              });
              setOpen(true);
            }}
          >
            Edit
          </Button>
        </PageHeader>
        <Divider flexItem variant="fullWidth" />
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          {[
            { label: "ID", value: deviceDetails.id },
            { label: "Name", value: deviceDetails.name },
            { label: "Active", value: deviceDetails.isActive ? "Yes" : "No" },
          ].map(({ label, value }, index) => (
            <FlexFieldWithLabel key={index} value={value} label={label} />
          ))}
        </Box>
      </FlexComponent>

      <FlexComponent component={Paper} sx={{ p: 3 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ mb: 2 }}
        >
          <Tab label="Accounts" />
        </Tabs>
        {loadingTabContent ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {tabIndex === 0 &&
              (accounts.data.length > 0 ? (
                <PreviewTableComponent
                  onViewAllClick={() => {
                    navigate({
                      pathname: "/account-devices",
                      search: createSearchParams({
                        deviceId: id,
                      }).toString(),
                    });
                  }}
                  onRowClick={(row) => {
                    navigate(`/account-devices?deviceId=${row.deviceId}`);
                  }}
                  data={accounts.data}
                  columns={[
                    { id: "accountId", label: "Account ID", grow: false },
                    { id: "accountName", label: "Account Name", grow: true },
                    {
                      id: "isActive",
                      label: "Is Active",
                      grow: false,
                      type: "boolean",
                    },
                    {
                      id: "createdBy",
                      label: "Created By",
                      grow: false,
                    },
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
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ p: 2 }}
                >
                  No devices have been registred to accounts
                </Typography>
              ))}
          </Box>
        )}
      </FlexComponent>
      <Paper
        sx={{
          mt: "auto", // pushes this element to the bottom in a flex column layout
          p: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        {[
          { label: "Created By", value: deviceDetails.createdBy },
          {
            label: "Created Date",
            value: new Date(deviceDetails.createdAt).toLocaleString(),
          },
          {
            label: "Last Modified Date",
            value: new Date(deviceDetails.updatedAt).toLocaleString(),
          },
        ].map(({ label, value }, index) => (
          <Box
            key={index}
            sx={{
              flex: "1 1 300px",
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 0.5 }}
            >
              {label}
            </Typography>
            <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
              {value}
            </Typography>
          </Box>
        ))}
      </Paper>
      <RightDrawer
        open={open}
        onClose={() => {
          setOpen(false);
          setDeviceAction({
            mode: "",
            title: "",
          });
        }}
        title={deviceAction.title}
      >
        {deviceAction.mode === "edit" && (
          <DeviceForm
            initialValues={deviceDetails}
            onSuccess={async () => {
              setLoading(true);
              try {
                setOpen(false);
                await getDeviceDetails();
              } catch (error) {
                console.log("Error", error);
              } finally {
                setLoading(false);
              }
            }}
          />
        )}
      </RightDrawer>
    </FlexLayout>
  );
};

export default DeviceDetails;
