import React from "react";
import { Card, CardContent, Typography, Skeleton, Box } from "@mui/material";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";

export default function InProgressTasksCard({ isLoading, count = 5, today = 2 }) {
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
              <BuildCircleIcon
                sx={{
                  fontSize: 28,
                  color: "#FBBF24" // amber
                }}
              />
              <Typography
                variant="subtitle1"
                sx={{ color: "#FCD34D", fontWeight: 500 }}
              >
                Đang xử lý
              </Typography>
            </Box>

            {/* KPI */}
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                lineHeight: 1.1,
                background: "linear-gradient(135deg, #FEF3C7, #FBBF24)",
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
              Sự cố đang được đội kỹ thuật tiến hành
            </Typography>

            {/* Trend */}
            <Typography
              variant="caption"
              sx={{
                mt: 1,
                display: "block",
                fontWeight: 500,
                color: "#FBBF24"
              }}
            >
              +{today} hôm nay
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
