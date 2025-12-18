import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Chip,
  CircularProgress,
  Box,
  Alert,
  useMediaQuery,  // --- Thêm Import
  useTheme,       // --- Thêm Import
  Card,           // --- Thêm Import
  Stack,          // --- Thêm Import
  Divider         // --- Thêm Import
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn"; // Thêm icon cho đẹp
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"; // Thêm icon cho đẹp
import { apiGet } from "../../utils/api";

// Helper render status chip
const StatusChip = (status) => {
  const colors = {
    reported: { label: "Mới báo cáo", color: "default" },
    assigned: { label: "Đã phân công", color: "info" },
    in_progress: { label: "Đang xử lý", color: "warning" },
    completed: { label: "Hoàn tất", color: "success" },
    rejected: { label: "Từ chối", color: "error" },
  };
  const c = colors[status] || { label: status, color: "default" };
  // Thêm size="small" và variant để nhìn tinh tế hơn
  return <Chip label={c.label} color={c.color} size="small" variant="filled" sx={{fontWeight: 600}} />;
};

const columns = [
  { id: "title", label: "Tiêu đề", minWidth: 150 },
  { id: "category", label: "Loại", minWidth: 100 },
  { id: "address", label: "Địa điểm", minWidth: 200 },
  { id: "created_at", label: "Ngày tạo", minWidth: 100 },
  { id: "status", label: "Trạng thái", minWidth: 100 },
];

export default function MyReportsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Phát hiện mobile

  const [reports, setReports] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchFromDB = async () => {
      try {
        const res = await apiGet("/api/user/incidents/my-reports");
        if (res.success) {
          setReports(res.data);
        } else {
          setError("Không tải được dữ liệu.");
        }
      } catch (err) {
        setError("Không kết nối được server.");
      } finally {
        setLoading(false);
      }
    };
    fetchFromDB();
  }, []);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // --- COMPONENT CARD CHO MOBILE ---
  const MobileReportCard = ({ report }) => (
    <Card sx={{ mb: 2, p: 2, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)' }}>
      {/* Header: Title & Status */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
         <Box sx={{maxWidth: '65%'}}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{lineHeight: 1.3}}>
              {report.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
               {report.type_id?.name || "Khác"}
            </Typography>
         </Box>
         {StatusChip(report.status)}
      </Box>

      <Divider sx={{ mb: 1.5 }} />

      {/* Body: Address & Date */}
      <Stack spacing={1}>
         <Box display="flex" gap={1} alignItems="flex-start">
            <LocationOnIcon fontSize="small" color="action" sx={{mt: 0.3}} />
            <Typography variant="body2" sx={{color: '#4b5563'}}>
               {report.address}
            </Typography>
         </Box>

         <Box display="flex" gap={1} alignItems="center">
            <CalendarTodayIcon fontSize="small" color="action" />
            <Typography variant="body2" sx={{color: '#6b7280'}}>
               {report.created_at ? new Date(report.created_at).toLocaleDateString("vi-VN") : "N/A"}
            </Typography>
         </Box>
      </Stack>
    </Card>
  );

  if (isLoading)
    return (
      <Box sx={{ textAlign: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );

  // Dữ liệu phân trang
  const paginatedReports = reports.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: { xs: 0, md: 0 } }}> {/* Bỏ padding thừa nếu component cha đã có */}
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, fontSize: {xs: '1.5rem', md: '2.125rem'} }}>
        Danh Sách Sự Cố
      </Typography>
      <Typography variant="subtitle2" sx={{ color: "#777C6D", mb: 3 }}>
        Tổng số báo cáo: {reports.length}
      </Typography>

      {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}

      {/* --- LOGIC HIỂN THỊ CHÍNH --- */}
      {isMobile ? (
        // VIEW MOBILE (CARD LIST)
        <Box>
          {paginatedReports.map((r) => (
             <MobileReportCard key={r._id} report={r} />
          ))}
          {/* Pagination Component Mobile */}
          <TablePagination
             component="div"
             count={reports.length}
             rowsPerPage={rowsPerPage}
             page={page}
             labelRowsPerPage="Số dòng:"
             onPageChange={handleChangePage}
             onRowsPerPageChange={handleChangeRowsPerPage}
             sx={{ 
                '.MuiTablePagination-selectLabel': { display: 'none' }, // Ẩn chữ thừa trên mobile
                '.MuiInputBase-root': { mr: 1 } 
             }}
          />
        </Box>
      ) : (
        // VIEW DESKTOP (TABLE)
        <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <TableContainer sx={{ maxHeight: 550 }}>
            <Table stickyHeader aria-label="incident table" sx={{
              '& .MuiTableCell-stickyHeader': {
                backgroundColor: '#0f1720 !important',
                color: '#bdbdbd !important',
                fontWeight: 700,
                position: 'sticky', top: 0, zIndex: 5
              }
            }}>
              <TableHead>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell key={col.id} sx={{ minWidth: col.minWidth, fontWeight: "700" }}>
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedReports.map((r) => (
                    <TableRow hover key={r._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell><Typography fontWeight={500}>{r.title}</Typography></TableCell>
                      <TableCell>{r.type_id?.name || "Khác"}</TableCell>
                      <TableCell>
                        <Typography noWrap title={r.address} sx={{maxWidth: 250}}>
                          {r.address}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {r.created_at ? new Date(r.created_at).toLocaleDateString("vi-VN") : "N/A"}
                      </TableCell>
                      <TableCell>{StatusChip(r.status)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={reports.length}
            rowsPerPage={rowsPerPage}
            page={page}
            labelRowsPerPage="Số dòng mỗi trang:"
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Box>
  );
}