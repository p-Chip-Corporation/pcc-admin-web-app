import React from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createUser } from "../services/userService";

const roleOptions = [
  { label: "Admin", value: "ADMIN" },
  { label: "Individual Contributor", value: "IC" },
];

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  role: Yup.string().oneOf(["ADMIN", "IC"]).required("Role is required"),
  isActive: Yup.boolean(),
});

export default function UserForm({ initialValues = {}, onSuccess }) {
  const isEdit = Boolean(initialValues?.id);

  const formik = useFormik({
    initialValues: {
      name: initialValues.name || "",
      email: initialValues.email || "",
      role: initialValues.role || "IC",
      isActive: initialValues.isActive ?? true,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      try {
        await createUser(values);
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

        <TextField
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          disabled={isEdit}
          fullWidth
        />

        <TextField
          select
          name="role"
          label="Role"
          value={formik.values.role}
          onChange={formik.handleChange}
          error={formik.touched.role && Boolean(formik.errors.role)}
          helperText={formik.touched.role && formik.errors.role}
          fullWidth
        >
          {roleOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

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
          {isEdit ? "Update User" : "Add User"}
        </Button>
      </Box>
    </form>
  );
}
