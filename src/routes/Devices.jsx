import { Box, Paper } from "@mui/material";
import PaginatedTableComponent from "../components/PaginatedTableComponent";
import { useEffect, useState } from "react";
import RightDrawer from "../components/RightDrawerComponent";
import { fetchDevices } from "../services/deviceService";
import DeviceForm from "../forms/DeviceForm";
import DevicesIcon from "@mui/icons-material/Devices";
import { useNavigate, useSearchParams } from "react-router";
import FlexComponent from "../components/containers/FlexComponent";
import FilterButton from "../components/FilterButtonComponent";
import { Add, FilterList } from "@mui/icons-material";
import BulkActionsMenuButton from "../components/ui/BulkActionButton";
import SquareButton from "../components/ui/SmallButton";
import LoadingSpinner from "../components/layout/LoadingSpinner";
import FilterComponent from "../components/FilterComponent";
import PageHeader from "../components/layout/PageHeader";
import DynamicTable from "../components/ui/tables/DynamicTable";

const Devices = () => {
  const [open, setOpen] = useState();
  const [drawerView, setDrawerView] = useState({
    mode: "",
    title: "",
  });
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);

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
    getDevices();
  }, [limit, page, orderBy, order, searchParams.toString()]);

  const getDevices = async () => {
    try {
      setLoading(true);
      const response = await fetchDevices({
        page,
        limit,
        orderBy,
        order,
        query,
        ...filters,
      });
      if (response.success) {
        setDevices(response.data);
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
          icon={<DevicesIcon fontSize="large" />}
          title="REGISTERED DEVICES"
        >
          <FilterButton
            onClick={() => {
              setDrawerView({
                mode: "filter",
                title: "Filter Devices",
              });
              setOpen(true);
            }}
          >
            <FilterList fontSize="small" />
          </FilterButton>

          {selectedDevices.length > 0 ? (
            <BulkActionsMenuButton
              selected={selectedDevices}
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
                  title: "Register a new device",
                });
                setOpen(true);
              }}
            >
              <Add fontSize="small" />
            </SquareButton>
          )}
        </PageHeader>

        {loading ? (
          <LoadingSpinner title={"Loading Devices"} />
        ) : (
          <DynamicTable
            selected={selectedDevices}
            onSelectChange={setSelectedDevices}
            onRowClick={(row) => {
              navigate(`/devices/${row.id}`);
            }}
            meta={meta}
            data={devices}
            columns={[
              { id: "id", label: "Device ID", type: "string", grow: false },
              { id: "name", label: "Device Name", type: "string", grow: true },
              {
                id: "accountName",
                label: "Current Assignment",
                type: "string",
                grow: false,
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
      </Box>
      <RightDrawer
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        title={drawerView.title}
      >
        {drawerView.mode === "add" && (
          <DeviceForm
            onSuccess={async () => {
              setLoading(true);
              try {
                setOpen(false);
                await getDevices();
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

export default Devices;
