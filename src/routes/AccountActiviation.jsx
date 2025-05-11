import { Paper } from "@mui/material";
import { useEffect, useState } from "react";
import RightDrawer from "../components/RightDrawerComponent";
import { fetchAccountActivations } from "../services/accountActivationService";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useNavigate, useSearchParams } from "react-router";
import FlexComponent from "../components/containers/FlexComponent";
import FilterButton from "../components/FilterButtonComponent";
import { Add, FilterList } from "@mui/icons-material";
import SquareButton from "../components/ui/SmallButton";
import PageHeader from "../components/layout/PageHeader";
import LoadingSpinner from "../components/layout/LoadingSpinner";
import DynamicTable from "../components/ui/tables/DynamicTable";
import FilterComponent from "../components/FilterComponent";

const AccountActivation = () => {
  const [open, setOpen] = useState();
  const [drawerView, setDrawerView] = useState({
    mode: "",
    title: "",
  });

  const [loading, setLoading] = useState(true);
  const [accountActivations, setAccountActivations] = useState([]);
  const [selectedAccountActivations, setSelectedAccountActivations] = useState(
    []
  );

  const [meta, setMeta] = useState({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const limit = parseInt(searchParams.get("limit") || "25", 10);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const orderBy = searchParams.get("orderBy") || "createdAt";
  const order = searchParams.get("order") || "asc";

  const filters = {
    createdBy: searchParams.get("createdBy") || undefined,
    createdAt_gte: searchParams.get("createdAt_gte") || undefined,
    createdAt_lte: searchParams.get("createdAt_lte") || undefined,
    isActive: searchParams.get("isActive") || undefined,
    accountId: searchParams.get("accountId") || undefined,
  };

  const query = searchParams.get("query") || undefined;

  useEffect(() => {
    getAccountActivations();
  }, [limit, page, orderBy, order, searchParams.toString()]);

  const getAccountActivations = async () => {
    try {
      setLoading(true);
      const response = await fetchAccountActivations({
        page,
        limit,
        orderBy,
        order,
        query,
        ...filters,
      });
      if (response.success) {
        setAccountActivations(response.data);
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
      <PageHeader
        icon={<MailOutlineIcon fontSize="large" />}
        title="ACCOUNT INVITATIONS"
      >
        <FilterButton
          onClick={() => {
            setDrawerView({
              mode: "filter",
              title: "Filter Account Devices",
            });
            setOpen(true);
          }}
        >
          <FilterList fontSize="small" />
        </FilterButton>

        {selectedAccountActivations.length > 0 ? (
          <BulkActionsMenuButton
            selected={selectedAccountActivations}
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
                title: "Register a Device with an Account",
              });
              setOpen(true);
            }}
          >
            <Add fontSize="small" />
          </SquareButton>
        )}
      </PageHeader>

      {loading ? (
        <LoadingSpinner title={"Loading Account Activations"} />
      ) : (
        <DynamicTable
          onRowClick={(row) => {
            navigate(`/account-activation/${row.id}`);
          }}
          selected={selectedAccountActivations}
          onSelectChange={setSelectedAccountActivations}
          meta={meta}
          data={accountActivations}
          columns={[
            { id: "id", label: "ID", grow: false },
            { id: "accountName", label: "Account Name", grow: true },
            { id: "email", label: "Email Address", grow: false },
            {
              id: "isClaimed",
              label: "Claimed",
              grow: false,
              type: "boolean",
            },
            { id: "createdBy", label: "Created By", grow: false },
            { id: "createdAt", label: "Created Date", grow: false },
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
          <AccountDeviceForm
            onSuccess={async () => {
              setLoading(true);
              try {
                setOpen(false);
                await getAccountActivations();
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

export default AccountActivation;
