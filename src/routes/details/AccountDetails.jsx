import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchAccountDetails } from "../../services/accountService";
import PageHeader from "../../components/PageHeader";
import { Tabs, Tab } from "@mui/material";
import { fetchAccountActivations } from "../../services/accountActivationService";
import PaginatedTableComponent from "../../components/PaginatedTableComponent";
import { fetchAccountDevices } from "../../services/accountDeviceService";
import PreviewTableComponent from "../../components/PreviewTableComponent";
import AccountForm from "../../forms/AccountForm";
import RightDrawer from "../../components/RightDrawerComponent";
import MetaFooter from "../../components/MetaFooter";

const AccountDetails = () => {
  const { id } = useParams();
  const [open, setOpen] = useState();
  const [loading, setLoading] = useState(true);
  const [accountDetails, setAccountDetails] = useState({});
  const [accountActivationRequests, setAccountActivationRequests] = useState({
    loaded: false,
    data: [],
  });
  const [accountDevices, setAccountDevices] = useState({
    loaded: false,
    data: [],
  });
  const [loadingTabContent, setLoadingTabContent] = useState(true);
  const [accountAction, setAccountAction] = useState({
    mode: "",
    title: "",
  });

  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  useEffect(() => {
    getAccountDetails();
  }, []);

  useEffect(() => {
    if (!accountDetails) {
      return;
    }

    if (tabIndex === 0 && !accountActivationRequests.loaded) {
      getAccountActivations();
    }

    if (tabIndex === 1 && !accountDevices.loaded) {
      getAccountDevices();
    }
  }, [tabIndex, accountDetails]);

  const getAccountDetails = async () => {
    try {
      setLoading(true);

      const request = await fetchAccountDetails({ id: id });
      if (request.success) {
        setAccountDetails(request.data);
        setTabIndex(0);
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };

  const getAccountActivations = async () => {
    if (!accountDetails) {
      return;
    }

    try {
      setLoadingTabContent(true);
      const request = await fetchAccountActivations(accountDetails.id);
      if (request.success) {
        setAccountActivationRequests({ loaded: true, data: request.data });
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoadingTabContent(false);
    }
  };

  const getAccountDevices = async () => {
    if (!accountDetails) {
      return;
    }

    try {
      setLoadingTabContent(true);
      const request = await fetchAccountDevices(accountDetails.id);
      if (request.success) {
        setAccountDevices({ loaded: true, data: request.data });
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
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        width: "100%",
        height: "100%",
        gap: 2,
      }}
    >
      <PageHeader
        title={accountDetails.name}
        subheader={"Account"}
        breadcrumbs={true}
      >
        <Button
          variant="contained"
          size="small"
          sx={{ borderRadius: 1 }}
          onClick={() => {
            setAccountAction({
              mode: "edit",
              title: `Edit ${accountDetails.name}`,
            });
            setOpen(true);
          }}
        >
          Edit
        </Button>
      </PageHeader>
      <Paper sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          {[
            { label: "Account ID", value: accountDetails.id },
            { label: "Name", value: accountDetails.name },
            { label: "Active", value: accountDetails.isActive ? "Yes" : "No" },
            { label: "Created By", value: accountDetails.createdBy },
            {
              label: "Created At",
              value: new Date(accountDetails.createdAt).toLocaleString(),
            },
            {
              label: "Updated At",
              value: new Date(accountDetails.updatedAt).toLocaleString(),
            },
          ].map(({ label, value }, index) => (
            <Box
              key={index}
              sx={{
                flex: "1 1 300px",
                minWidth: 250,
                display: "flex",
                flexDirection: "column",
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
        </Box>
      </Paper>
      <Paper sx={{ p: 3 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ mb: 2 }}
        >
          <Tab label="Activation" />
          <Tab label="Devices" />
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
              (accountActivationRequests.data.length > 0 ? (
                <PreviewTableComponent
                  onRowClick={() => {}}
                  data={accountActivationRequests.data}
                  columns={[
                    { id: "id", label: "ID", grow: false },
                    { id: "email", label: "Sent To", grow: false },
                    {
                      id: "issueDate",
                      label: "Issue Date",
                      grow: false,
                      type: "date",
                    },
                    {
                      id: "expiryDate",
                      label: "Expiry Date",
                      grow: false,
                      type: "date",
                    },
                    {
                      id: "isClaimed",
                      label: "Claimed",
                      grow: false,
                      type: "boolean",
                    },
                    {
                      id: "claimedDate",
                      label: "Claimed Date",
                      grow: false,
                      type: "date",
                    },
                    { id: "createdBy", label: "Created By", grow: false },
                    {
                      id: "createdAt",
                      label: "Created Date",
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
                  No activation requests
                </Typography>
              ))}

            {tabIndex === 1 &&
              (accountDevices.data.length > 0 ? (
                <PreviewTableComponent
                  onRowClick={() => {}}
                  data={accountDevices.data}
                  columns={[
                    { id: "id", label: "ID", grow: false },

                    { id: "deviceName", label: "Device Name", grow: true },
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
          <AccountForm
            initialValues={accountDetails}
            onSuccess={async () => {
              setLoading(true);
              try {
                setOpen(false);
                await getAccountDetails();
              } catch (error) {
                console.log("Error", error);
              } finally {
                setLoading(false);
              }
            }}
          />
        )}
      </RightDrawer>
      <MetaFooter
        createdBy={accountDetails.createdBy}
        createdAt={accountDetails.createdAt}
        updatedAt={accountDetails.updatedAt}
      />
    </Container>
  );
};

export default AccountDetails;
