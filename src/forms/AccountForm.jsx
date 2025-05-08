import React from "react";
import {
  Box,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createAccount, updateAccount } from "../services/accountService";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  isActive: Yup.boolean(),
});

export default function AccountForm({ initialValues = {}, onSuccess }) {
  const isEdit = Boolean(initialValues?.id);

  const formik = useFormik({
    initialValues: {
      id: initialValues.id || "",
      name: initialValues.name || "",
      isActive: initialValues.isActive ?? true,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      try {
        if (isEdit) {
          await updateAccount(values);
        } else {
          await createAccount(values);
        }
        await onSuccess();
      } catch (error) {
        setStatus(error?.response?.data?.error || "Failed to save user.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          name="name"
          label="Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          fullWidth
        />

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
        {formik.values.isActive === false && (
          <Alert severity="warning">
            {isEdit
              ? "Deactivating this account will restrict all users from accessing associated features."
              : "No devices or invitations can be issued for this account until it has been activated."}
          </Alert>
        )}

        {formik.status && <Alert severity="error">{formik.status}</Alert>}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={formik.isSubmitting || !formik.dirty || !formik.isValid}
        >
          {isEdit ? "Update Account" : "Add Account"}
        </Button>
      </Box>
    </form>
  );
}
