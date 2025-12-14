import React from "react";
import { Card, CardContent, Typography, Skeleton, Box } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";

export default function AssignedTasksCard({ isLoading }) {
  return (
   <Card
  sx={{
    height: "100%",
    background: "linear-gradient(135deg, #0B1220, #111827)",
    borderRadius: 3,
    position: "relative",
    overflow: "hidden",
    boxShadow: `
      0 20px 50px rgba(0,0,0,0.7)
    `,
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      borderRadius: 3,
      padding: "1px",
      background: "linear-gradient(135deg, rgba(96,165,250,0.6), transparent)",
      WebkitMask:
        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
      WebkitMaskComposite: "xor",
      pointerEvents: "none"
    }
  }}
>

      <CardContent>
        {isLoading ? (
          <Skeleton
            variant="rectangular"
            height={70}
            sx={{ bgcolor: "rgba(255,255,255,0.08)" }}
          />
        ) : (
          <>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <AssignmentIcon sx={{ color: "#60A5FA" }} />
              <Typography variant="subtitle2" sx={{ color: "#93C5FD" }}>
                Nhiệm vụ được giao
              </Typography>
            </Box>

            <Typography variant="h3" sx={{ fontWeight: 600 }}>
              8
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.6)", mt: 0.5 }}
            >
              Tổng số nhiệm vụ hiện tại
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
}
