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
import UserForm from "../forms/UserForm";
import { fetchUsers } from "../services/userService";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate } from "react-router";

const Users = () => {
  const [open, setOpen] = useState();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      setLoading(true);
      const response = await fetchUsers();
      if (response.success) {
        setUsers(response.data);
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
        flexGrow: 1,
        height: "100%",
        width: "100%",
        overflow: "auto",
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
        <PageHeader icon={<PeopleIcon fontSize="large" />} title={"Users"}>
          <Box sx={{ display: "flex", flexDirection: "row", gap: "1" }}>
            <InfoPopperComponent title="How to use this section">
              You can manage internal p-Chip user here. Users will have access
              to the p-Chip web portal. After create a user you will need to
              update user permissions. By default, all users will be created
              with read only permissions. Make sure to click{" "}
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
            navigate(`/users/${row.id}`);
          }}
          data={users}
          columns={[
            { id: "id", label: "ID", type: "string", grow: false },
            { id: "name", label: "Name", type: "string", grow: true },
            { id: "email", label: "Email", type: "string", grow: false },
            { id: "role", label: "Role", type: "string", grow: false },
            { id: "isActive", label: "Status", type: "boolean", grow: false },
          ]}
        />
      </Box>
      <RightDrawer
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        title={"Create a new user"}
      >
        <UserForm
          onSuccess={async () => {
            setLoading(true);
            try {
              setOpen(false);
              await getUsers();
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

export default Users;
