import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { fetchAccounts } from "../services/accountService";
import { createAccountActivation } from "../services/accountActivationService";

const validationSchema = Yup.object({
  accountId: Yup.string().required("Account is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  expiryDate: Yup.date().optional(),
});

export default function AccountActivationForm({ onSuccess }) {
  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  useEffect(() => {
    async function loadAccounts() {
      try {
        const request = await fetchAccounts();
        if (request.success) {
          setAccounts(request.data);
        }
      } finally {
        setLoadingAccounts(false);
      }
    }

    loadAccounts();
  }, []);

  const formatDatetimeLocal = (date) => date.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"

  const formik = useFormik({
    initialValues: {
      accountId: "",
      email: "",
      expiryDate: formatDatetimeLocal(
        new Date(Date.now() + 24 * 60 * 60 * 1000)
      ),
    },
    validationSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      try {
        await createAccountActivation(values);
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

        <TextField
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          fullWidth
        />

        <TextField
          name="expiryDate"
          label="Expiry Date (optional)"
          type="datetime-local"
          value={formik.values.expiryDate}
          onChange={formik.handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        {formik.status && <Alert severity="error">{formik.status}</Alert>}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={formik.isSubmitting}
        >
          Create Activation Link
        </Button>
      </Box>
    </form>
  );
}
