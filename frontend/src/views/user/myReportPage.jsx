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
} from "@mui/material";
import axios from "axios";
import { apiGet, apiPost } from "../../utils/api";
// Status chip renderer
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

// -------- TABLE COLUMN DEFINITION ----------
const columns = [
  { id: "title", label: "Tiêu đề", minWidth: 150 },
  { id: "category", label: "Loại", minWidth: 100 },
  { id: "address", label: "Địa điểm", minWidth: 200 },
  { id: "created_at", label: "Ngày tạo", minWidth: 100 },
  { id: "status", label: "Trạng thái", minWidth: 100 },
];

export default function MyReportsPage() {
  const [reports, setReports] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchFromDB = async () => {
      try {
        const res = await apiGet("/api/user/incidents/my-reports");

        if (res.success) {
          setReports(res.data);
        } else {
          setError("API trả về success: false");
        }
      } catch (err) {
        setError("Không kết nối được server.");
      } finally {
        setLoading(false);
      }
    };

    fetchFromDB();
  }, []);

  // Change page
  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  // Change rows per page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Loading state
  if (isLoading)
    return (
      <Box sx={{ textAlign: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Danh Sách Sự Cố
      </Typography>
      <Typography variant="subtitle2" sx={{ color: "#777C6D", mb: 2 }}>
        Tổng số báo cáo: {reports.length}
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {/* ---------- TABLE ---------- */}
      <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 3 }}>
        <TableContainer sx={{ maxHeight: 550 }}>
          <Table stickyHeader aria-label="incident table" sx={{
            '& .MuiTableCell-stickyHeader': {
              backgroundColor: '#0f1720 !important',
              color: '#bdbdbd !important',
              fontWeight: 700,
              position: 'sticky',
              top: 0,
              zIndex: 5,
              backgroundClip: 'padding-box',
              opacity: 1,
            }
          }}>

            {/* TABLE HEADER */}
            <TableHead>
              <TableRow>
  {columns.map((col) => (
                <TableCell
                  key={col.id}
                  sx={{ 
                    minWidth: col.minWidth,
                    color: "white",        // <-- header text color
                    fontWeight: "700"      // bold
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
            </TableHead>

            {/* TABLE ROWS */}
            <TableBody>
              {reports
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((r) => (
                  <TableRow hover key={r._id}>

                    <TableCell>{r.title}</TableCell>
                    <TableCell>{r.type_id?.name || "Khác"}</TableCell>

                    <TableCell>
                      <Typography noWrap title={r.address}>
                        {r.address}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {r.created_at
                        ? new Date(r.created_at).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </TableCell>

                    <TableCell>{StatusChip(r.status)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* PAGINATION */}
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
    </>
  );
}
