import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem
} from "@mui/material";
import { apiGet, apiPost } from "../../utils/api";

export default function AddEngineer({ onSuccess }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialization: "",
    status: "Active",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await apiPost("/api/admin/engineer/add_engineer", form);

      console.log(res)

      if (res.success) {
        alert("Engineer created successfully!");
        if (onSuccess) onSuccess();
      } else {
        alert(res.message || "Failed to create engineer.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create engineer.");
    }
  };
  return (
    <Box p={3}>
      <Card sx={{ backgroundColor: "#1e1e2f", color: "#fff" }}>
        <CardContent>
          <Typography variant="h5" mb={2} fontWeight="bold">
            Add Engineer
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  variant="outlined"
                  InputLabelProps={{ style: { color: "#aaa" } }}
                  sx={{ input: { color: "#fff" } }}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  variant="outlined"
                  InputLabelProps={{ style: { color: "#aaa" } }}
                  sx={{ input: { color: "#fff" } }}
                />
              </Grid>

              {/* Phone */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  variant="outlined"
                  InputLabelProps={{ style: { color: "#aaa" } }}
                  sx={{ input: { color: "#fff" } }}
                />
              </Grid>

              {/* Specialization */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Specialization"
                  name="specialization"
                  value={form.specialization}
                  onChange={handleChange}
                  variant="outlined"
                  InputLabelProps={{ style: { color: "#aaa" } }}
                  sx={{ input: { color: "#fff" } }}
                />
              </Grid>

              {/* Status */}
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  variant="outlined"
                  InputLabelProps={{ style: { color: "#aaa" } }}
                  sx={{ color: "#fff", '& .MuiSelect-select': { color: "#fff" } }}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </TextField>
              </Grid>

              {/* Password */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  variant="outlined"
                  InputLabelProps={{ style: { color: "#aaa" } }}
                  sx={{ input: { color: "#fff" } }}
                />
              </Grid>

              {/* Button */}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    backgroundColor: "#1976d2",
                    paddingX: 4,
                    paddingY: 1.2,
                    fontWeight: "bold",
                  }}
                >
                  Add Engineer
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
