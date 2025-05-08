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
import PageHeader from "../../components/PageHeader";
import { Tabs, Tab } from "@mui/material";
import PreviewTableComponent from "../../components/PreviewTableComponent";
import AccountForm from "../../forms/AccountForm";
import RightDrawer from "../../components/RightDrawerComponent";
import { fetchUserById } from "../../services/userService";
import { fetchAccounts } from "../../services/accountService";
import { fetchDevices } from "../../services/deviceService";
import UserForm from "../../forms/UserForm";
import MetaFooter from "../../components/MetaFooter";

const UserDetails = () => {
  const { id } = useParams();
  const [open, setOpen] = useState();
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({});
  const [userCreatedAccounts, setUserCreatedAccounts] = useState({
    loaded: false,
    data: [],
  });
  const [userCreatedDevices, setUserCreatedDevices] = useState({
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
    getUserDetails();
  }, []);

  useEffect(() => {
    if (!userDetails) {
      return;
    }

    if (tabIndex === 0 && !userCreatedAccounts.loaded) {
      getCreatedAccounts();
    }

    if (tabIndex === 1 && !userCreatedDevices.loaded) {
      getUserCreatedDevices();
    }
  }, [tabIndex, userDetails]);

  const getUserDetails = async () => {
    try {
      setLoading(true);

      const request = await fetchUserById({ id: id });
      if (request.success) {
        setUserDetails(request.data);
        setTabIndex(0);
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };

  const getCreatedAccounts = async () => {
    if (!userDetails) {
      return;
    }

    try {
      setLoadingTabContent(true);
      const request = await fetchAccounts(userDetails.id);
      if (request.success) {
        setUserCreatedAccounts({ loaded: true, data: request.data });
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoadingTabContent(false);
    }
  };

  const getUserCreatedDevices = async () => {
    if (!userDetails) {
      return;
    }

    try {
      setLoadingTabContent(true);
      const request = await fetchDevices(userDetails.id);
      if (request.success) {
        setUserCreatedDevices({ loaded: true, data: request.data });
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
        title={userDetails.name}
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
              title: `Edit ${userDetails.name}`,
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
            { label: "User ID", value: userDetails.id },
            { label: "Name", value: userDetails.name },
            { label: "Email", value: userDetails.email },
            { label: "Role", value: userDetails.role },
            { label: "Is Active", value: userDetails.isActive ? "Yes" : "No" },
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
          <Tab label="Registered Accounts" />
          <Tab label="Registered Devices" />
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
              (userCreatedAccounts.data.length > 0 ? (
                <PreviewTableComponent
                  onRowClick={() => {}}
                  data={userCreatedAccounts.data}
                  columns={[
                    {
                      id: "id",
                      label: "Account ID",
                      type: "string",
                      grow: false,
                    },
                    {
                      id: "name",
                      label: "Account Name",
                      type: "string",
                      grow: true,
                    },
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
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ p: 2 }}
                >
                  No accounts have been registered
                </Typography>
              ))}
            {tabIndex === 1 &&
              (userCreatedDevices.data.length > 0 ? (
                <PreviewTableComponent
                  onRowClick={() => {}}
                  data={userCreatedDevices.data}
                  columns={[
                    {
                      id: "id",
                      label: "Account ID",
                      type: "string",
                      grow: false,
                    },
                    {
                      id: "name",
                      label: "Account Name",
                      type: "string",
                      grow: true,
                    },
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
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ p: 2 }}
                >
                  No devices have been registered
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
          <UserForm
            initialValues={userDetails}
            onSuccess={async () => {
              setLoading(true);
              try {
                setOpen(false);
                await getUserDetails();
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
        createdBy={userDetails.createdBy}
        createdAt={userDetails.createdAt}
        updatedAt={userDetails.updatedAt}
      />
    </Container>
  );
};

export default UserDetails;
