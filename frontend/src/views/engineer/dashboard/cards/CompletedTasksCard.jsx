import React from "react";
import { Card, CardContent, Typography, Skeleton, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function CompletedTasksCard({
  isLoading,
  count = 12,
  trend = 3
}) {
  const isPositive = trend >= 0;

  return (
    <Card
      sx={{
        height: "100%",
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
            height={80}
            sx={{ bgcolor: "rgba(255,255,255,0.08)" }}
          />
        ) : (
          <Box>
            {/* Title */}
            <Box display="flex" alignItems="center" gap={1.2} mb={1}>
              <CheckCircleIcon
                sx={{
                  fontSize: 28,
                  color: "#4ADE80"
                }}
              />
              <Typography
                variant="subtitle1"
                sx={{ color: "#86EFAC", fontWeight: 500 }}
              >
                Đã hoàn tất
              </Typography>
            </Box>

            {/* KPI */}
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                lineHeight: 1.1,
                background: "linear-gradient(135deg, #DCFCE7, #4ADE80)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              {count}
            </Typography>

            {/* Description */}
            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.6)", mt: 0.5 }}
            >
              Sự cố đã được xử lý hoàn toàn
            </Typography>

            {/* Trend */}
            <Typography
              variant="caption"
              sx={{
                mt: 1,
                display: "block",
                fontWeight: 500,
                color: isPositive ? "#4ADE80" : "#F87171"
              }}
            >
              {isPositive
                ? `↑ ${trend} so với tuần trước`
                : `↓ ${Math.abs(trend)} so với tuần trước`}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
