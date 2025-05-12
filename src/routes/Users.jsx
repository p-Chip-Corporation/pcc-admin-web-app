import { Divider, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import RightDrawer from "../components/RightDrawerComponent";
import UserForm from "../forms/UserForm";
import { fetchUsers } from "../services/userService";
import { useNavigate, useSearchParams } from "react-router";
import FlexComponent from "../components/containers/FlexComponent";
import PageHeader from "../components/layout/PageHeader";
import { Add, FilterList, Person } from "@mui/icons-material";
import FilterButton from "../components/ui/buttons/FilterButtonComponent";
import BulkActionsMenuButton from "../components/ui/buttons/BulkActionButton";
import SquareButton from "../components/ui/buttons/SmallButton";
import LoadingSpinner from "../components/layout/LoadingSpinner";
import FilterComponent from "../components/ui/FilterComponent";
import DynamicTable from "../components/ui/tables/DynamicTable";

const Users = () => {
  const [open, setOpen] = useState();
  const [drawerView, setDrawerView] = useState({
    mode: "",
    title: "",
  });

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [meta, setMeta] = useState({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const limit = parseInt(searchParams.get("limit") || "25", 10);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const orderBy = searchParams.get("orderBy") || "createdAt";
  const order = searchParams.get("order") || "asc";

  // Flattened filters
  const filters = {
    createdBy: searchParams.get("createdBy") || undefined,
    createdAt_gte: searchParams.get("createdAt_gte") || undefined,
    createdAt_lte: searchParams.get("createdAt_lte") || undefined,
    isActive: searchParams.get("isActive") || undefined,
  };

  // Flattened search
  const query = searchParams.get("query") || undefined;

  useEffect(() => {
    getUsers();
  }, [limit, page, orderBy, order, searchParams.toString()]);

  const getUsers = async () => {
    try {
      setLoading(true);
      const response = await fetchUsers({
        page,
        limit,
        orderBy,
        order,
        query,
        ...filters,
      });
      if (response.success) {
        setUsers(response.data);
        setMeta(response.meta);
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlexComponent component={Paper}>
      <PageHeader icon={<Person fontSize="large" />} title="USERS">
        <FilterButton
          onClick={() => {
            setDrawerView({
              mode: "filter",
              title: "Filter Users",
            });
            setOpen(true);
          }}
        >
          <FilterList fontSize="small" />
        </FilterButton>

        {selectedUsers.length > 0 ? (
          <BulkActionsMenuButton
            selected={selectedUsers}
            actions={[
              {
                label: "Activate",
                onClick: (items) => console.log("Disable", items),
              },
              {
                label: "Deactivate",
                onClick: (items) => console.log("Disable", items),
              },
            ]}
          />
        ) : (
          <SquareButton
            variant="contained"
            onClick={() => {
              setDrawerView({
                mode: "add",
                title: "Create a new user",
              });
              setOpen(true);
            }}
          >
            <Add fontSize="small" />
          </SquareButton>
        )}
      </PageHeader>
      <Divider orientation="horizontal" flexItem variant="fullWidth" />
      {loading ? (
        <LoadingSpinner title={"Loading Users"} />
      ) : (
        <DynamicTable
          onRowClick={(row) => {
            navigate(`/users/${row.id}`);
          }}
          selected={selectedUsers}
          onSelectChange={setSelectedUsers}
          meta={meta}
          data={users}
          columns={[
            { id: "id", label: "ID", type: "string", grow: false },
            { id: "name", label: "Name", type: "string", grow: true },
            { id: "email", label: "Email", type: "string", grow: false },
            { id: "roleLabel", label: "Role", type: "string", grow: false },
            { id: "isActive", label: "Status", type: "boolean", grow: false },
          ]}
        />
      )}
      <RightDrawer
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        title={"Create a new user"}
      >
        {drawerView.mode === "add" && (
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
        )}
        {drawerView.mode === "filter" && (
          <FilterComponent
            onApply={() => {
              setOpen(false);
            }}
          />
        )}
      </RightDrawer>
    </FlexComponent>
  );
};

export default Users;
