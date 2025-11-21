import React from "react";
import { Grid, Card, Typography, Box, Button } from "@mui/material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function UserIntroCard({
  username = "User",
  subtitle = "AI-powered smart city insights — What would you like to do today?",
}) {
  return (
    <Grid item xs={12} md={7}>
      <Card
        sx={{
          p: 4,
          borderRadius: "22px",
          background: "rgba(255,255,255,0.07)",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 0 40px rgba(56,189,248,0.18)",
        }}
      >
        {/* MAIN TITLE */}
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#38bdf8" }}>
          Welcome back, {username}!
        </Typography>

        {/* SUBTITLE */}
        <Typography variant="body1" sx={{ mt: 1, opacity: 0.85 }}>
          {subtitle}
        </Typography>

        {/* ACTION BUTTONS */}
        <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            sx={{
              px: 3,
              py: 1.2,
              fontWeight: 600,
              color: "#0c0f26",
              bgcolor: "#38bdf8",
              "&:hover": { bgcolor: "#5fd0ff" },
            }}
            startIcon={<ReportProblemIcon />}
            href="/report-problem"
          >
            Report a Problem
          </Button>

          <Button
            sx={{
              px: 3,
              py: 1.2,
              borderColor: "#818cf8",
              color: "#818cf8",
              "&:hover": { borderColor: "#a5b4ff", color: "#a5b4ff" },
            }}
            startIcon={<ListAltIcon />}
            variant="outlined"
            href="/my-reports"
          >
            Track Reports
          </Button>

          <Button
            sx={{
              px: 3,
              py: 1.2,
              borderColor: "#6366f1",
              color: "#6366f1",
              "&:hover": { borderColor: "#818cf8", color: "#818cf8" },
            }}
            startIcon={<AccessTimeIcon />}
            variant="outlined"
            href="/history"
          >
            View History
          </Button>
        </Box>
      </Card>
    </Grid>
  );
}
