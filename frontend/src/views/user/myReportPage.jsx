import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import {
  Box,
  Card,
  Typography,
  Chip,
  CircularProgress,
  Alert
} from "@mui/material";
import { gridSpacing } from "store/constant";
import axios from "axios";

export default function MyReportsPage() {
  const [isLoading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);

  // --- HÀM GỌI DỮ LIỆU TỪ DATABASE ---
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
        setError("Không kết nối được server (Lỗi mạng/CORS). Hãy kiểm tra xem server backend có đang chạy ở port 3000 không.");
      } finally {
        setLoading(false);
      }
    };

    fetchFromDB();
  }, []);

  // Hàm map màu sắc cho trạng thái
  const StatusChip = (status) => {
    const colors = {
      reported: { label: "Mới báo cáo", color: "default" },
      assigned: { label: "Đã phân công", color: "info" },
      in_progress: { label: "Đang xử lý", color: "warning" },
      completed: { label: "Hoàn tất", color: "success" },
      rejected: { label: "Từ chối", color: "error" }
    };
    const c = colors[status] || { label: status, color: "default" };

    return <Chip label={c.label} color={c.color} size="small" variant="filled" />;
  };

  if (isLoading) {
    return <Box sx={{ p: 5, textAlign: "center" }}><CircularProgress /></Box>;
  }

  return (
    <Grid container spacing={gridSpacing} direction="column">

      <Grid item xs={12}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Danh Sách Sự Cố
        </Typography>
        {error && <Alert severity="error" sx={{mt: 2}}>{error}</Alert>}
        <Typography variant="subtitle2" sx={{ color: "#777C6D", mb: 2, mt: 1 }}>
          Tổng số báo cáo: {reports.length}
        </Typography>
      </Grid>

      {/* BẢNG DỮ LIỆU */}
      <Grid item xs={12}>
        <Card sx={{ p: 0, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", overflow: 'hidden' }}>
          
          {/* HEADER (Nền xám nhẹ để tách biệt) */}
          <Box sx={{ bgcolor: "#f8fafc", px: 3, py: 2, borderBottom: "1px solid #e2e8f0" }}>
            <Grid container alignItems="center">
              <Grid item xs={1} sx={{ textAlign: 'center' }}>Ảnh</Grid> 
              <Grid item xs={3}>Tiêu đề</Grid>
              <Grid item xs={2}>Loại</Grid>
              <Grid item xs={3}>Địa điểm</Grid>
              <Grid item xs={1.5} sx={{ textAlign: 'center' }}>Ngày tạo</Grid>
              <Grid item xs={1.5} sx={{ textAlign: 'center' }}>Trạng thái</Grid>
            </Grid>
          </Box>

          {/* ROWS - Loop qua dữ liệu thật */}
          <Box sx={{ px: 3 }}>
            {reports.length === 0 ? (
              <Typography sx={{ p: 4, textAlign: "center", color: 'gray' }}>Chưa có dữ liệu nào trong DB.</Typography>
            ) : (
              reports.map((r) => (
                <Grid
                  key={r._id}
                  container
                  sx={{ 
                    py: 2, 
                    borderBottom: "1px solid #f1f5f9", 
                    alignItems: "center",
                    '&:last-child': { borderBottom: 'none' } // Bỏ gạch chân dòng cuối
                  }}
                >
                  {/* CỘT 1: Hình ảnh (Thu nhỏ cột này lại còn xs={1}) */}
                  <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                    {r.images && r.images.length > 0 ? (
                      <img
                        src={r.images[0].image_url}
                        alt="incident"
                        style={{
                          width: 48,
                          height: 48,
                          objectFit: "cover",
                          borderRadius: 8,
                          border: "1px solid #e2e8f0"
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: "#f1f5f9",
                          borderRadius: 8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" sx={{fontSize: '0.6rem'}}>No Img</Typography>
                      </Box>
                    )}
                  </Grid>

                  {/* CỘT 2: Tiêu đề */}
                  <Grid item xs={3} sx={{ pr: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                      {r.title}
                    </Typography>
                  </Grid>

                  {/* CỘT 3: Loại */}
                  <Grid item xs={2}>
                    <Chip 
                        label={r.type_id?.name || "Khác"} 
                        size="small" 
                        variant="outlined" 
                        sx={{ bgcolor: 'white', borderColor: '#cbd5e1' }}
                    />
                  </Grid>

                  {/* CỘT 4: Địa điểm (Tăng width lên xs={3} để hiển thị rõ hơn) */}
                  <Grid item xs={3} sx={{ pr: 2 }}>
                    <Typography variant="body2" color="text.secondary" noWrap title={r.address}>
                      {r.address}
                    </Typography>
                  </Grid>

                  {/* CỘT 5: Ngày tạo (Căn giữa) */}
                  <Grid item xs={1.5} sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {r.created_at ? new Date(r.created_at).toLocaleDateString("vi-VN") : "N/A"}
                    </Typography>
                  </Grid>

                  {/* CỘT 6: Trạng thái (Căn giữa) */}
                  <Grid item xs={1.5} sx={{ textAlign: 'center' }}>
                    {StatusChip(r.status)}
                  </Grid>
                </Grid>
              ))
            )}
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}