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
import { createSearchParams, useNavigate, useParams } from "react-router";
import {
  fetchAccountDetails,
  initializeAccount,
  updateAccount,
} from "../../services/accountService";
import PageHeader from "../../components/layout/DetailPageHeader";
import { Tabs, Tab } from "@mui/material";
import { fetchAccountActivations } from "../../services/accountActivationService";
import { fetchAccountDevices } from "../../services/accountDeviceService";
import PreviewTableComponent from "../../components/ui/tables/PreviewTableComponent";
import AccountForm from "../../forms/AccountForm";
import RightDrawer from "../../components/RightDrawerComponent";
import FlexComponent from "../../components/containers/FlexComponent";
import FlexFieldWithLabel from "../../components/containers/FlexFieldWithLabel";
import FlexLayout from "../../components/layout/FlexLayout";
import DropdownButton from "../../components/ui/buttons/DropdownButton";

const AccountDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
    if (!accountDetails.id) {
      return;
    }

    try {
      setLoadingTabContent(true);
      const request = await fetchAccountActivations({
        accountId: accountDetails.id,
      });
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
      const request = await fetchAccountDevices({
        accountId: accountDetails.id,
      });
      if (request.success) {
        setAccountDevices({ loaded: true, data: request.data });
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
      const response = await initializeAccount({
        accountId: accountDetails.id,
      });

      if (response.success) {
        await getAccountDetails();
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };
  console.log("Account details", accountDetails);

  const handleUpdateAccountActiveStatus = async () => {
    setLoading(true);
    try {
      const response = await updateAccount({
        id: accountDetails.id,
        name: accountDetails.name,
        isActive: accountDetails.isActive ? false : true,
      });

      if (response.success) {
        await getAccountDetails();
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
          title={accountDetails.name}
          subheader={"Account"}
          breadcrumbs={true}
        >
          <DropdownButton label="Actions">
            <MenuItem
              disabled={accountDetails?.pccCloudId !== null}
              onClick={handleInitialize}
            >
              Initialize
            </MenuItem>

            <MenuItem
              onClick={() => {
                setAccountAction({
                  mode: "edit",
                  title: `Edit ${accountDetails.name}`,
                });
                setOpen(true);
              }}
            >
              Edit
            </MenuItem>

            <MenuItem
              onClick={() => {
                handleUpdateAccountActiveStatus();
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
            { label: "ID", value: accountDetails.id },
            { label: "Name", value: accountDetails.name },
            { label: "Active", value: accountDetails.isActive ? "Yes" : "No" },
            {
              label: "p-Chip Cloud Account",
              value:
                accountDetails.pccCloudId !== null
                  ? accountDetails.pccCloudId
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
                  onViewAllClick={() => {
                    navigate({
                      pathname: "/account-activation",
                      search: createSearchParams({
                        accountId: id,
                      }).toString(),
                    });
                  }}
                  onRowClick={(row) => {
                    navigate(`/account-activation/${row.id}`);
                  }}
                  data={accountActivationRequests.data}
                  columns={[
                    { id: "id", label: "ID", grow: false },
                    { id: "email", label: "Sent To", grow: false },
                    { id: "accountId", label: "Account ID", grow: false },
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
                  onViewAllClick={() => {
                    navigate({
                      pathname: "/account-devices",
                      search: createSearchParams({
                        accountId: id,
                      }).toString(),
                    });
                  }}
                  onRowClick={(row) => {
                    navigate(`/account-devices/${row.id}`);
                  }}
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
          { label: "Created By", value: accountDetails.createdBy },
          {
            label: "Created Date",
            value: new Date(accountDetails.createdAt).toLocaleString(),
          },
          {
            label: "Last Modified Date",
            value: new Date(accountDetails.updatedAt).toLocaleString(),
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
    </FlexLayout>
  );
};

export default AccountDetails;
