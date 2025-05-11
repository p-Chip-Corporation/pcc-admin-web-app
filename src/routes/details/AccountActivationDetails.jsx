import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import PageHeader from "../../components/layout/DetailPageHeader";
import { Tabs, Tab } from "@mui/material";
import RightDrawer from "../../components/RightDrawerComponent";
import FlexComponent from "../../components/containers/FlexComponent";
import FlexFieldWithLabel from "../../components/containers/FlexFieldWithLabel";
import FlexLayout from "../../components/layout/FlexLayout";
import AccountDeviceForm from "../../forms/AccountDeviceForm";
import { fetchAccountDetails } from "../../services/accountService";
import { fetchAccountActivationDetails } from "../../services/accountActivationService";

const AccountActivationDetails = () => {
  const { id } = useParams();

  const [open, setOpen] = useState();
  const [loading, setLoading] = useState(true);
  const [accountActivationDetails, setAccountActivationDetails] = useState({});
  const [accountDetails, setAccountDetails] = useState({
    loaded: false,
    data: {},
  });
  const [loadingTabContent, setLoadingTabContent] = useState(true);
  const [accountAction, setAccountAction] = useState({
    mode: "",
    title: "",
  });

  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  useEffect(() => {
    getaccountActivationDetails();
  }, []);

  const getaccountActivationDetails = async () => {
    try {
      setLoading(true);

      const request = await fetchAccountActivationDetails({ id: id });
      if (request.success) {
        setAccountActivationDetails(request.data);
        setTabIndex(0);
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!accountActivationDetails) {
      return;
    }

    if (tabIndex === 0 && !accountDetails.loaded) {
      getAccountDetails();
    }
  }, [tabIndex, accountActivationDetails]);

  const getAccountDetails = async () => {
    try {
      setLoadingTabContent(true);

      const request = await fetchAccountDetails({
        id: accountActivationDetails.accountId,
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
          title={`${accountActivationDetails.accountName} - ${accountActivationDetails.email}`}
          subheader={"Account Devices"}
        >
          <Button
            variant="contained"
            size="small"
            sx={{ borderRadius: 1 }}
            onClick={() => {
              setAccountAction({
                mode: "edit",
                title: `Edit ${accountActivationDetails.deviceName} for ${accountActivationDetails.accountName}`,
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
            gap: 2,
          }}
        >
          {[
            { label: "ID", value: accountActivationDetails.id },
            {
              label: "Account Id",
              value: accountActivationDetails.accountId,
            },
            {
              label: "Account Name",
              value: accountActivationDetails.accountName,
            },
            {
              label: "Issued To",
              value: accountActivationDetails.email,
            },
            {
              label: "Issue Date",
              value: new Date(
                accountActivationDetails.issueDate
              ).toLocaleString(),
            },
            {
              label: "Expiration Date",
              value: accountActivationDetails.expiryDate
                ? new Date(accountActivationDetails.expiryDate).toLocaleString()
                : "-",
            },
            {
              label: "Active",
              value: accountActivationDetails.isActive ? "Yes" : "No",
            },
            {
              label: "Claimed",
              value: accountActivationDetails.isClaimed ? "Yes" : "No",
            },
            {
              label: "Claim Date",
              value: accountActivationDetails.claimDate
                ? new Date(accountActivationDetails.claimDate).toLocaleString()
                : "-",
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
          { label: "Created By", value: accountActivationDetails.createdBy },
          {
            label: "Created Date",
            value: new Date(
              accountActivationDetails.createdAt
            ).toLocaleString(),
          },
          {
            label: "Last Modified Date",
            value: new Date(
              accountActivationDetails.updatedAt
            ).toLocaleString(),
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
            initialValues={accountActivationDetails}
            onSuccess={async () => {
              setLoading(true);
              try {
                setOpen(false);
                await getaccountActivationDetails({ id: id });
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

export default AccountActivationDetails;
