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
import AccountForm from "../forms/AccountForm";
import { fetchAccounts } from "../services/accountService";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { useNavigate } from "react-router";
import { Business, Factory } from "@mui/icons-material";

const Accounts = () => {
  const [open, setOpen] = useState();
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAccounts();
  }, []);

  const getAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetchAccounts();
      if (response.success) {
        setAccounts(response.data);
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
          icon={<Business fontSize="large" />}
          title={"Accounts"}
          breadcrumbs={true}
        >
          <Box sx={{ display: "flex", flexDirection: "row", gap: "1" }}>
            <InfoPopperComponent title="How to use this section">
              You can manage customer accounts here. Make sure to click{" "}
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
          onRowClick={(row) => {
            navigate(`/accounts/${row.id}`);
          }}
          data={accounts}
          columns={[
            { id: "id", label: "Account ID", type: "string", grow: false },
            { id: "name", label: "Account Name", type: "string", grow: true },
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
        title={"Create an Account"}
      >
        <AccountForm
          onSuccess={async () => {
            setLoading(true);
            try {
              setOpen(false);
              await getAccounts();
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

export default Accounts;
