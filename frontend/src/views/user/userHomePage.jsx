import React from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  Avatar,
} from "@mui/material";

import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RecentReportsCard from "./card/RecentReportsCard";
import UserIntroCard from "./card/UserIntroCard";
import UserProfileCard from "./card/UserProfileCard";

export default function UserHomePage() {

  const sampleReports = [
    { id: 101, category: "Ổ Gà", location: "500 Ngô Quyền", status: "Pending" },
    { id: 102, category: "Ổ chuột", location: "361 Ngô Quyền", status: "Pending" },
    { id: 103, category: "Ổ Gà", location: "361 Ngô Quyền", status: "Pending" },
  ];

  const avatarSrc = "frontend/src/assets/city_night.jpg"; // <-- CHANGE TO YOUR URL

  return (
    <Box
      sx={{
        p: 4,
        minHeight: "100vh",
        background: "radial-gradient(circle at 20% 20%, #1a1f40 0%, #0c0f26 70%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* FLOATING BG HALOS */}
      <Box
        sx={{
          position: "absolute",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "rgba(56,189,248,0.15)",
          filter: "blur(120px)",
          top: 60,
          left: -80,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(129,140,248,0.18)",
          filter: "blur(140px)",
          bottom: 80,
          right: -40,
        }}
      />

      {/* ===================== HERO SECTION ===================== */}
      <Grid container
        sx={{
          justifyContent: "space-around"
        }}
      >
        {/* LEFT: TEXT */}
        <Grid size={6}>
        <UserIntroCard username="LocNg"/>
        </Grid>
        {/* RIGHT: AVATAR PANEL */}
        <Grid size="auto">
        <UserProfileCard avatarSrc={""}/>
        </Grid>
      </Grid>

      {/* ===================== SHORTCUT FEATURE CARDS ===================== */}
      <Grid container spacing={3} sx={{ mt: 5, justifyContent: "space-around" }}>
        <FeatureCard
          icon={<ReportProblemIcon sx={{ fontSize: 42 }} />}
          title="Report an Issue"
          desc="Submit a report instantly with images and location."
          color="#fca5a5"
          href="/report-problem"
        />
        <FeatureCard
          icon={<ListAltIcon sx={{ fontSize: 42 }} />}
          title="Track My Reports"
          desc="Follow your submitted issues in real time."
          color="#93c5fd"
          href="/my-reports"
        />
        <FeatureCard
          icon={<AccessTimeIcon sx={{ fontSize: 42 }} />}
          title="View History"
          desc="Review all resolved issues in one place."
          color="#c4b5fd"
          href="/history"
        />
      </Grid>

      {/* ===================== RECENT REPORTS ===================== */}
    <RecentReportsCard reports={sampleReports} />
    </Box>
  );
}

/* ===== Reusable Feature Card ===== */
function FeatureCard({ icon, title, desc, color, href }) {
  return (
    <Grid item xs={12} md={4}>
      <Card
        onClick={() => (window.location.href = href)}
        sx={{
          p: 4,
          height: "100%",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.08)",
          transition: "0.25s",
          cursor: "pointer",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: `0 0 24px ${color}55`,
          },
        }}
      >
        <Avatar
          sx={{
            bgcolor: `${color}33`,
            width: 64,
            height: 64,
            color: color,
          }}
        >
          {icon}
        </Avatar>

        <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>
          {desc}
        </Typography>
      </Card>
    </Grid>
  );
}
