import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import {
  Box,
  Card,
  Typography,
  Chip,
  Button,
  Pagination,
  CircularProgress,
  Alert,
} from "@mui/material";
import { gridSpacing } from "store/constant";
import axios from "axios";

const StatusChip = (status) => {
  const colors = {
    reported: { label: "Mới báo cáo", color: "default" },
    assigned: { label: "Đã phân công", color: "info" },
    in_progress: { label: "Đang xử lý", color: "warning" },
    completed: { label: "Hoàn tất", color: "success" },
    rejected: { label: "Từ chối", color: "error" },
  };
  const c = colors[status] || { label: status, color: "default" };
  return <Chip label={c.label} color={c.color} size="small" />;
};

const MyReportsPage = () => {
  const [isLoading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFromDB = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/incidents/public");
        if (res.data.success) {
          setReports(res.data.data);
        } else {
          setError("API trả về success: false");
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
        setError("Không kết nối được server (Lỗi mạng/CORS)");
      } finally {
        setLoading(false);
      }
    };
    fetchFromDB();
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ p: 5, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={gridSpacing} direction="column">
      <Grid item xs={12}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Danh Sách Sự Cố
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Typography variant="subtitle2" sx={{ color: "#777C6D", mb: 2 }}>
          Tổng số báo cáo: {reports.length}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          }}
        >
          <Grid container sx={{ fontWeight: 700, justifyContent: "space-around" }}>
            <Grid item xs={3}>Tiêu đề</Grid>
            <Grid item xs={2}>Loại</Grid>
            <Grid item xs={3}>Địa điểm</Grid>
            <Grid item xs={2}>Ngày tạo</Grid>
            <Grid item xs={2}>Trạng thái</Grid>
          </Grid>

          {reports.length === 0 ? (
            <Typography sx={{ p: 3, textAlign: "center" }}>
              Chưa có dữ liệu nào trong DB.
            </Typography>
          ) : (
            reports.map((r) => (
              <Grid
                key={r._id}
                container
                sx={{
                  py: 2,
                  borderBottom: "1px solid #EEE",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                <Grid item xs={3}>
                  <Typography variant="subtitle2" noWrap title={r.title}>
                    {r.title}
                  </Typography>
                </Grid>
                <Grid item xs={2}>{r.type_id?.name || "Khác"}</Grid>
                <Grid item xs={3}>
                  <Typography variant="body2" noWrap title={r.address}>
                    {r.address}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  {r.created_at
                    ? new Date(r.created_at).toLocaleDateString("vi-VN")
                    : "N/A"}
                </Grid>
                <Grid item xs={2}>{StatusChip(r.status)}</Grid>
              </Grid>
            ))
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

export default MyReportsPage;