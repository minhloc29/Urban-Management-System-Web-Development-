import React from "react";
import { Card, CardContent, Typography, Skeleton, Box } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function AvgTimeCard({ isLoading, avgTime = 3.2, trend = -0.4 }) {
  const isImproving = trend < 0;

  return (
    <Card
      sx={{
        height: "100%",
        width: "100%",
        background: "linear-gradient(135deg, #0B1220 0%, #111827 100%)",
        borderRadius: 3,
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: `
          0 16px 40px rgba(0,0,0,0.7),
          inset 0 1px 0 rgba(255,255,255,0.05)
        `,
        color: "#E5E7EB",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 24px 60px rgba(0,0,0,0.85)"
        }
      }}
    >
      <CardContent>
        {isLoading ? (
          <Skeleton
            variant="rectangular"
            sx={{ bgcolor: "rgba(255,255,255,0.08)" }}
          />
        ) : (
          <Box>
            {/* Title */}
            <Box display="flex" alignItems="center" gap={1.2} mb={1}>
              <AccessTimeIcon sx={{ fontSize: 28, color: "#93C5FD" }} />
              <Typography
                variant="subtitle1"
                sx={{ color: "#93C5FD", fontWeight: 500 }}
              >
                Thời gian trung bình
              </Typography>
            </Box>

            {/* Main KPI */}
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                lineHeight: 1.1,
                background: "linear-gradient(135deg, #E0F2FE, #60A5FA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              {avgTime}h
            </Typography>

            {/* Description */}
            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.6)", mt: 0.5 }}
            >
              Thời gian xử lý trung bình mỗi sự cố
            </Typography>

            {/* Trend */}
            <Typography
              variant="caption"
              sx={{
                mt: 1,
                display: "block",
                fontWeight: 500,
                color: isImproving ? "#4ADE80" : "#F87171"
              }}
            >
              {isImproving
                ? `↓ ${Math.abs(trend)}h nhanh hơn tuần trước`
                : `↑ ${trend}h chậm hơn tuần trước`}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
