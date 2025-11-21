import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import {
  Box,
  Card,
  Typography,
  Chip,
  Button,
  Pagination
} from "@mui/material";
import { gridSpacing } from "store/constant";
import RecentReportsCard from "./card/RecentReportsCard";

export default function MyReportsPage() {
  const [isLoading, setLoading] = useState(true);

  // simulate loading
  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  // dummy data — replace with API call
  const reports = [
    {
      id: "R221",
      category: "Road Damage (Ổ gà)",
      location: "361 Ngô Quyền",
      date: "12/11/2024",
      status: "pending"
    },
    {
      id: "R220",
      category: "Broken Streetlight",
      location: "P.5 District 2",
      date: "10/11/2024",
      status: "in_progress"
    },
    {
      id: "R219",
      category: "Garbage Overflow",
      location: "Phường 3",
      date: "08/11/2024",
      status: "completed"
    }
  ];

  const StatusChip = (status) => {
    const colors = {
      pending: { label: "Pending", color: "warning" },
      in_progress: { label: "In Progress", color: "info" },
      completed: { label: "Completed", color: "success" }
    };

    const c = colors[status] || { label: "Unknown", color: "default" };

    return <Chip label={c.label} color={c.color} size="small" />;
  };

  return (
    <Grid container spacing={gridSpacing} direction="column">
      {/* PAGE TITLE */}
      <Grid item xs={12}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          My Reports
        </Typography>
        <Typography variant="subtitle2" sx={{ color: "#777C6D", mb: 2 }}>
          View and manage your submitted issues
        </Typography>
      </Grid>

      {/* SUMMARY STAT CARDS */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ p: 2, textAlign: "center", borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {reports.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Reports
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card sx={{ p: 2, textAlign: "center", borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {reports.filter((r) => r.status === "pending").length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card sx={{ p: 2, textAlign: "center", borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {reports.filter((r) => r.status === "completed").length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* REPORT TABLE */}
      <RecentReportsCard reports={reports} />
    </Grid>
  );
}
