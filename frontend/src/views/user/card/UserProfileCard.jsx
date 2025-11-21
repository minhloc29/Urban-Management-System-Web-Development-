import React from "react";
import { Card, Avatar, Typography, Box, Grid } from "@mui/material";

export default function UserProfileCard({
  avatarSrc,
  name = "Loc Nguyen",
  role = "Smart-City Citizen",
  stats = [
    { num: "12", label: "Pending" },
    { num: "37", label: "Resolved" },
    { num: "5", label: "Overdue" }
  ]
}) {
  return (
    <Grid item xs={12} md={5}>
      <Card
        sx={{
          p: 5,
          borderRadius: "32px",
          height: "100%",
          background: "rgba(255,255,255,0.07)",
          backdropFilter: "blur(20px)",
          textAlign: "center",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 0 45px rgba(56,189,248,0.22)",
        }}
      >
        {/* Avatar */}
        <Avatar
          src={avatarSrc}
          sx={{
            width: 150,
            height: 150,
            margin: "auto",
            border: "5px solid rgba(56,189,248,0.7)",
            boxShadow: "0 0 35px rgba(56,189,248,0.55)",
          }}
        />

        {/* Name */}
        <Typography variant="h4" sx={{ mt: 3, fontWeight: 700, color: "#f1f5f9" }}>
          {name}
        </Typography>

        {/* Role */}
        <Typography sx={{ opacity: 0.65, fontSize: "1.05rem" }}>
          {role}
        </Typography>

        {/* Stats Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            mt: 5,
            px: 1,
            textAlign: "center",
          }}
        >
          {stats.map((item) => (
            <Box key={item.label}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: "#38bdf8",
                  textShadow: "0 0 12px rgba(56,189,248,0.45)",
                }}
              >
                {item.num}
              </Typography>
              <Typography sx={{ opacity: 0.6, mt: 0.5, fontSize: "0.95rem" }}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Card>
    </Grid>
  );
}
