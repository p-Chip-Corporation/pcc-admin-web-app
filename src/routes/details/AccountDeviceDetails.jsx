import {
  Box,
  Button,
  CircularProgress,
  Divider,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import PageHeader from "../../components/layout/DetailPageHeader";
import { Tabs, Tab } from "@mui/material";
import {
  fetchAccountDeviceDetails,
  initializeAccountDevice,
} from "../../services/accountDeviceService";
import RightDrawer from "../../components/RightDrawerComponent";
import FlexComponent from "../../components/containers/FlexComponent";
import FlexFieldWithLabel from "../../components/containers/FlexFieldWithLabel";
import FlexLayout from "../../components/layout/FlexLayout";
import AccountDeviceForm from "../../forms/AccountDeviceForm";
import { fetchAccountDetails } from "../../services/accountService";
import { fetchDeviceById } from "../../services/deviceService";
import DropdownButton from "../../components/ui/buttons/DropdownButton";

const AccountDeviceDetails = () => {
  const { id } = useParams();

  const [open, setOpen] = useState();
  const [loading, setLoading] = useState(true);
  const [accountDeviceDetails, setAccountDeviceDetails] = useState({});
  const [accountDetails, setAccountDetails] = useState({
    loaded: false,
    data: {},
  });
  const [deviceDetails, setDeviceDetails] = useState({
    loaded: false,
    data: {},
  });
  const [loadingTabContent, setLoadingTabContent] = useState(true);
  const [accountAction, setAccountAction] = useState({
    mode: "",
    title: "",
  });

  console.log("Account device details", accountDeviceDetails);
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  useEffect(() => {
    getAccountDeviceDetails();
  }, []);

  const getAccountDeviceDetails = async () => {
    try {
      setLoading(true);

      const request = await fetchAccountDeviceDetails({ id: id });
      if (request.success) {
        setAccountDeviceDetails(request.data);
        setTabIndex(0);
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!accountDeviceDetails) {
      return;
    }

    if (tabIndex === 0 && !accountDetails.loaded) {
      getAccountDetails();
    }

    if (tabIndex === 1 && !deviceDetails.loaded) {
      getDeviceDetails();
    }
  }, [tabIndex, accountDeviceDetails]);

  const getAccountDetails = async () => {
    try {
      setLoadingTabContent(true);

      const request = await fetchAccountDetails({
        id: accountDeviceDetails.accountId,
      });
      if (request.success) {
        setAccountDetails({ loaded: true, data: request.data });
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoadingTabContent(false);
    }
  };

  const getDeviceDetails = async () => {
    try {
      setLoadingTabContent(true);

      const request = await fetchDeviceById({
        id: accountDeviceDetails.deviceId,
      });
      if (request.success) {
        setDeviceDetails({ loaded: true, data: request.data });
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoadingTabContent(false);
    }
  };

  const handleInitialize = async () => {
    setLoading(true);
    try {
      const response = await initializeAccountDevice({
        accountDeviceId: accountDeviceDetails.id,
      });

      if (response.success) {
        await getAccountDeviceDetails();
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
    <FlexLayout>
      <FlexComponent component={Paper} fit={true}>
        <PageHeader
          title={`${accountDeviceDetails.accountName} - ${accountDeviceDetails.deviceName}`}
          subheader={"Account Devices"}
        >
          <DropdownButton label="Actions">
            <MenuItem
              disabled={accountDeviceDetails?.pccCloudId !== null}
              onClick={handleInitialize}
            >
              Initialize
            </MenuItem>

            <MenuItem
              onClick={() => {
                setAccountAction({
                  mode: "edit",
                  title: `Edit ${accountDeviceDetails.deviceName} for ${accountDeviceDetails.accountName}`,
                });
                setOpen(true);
              }}
            >
              Edit
            </MenuItem>

            <MenuItem
              onClick={() => {
                console.log("Activation clicked");
              }}
            >
              {accountDetails.isActive ? "Deactivate" : "Activate"}
            </MenuItem>

            <MenuItem onClick={() => console.log("Delete clicked")}>
              Archive
            </MenuItem>
          </DropdownButton>
        </PageHeader>
        <Divider flexItem variant="fullWidth" />
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {[
            { label: "ID", value: accountDeviceDetails.id },
            { label: "Device Name", value: accountDeviceDetails.deviceName },
            { label: "Device Name", value: accountDeviceDetails.accountName },
            {
              label: "Active",
              value: accountDeviceDetails.isActive ? "Yes" : "No",
            },
            {
              label: "p-Chip Cloud Device ID",
              value:
                accountDeviceDetails.pccCloudId !== null
                  ? accountDeviceDetails.pccCloudId
                  : "Not Setup",
            },
          ].map(({ label, value }, index) => (
            <FlexFieldWithLabel key={index} label={label} value={value} />
          ))}
        </Box>
      </FlexComponent>

      <FlexComponent component={Paper}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ mb: 2 }}
        >
          <Tab label="Account" />
          <Tab label="Device" />
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
          <Box sx={{ px: 2 }}>
            {tabIndex === 0 &&
              (accountDetails ? (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  {[
                    { label: "ID", value: accountDetails.data.id },
                    { label: "Name", value: accountDetails.data.name },
                    {
                      label: "Active",
                      value: accountDetails.data.isActive ? "Yes" : "No",
                    },
                    {
                      label: "Created By",
                      value: accountDetails.data.createdBy,
                    },
                    {
                      label: "Created Date",
                      value: new Date(
                        accountDetails.data.createdAt
                      ).toLocaleString(),
                    },
                    {
                      label: "Last Modified Date",
                      value: new Date(
                        accountDetails.data.updatedAt
                      ).toLocaleString(),
                    },
                  ].map(({ label, value }, index) => (
                    <FlexFieldWithLabel
                      key={index}
                      label={label}
                      value={value}
                    />
                  ))}
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ p: 2 }}
                >
                  No account details available
                </Typography>
              ))}

            {tabIndex === 1 &&
              (deviceDetails ? (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 3,
                  }}
                >
                  {[
                    { label: "ID", value: deviceDetails.data.id },
                    { label: "Name", value: deviceDetails.data.name },
                    {
                      label: "Active",
                      value: deviceDetails.data.isActive ? "Yes" : "No",
                    },
                    {
                      label: "Created By",
                      value: deviceDetails.data.createdBy,
                    },
                    {
                      label: "Created Date",
                      value: new Date(
                        deviceDetails.data.createdAt
                      ).toLocaleString(),
                    },
                    {
                      label: "Last Modified Date",
                      value: new Date(
                        deviceDetails.data.updatedAt
                      ).toLocaleString(),
                    },
                  ].map(({ label, value }, index) => (
                    <FlexFieldWithLabel
                      key={index}
                      value={value}
                      label={label}
                    />
                  ))}{" "}
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ p: 2 }}
                >
                  No account devices
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
          { label: "Created By", value: accountDeviceDetails.createdBy },
          {
            label: "Created Date",
            value: new Date(accountDeviceDetails.createdAt).toLocaleString(),
          },
          {
            label: "Last Modified Date",
            value: new Date(accountDeviceDetails.updatedAt).toLocaleString(),
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
          setAccountAction({
            mode: "",
            title: "",
          });
        }}
        title={accountAction.title}
      >
        {accountAction.mode === "edit" && (
          <AccountDeviceForm
            initialValues={accountDeviceDetails}
            onSuccess={async () => {
              setLoading(true);
              try {
                setOpen(false);
                await getAccountDeviceDetails({ id: id });
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

export default AccountDeviceDetails;
