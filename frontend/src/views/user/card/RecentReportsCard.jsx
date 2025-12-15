import React from "react";
import { Card, Typography, Grid, Button, Box } from "@mui/material"; // Thêm Box
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function RecentReportsCard({ reports = [] }) {
  return (
    <Card
      sx={{
        p: { xs: 2, md: 4 }, // Padding nhỏ lại trên mobile
        mt: 5,
        borderRadius: "20px",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden" // Để bo góc đẹp
      }}
    >
      <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: 700, color: "#38bdf8" }}
      >
        Recent Reports
      </Typography>

      {/* RESPONSIVE UPDATE: Bọc toàn bộ phần Grid giả Table vào Box cuộn ngang */}
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        {/* Đặt minWidth để đảm bảo giao diện không bị co rúm trên mobile */}
        <Box sx={{ minWidth: "600px" }}> 
          
          {/* Header Row */}
          <Grid
            container
            sx={{ opacity: 0.6, mb: 1, fontWeight: 600, justifyContent: "space-around" }}
          >
            <Grid item xs={2}>ID</Grid>
            <Grid item xs={3}>Category</Grid>
            <Grid item xs={3}>Location</Grid>
            <Grid item xs={2}>Status</Grid>
            <Grid item xs={2}>Action</Grid>
          </Grid>

          {/* Body Rows */}
          {reports.map((item) => (
            <Grid
              key={item.id}
              container
              sx={{
                justifyContent: "space-around",
                py: 2,
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                "&:hover": {
                  background: "rgba(255,255,255,0.03)",
                  cursor: "pointer",
                },
              }}
            >
              <Grid item xs={2}>R{item.id}</Grid>
              <Grid item xs={3}>{item.category}</Grid>
              <Grid item xs={3}>
                  {/* Cắt bớt địa chỉ nếu quá dài */}
                  <Typography noWrap variant="body2">{item.location}</Typography>
              </Grid>
              <Grid item xs={2} sx={{ color: "#facc15" }}>
                {item.status}
              </Grid>

              <Grid item xs={2}>
                <Button
                  endIcon={<ArrowForwardIcon />}
                  size="small"
                  sx={{
                    color: "#38bdf8",
                    "&:hover": { color: "#5fd0ff" },
                    minWidth: "auto" // Giúp nút gọn hơn
                  }}
                  onClick={() => window.location.href = `/reports/${item.id}`}
                >
                  View
                </Button>
              </Grid>
            </Grid>
          ))}
        </Box>
      </Box>
    </Card>
  );
}