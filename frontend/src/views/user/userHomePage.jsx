import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Avatar,
  Stack,
  CircularProgress
} from "@mui/material";
import axios from "axios";

import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import UserIntroCard from "./card/UserIntroCard";
import UserProfileCard from "./card/UserProfileCard";

export default function UserHomePage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userInfo, setUserInfo] = useState({
    fullName: "Citizen",
    role: "Smart-City Resident"
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        let displayRole = "Resident";
        if (parsedUser.role) {
          displayRole =
            parsedUser.role.charAt(0).toUpperCase() +
            parsedUser.role.slice(1);
        }

        setUserInfo({
          fullName: parsedUser.fullName || "Citizen",
          role: displayRole
        });
      } catch (err) {
        console.error("Error parsing user info:", err);
      }
    }

  }, []);

  return (
    <Box
  sx={{
    position: "relative",
    p: "40px",
    minHeight: "100vh",
    color: "white",
    overflow: "hidden",
  }}
>
  {/* Background blur effects */}
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

  {/* PAGE STACK */}
  <Stack spacing={10}>
    {/* TOP SECTION */}
    <Grid container spacing={3} sx={{
        justifyContent: "space-around",
        alignItems: "center",
      }}>
      {/* LEFT (4) */}
      <Grid size="grow">
        <UserIntroCard username={userInfo.fullName} />
      </Grid>

      {/* RIGHT (8) */}
      <Grid size={4}>
        <UserProfileCard
          name={userInfo.fullName}
          role={userInfo.role}
          avatarSrc=""
        />
      </Grid>
    </Grid>

    {/* FEATURES SECTION */}
    <Grid container spacing={2} sx={{
        justifyContent: "space-around",
        alignItems: "center",
      }}>
      <Grid size={4}>
        <FeatureCard
          icon={<ReportProblemIcon sx={{ fontSize: 42 }} />}
          title="Report an Issue"
          desc="Quickly submit reports with images and location."
          color="#fca5a5"
          href="/user/report_problem"
        />
      </Grid>

      <Grid size={4}>
        <FeatureCard
          icon={<ListAltIcon sx={{ fontSize: 42 }} />}
          title="Track My Reports"
          desc="Monitor the progress of your submitted issues."
          color="#93c5fd"
          href="/user/my_report"
        />
      </Grid>

      <Grid size="grow">
        <FeatureCard
          icon={<AccessTimeIcon sx={{ fontSize: 42 }} />}
          title="View History"
          desc="Review your completed incident history."
          color="#c4b5fd"
          href="/user/my_report"
        />
      </Grid>
    </Grid>
  </Stack>
</Box>

      <Box sx={{ mt: 4, position: "relative", zIndex: 1 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress sx={{ color: "white" }} />
          </Box>
        ) : (
          <RecentReportsCard reports={reports} />
        )}
      </Box>
    </Box>
  );
}

function FeatureCard({ icon, title, desc, color, href }) {
  return (
    // RESPONSIVE UPDATE: xs=12 (1 cột trên mobile), sm=6 (2 cột tablet), md=4 (3 cột desktop)
    <Grid item xs={12} sm={6} md={4}>
      <Card
        onClick={() => (window.location.href = href)}
        sx={{
          p: 3,
          height: "100%",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.08)",
          transition: "0.25s",
          cursor: "pointer",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: `0 0 24px ${color}55`
          }
        }}
      >
        <Avatar
          sx={{
            bgcolor: `${color}33`,
            width: 64,
            height: 64,
            color: color
          }}
        >
          {icon}
        </Avatar>
        <Typography
          variant="h6"
          sx={{ mt: 2, fontWeight: 700, color: "white" }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ opacity: 0.7, mt: 1, color: "white" }}
        >
          {desc}
        </Typography>
      </Card>
    </Grid>
  );
}
