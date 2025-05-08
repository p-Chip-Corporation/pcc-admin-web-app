import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { fetchAccounts } from "../services/accountService";
import { fetchDevices } from "../services/deviceService";
import { createAccountDevice } from "../services/accountDeviceService";

const validationSchema = Yup.object({
  accountId: Yup.string().required("Account is required"),
  deviceId: Yup.string().required("Account is required"),
  isActive: Yup.boolean(),
});

export default function AccountDeviceForm({ onSuccess }) {
  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [devices, setDevices] = useState([]);
  const [loadiongDevices, setLoadingDevices] = useState(true);

  useEffect(() => {
    async function loadFormOptions() {
      try {
        const accountRequest = await fetchAccounts();
        if (accountRequest.success) {
          setAccounts(accountRequest.data);
        }
        const deviceRequest = await fetchDevices();
        if (deviceRequest.success) {
          setDevices(deviceRequest.data);
        }
      } finally {
        setLoadingAccounts(false);
        setLoadingDevices(false);
      }
    }

    loadFormOptions();
  }, []);

  const formik = useFormik({
    initialValues: {
      accountId: "",
      deviceId: "",
      isActive: true,
    },
    validationSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      try {
        console.log("Values", values);
        await createAccountDevice(values);
        await onSuccess();
      } catch (error) {
        setStatus(
          error?.response?.data?.error || "Failed to create activation."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box display="flex" flexDirection="column" gap={2}>
        <FormControl fullWidth disabled={loadingAccounts}>
          <InputLabel id="account-label">Account</InputLabel>
          <Select
            labelId="account-label"
            name="accountId"
            value={formik.values.accountId}
            onChange={formik.handleChange}
            error={formik.touched.accountId && Boolean(formik.errors.accountId)}
          >
            {loadingAccounts ? (
              <MenuItem disabled>Loading accounts...</MenuItem>
            ) : accounts.length > 0 ? (
              accounts.map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No accounts available</MenuItem>
            )}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={loadingAccounts}>
          <InputLabel id="device-label">Device</InputLabel>
          <Select
            labelId="device-label"
            name="deviceId"
            value={formik.values.deviceId}
            onChange={formik.handleChange}
            error={formik.touched.deviceId && Boolean(formik.errors.deviceId)}
          >
            {loadiongDevices ? (
              <MenuItem disabled>Loading accounts...</MenuItem>
            ) : devices.length > 0 ? (
              devices.map((device) => (
                <MenuItem key={device.id} value={device.id}>
                  {device.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No devices available</MenuItem>
            )}
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Switch
              name="isActive"
              checked={formik.values.isActive}
              onChange={formik.handleChange}
            />
          }
          label="Active"
        />

        {formik.status && <Alert severity="error">{formik.status}</Alert>}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={formik.isSubmitting}
        >
          Add Device to Account
        </Button>
      </Box>
    </form>
  );
}
