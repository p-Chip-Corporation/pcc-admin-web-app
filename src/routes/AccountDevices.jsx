import { CircularProgress, Paper } from "@mui/material";
import PaginatedTableComponent from "../components/PaginatedTableComponent";
import { useEffect, useState } from "react";
import RightDrawer from "../components/RightDrawerComponent";
import AccountDeviceForm from "../forms/AccountDeviceForm";
import { fetchAccountDevices } from "../services/accountDeviceService";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { useNavigate, useSearchParams } from "react-router";
import FlexComponent from "../components/containers/FlexComponent";
import FilterButton from "../components/FilterButtonComponent";
import { Add, FilterList } from "@mui/icons-material";
import SquareButton from "../components/ui/SmallButton";
import PageHeader from "../components/layout/PageHeader";
import LoadingSpinner from "../components/layout/LoadingSpinner";
import FilterComponent from "../components/FilterComponent";
import DynamicTable from "../components/ui/tables/DynamicTable";

const AccountDevices = () => {
  const [open, setOpen] = useState();
  const [drawerView, setDrawerView] = useState({
    mode: "",
    title: "",
  });

  const [loading, setLoading] = useState(true);
  const [accountDevices, setAccountDevices] = useState([]);
  const [selectedAccountDevices, setSelectedAccountDevices] = useState([]);

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
    deviceId: searchParams.get("deviceId") || undefined,
  };

  const query = searchParams.get("query") || undefined;

  useEffect(() => {
    getAccountDevices();
  }, [limit, page, orderBy, order, searchParams.toString()]);

  const getAccountDevices = async () => {
    try {
      setLoading(true);
      const response = await fetchAccountDevices({
        page,
        limit,
        orderBy,
        order,
        query,
        ...filters,
      });
      if (response.success) {
        setAccountDevices(response.data);
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
        icon={<QrCodeScannerIcon fontSize="large" />}
        title="DEVICES REGISTERED TO ACCOUNTS"
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

        {selectedAccountDevices.length > 0 ? (
          <BulkActionsMenuButton
            selected={selectedAccountDevices}
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
        <LoadingSpinner title={"Loading Users"} />
      ) : (
        <DynamicTable
          onRowClick={(row) => {
            navigate(`/account-devices/${row.id}`);
          }}
          meta={meta}
          selected={selectedAccountDevices}
          onSelectChange={setSelectedAccountDevices}
          data={accountDevices}
          columns={[
            { id: "id", label: "ID", grow: false },
            { id: "accountName", label: "Account Name", grow: true },
            { id: "deviceName", label: "Device Name", grow: false },
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
                await getAccountDevices();
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

export default AccountDevices;
