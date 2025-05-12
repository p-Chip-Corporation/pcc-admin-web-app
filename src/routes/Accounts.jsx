import { Divider, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import RightDrawer from "../components/RightDrawerComponent";
import AccountForm from "../forms/AccountForm";
import { fetchAccounts } from "../services/accountService";
import { useNavigate, useSearchParams } from "react-router";
import { Add, Business, FilterList } from "@mui/icons-material";
import DynamicTable from "../components/ui/tables/DynamicTable";
import FilterComponent from "../components/ui/FilterComponent";
import FilterButton from "../components/ui/buttons/FilterButtonComponent";
import SquareButton from "../components/ui/buttons/SmallButton";
import BulkActionsMenuButton from "../components/ui/buttons/BulkActionButton";
import FlexComponent from "../components/containers/FlexComponent";
import PageHeader from "../components/layout/PageHeader";
import LoadingSpinner from "../components/layout/LoadingSpinner";

const Accounts = () => {
  const [open, setOpen] = useState();
  const [drawerView, setDrawerView] = useState({
    mode: "",
    title: "",
  });
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);

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
    getAccounts();
  }, [limit, page, orderBy, order, searchParams.toString()]);

  const getAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetchAccounts({
        page,
        limit,
        orderBy,
        order,
        query,
        ...filters,
      });

      if (response.success) {
        setAccounts(response.data);
        setMeta(response.meta);
      }
    } catch (error) {
      console.error("Error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlexComponent component={Paper}>
      <PageHeader icon={<Business fontSize="large" />} title="ACCOUNTS">
        <FilterButton
          onClick={() => {
            setDrawerView({
              mode: "filter",
              title: "Filter Accounts",
            });
            setOpen(true);
          }}
        >
          <FilterList fontSize="small" />
        </FilterButton>

        {selectedAccounts.length > 0 ? (
          <BulkActionsMenuButton
            selected={selectedAccounts}
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
                title: "Create a new account",
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
        <LoadingSpinner title={"Loading Accounts"} />
      ) : (
        <DynamicTable
          selected={selectedAccounts}
          onSelectChange={setSelectedAccounts}
          onRowClick={(row) => navigate(`/accounts/${row.id}`)}
          meta={meta}
          data={accounts}
          columns={[
            { id: "id", label: "Account ID", type: "string", grow: false },
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
      )}
      <RightDrawer
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        title={drawerView.title}
      >
        {drawerView.mode === "add" && (
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

export default Accounts;
