import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  InputBase,
  Select,
  MenuItem,
  Pagination,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  useMediaQuery,
  useTheme,
  Chip
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { apiGet, apiPost, apiPatch } from "../../utils/api";
import AddEngineer from "./addEngineer";
import StatusChip from "../../ui-component/admin/StatusChip";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from "@mui/material/IconButton";

export default function ReportsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1); 

  const limit = 10;

  const handleDeleteReport = async (reportId) => {
    // 1. Confirm before delete
    const confirmed = window.confirm(
      "Are you sure you want to delete this report?"
    );
    if (!confirmed) return;

    try {
      const response = await apiPatch(
        `/api/admin/reports/${reportId}/delete`
      );

      if (response.success) {
       
        setReports((prev) =>
          prev.filter((r) => r._id !== reportId)
        );
      } else {
        alert(response.message || "Failed to delete report");
      }
    } catch (error) {
      console.error("Delete report error:", error);
      alert("Failed to delete report");
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit,
        search: search || "",
        sort: sort || "",
      });

      const response = await apiGet(`/api/admin/reports?${params.toString()}`);
      
      console.log(response)
      
      if (response.success) {

        setReports(response.data || []);
        setTotalPages(response.totalPages || 1);
      } else {
        console.error("Failed to fetch reports:", data.message);
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch reports when the component mounts or when dependencies change
  useEffect(() => {
    fetchReports();
  }, [page, sort, search]);

  const MobileReportCard = ({ row }) => (
    <Card sx={{ mb: 2, p: 2, borderRadius: 3, border: '1px solid #444', bgcolor: '#1e2129' }}>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <StatusChip status={row.status} />
        <Typography variant="caption" color="#aaa">{new Date(row.created_at).toLocaleDateString()}</Typography>
      </Box>
      <Typography variant="h6" color="#fff" fontWeight="bold" gutterBottom>{row.type_id.name}</Typography>

      <Box display="flex" gap={1} alignItems="center" mb={1} color="#ccc">
         <LocationOnIcon fontSize="small" sx={{ color: '#555' }} />
         <Typography variant="body2">
            {row.location?.coordinates ? `${row.location.coordinates[1]}, ${row.location.coordinates[0]}` : "N/A"}
         </Typography>
      </Box>

      <Divider sx={{ borderColor: '#333', my: 1.5 }} />

      <Stack spacing={1}>
        <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="#777">Reporter:</Typography>
            <Typography variant="body2" color="#ddd">{row.reporter_id.fullName}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="#777">Priority:</Typography>
            <Typography variant="body2" color="#ddd">{row.priority}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="#777">Engineer:</Typography>
            <Typography variant="body2" color="#38bdf8">{row.assigned_engineer_id ? row.assigned_engineer_id.fullName : "N/A"}</Typography>
        </Box>
      </Stack>
    </Card>
  );

  return (
    <Box sx={{ p: 3, minHeight: '100vh', color: '#e0e0e0' }}>
      {/* Page Title */}
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#e0e0e0' }}>
        All Reports
      </Typography>
      <Typography variant="subtitle2" sx={{ color: '#bdbdbd', mb: 3 }}>
        Manage all citizen-submitted issues
      </Typography>

      {/* Top Controls */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Search Bar */}
        <Grid item xs={12} sm={8} md={4}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: '#23272f',
              borderRadius: 2,
              px: 2,
              py: 1,
              border: '1px solid #444'
            }}
          >
            <SearchIcon sx={{ mr: 1, color: '#bdbdbd' }} />
            <InputBase
              placeholder="Search reports..."
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ color: '#e0e0e0' }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={4} md={2} sx={{ ml: "auto" }}>
          <Select
            fullWidth
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            sx={{
              backgroundColor: '#23272f',
              borderRadius: 2,
              height: '42px',
              color: '#e0e0e0'
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: '#23272f',
                  color: '#e0e0e0'
                }
              }
            }}
          >
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </Grid>
      </Grid>

      {isMobile ? (
        <Box>{reports.map(row => <MobileReportCard key={row.id} row={row} />)}</Box>
      ) : (
      <Card
  sx={{
    p: 0,
    borderRadius: 3,
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
    color: '#e0e0e0',
    border: '1px solid #444'
  }}
>
  <TableContainer sx={{ maxHeight: 500 }}>
    <Table stickyHeader sx={{
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

      <TableHead>
        <TableRow sx={{ backgroundColor: '#1f2229' }}>
          <TableCell sx={{ color: '#bdbdbd', fontWeight: 700 }}>Category</TableCell>
          <TableCell sx={{ color: '#bdbdbd', fontWeight: 700 }}>Location</TableCell>
          <TableCell sx={{ color: '#bdbdbd', fontWeight: 700 }}>Citizen</TableCell>
          <TableCell sx={{ color: '#bdbdbd', fontWeight: 700 }}>Status</TableCell>
          <TableCell sx={{ color: '#bdbdbd', fontWeight: 700 }}>Engineer</TableCell>
          <TableCell sx={{ color: '#bdbdbd', fontWeight: 700 }}>Reported</TableCell>
          <TableCell sx={{ color: '#bdbdbd', fontWeight: 700 }}>Delete</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {reports.map((row) => (
          <TableRow
            key={row.id}
            hover
            sx={{
              '&:hover': { backgroundColor: '#282c34', cursor: 'pointer' }
            }}
          >
            <TableCell>{row.type_id.name}</TableCell>
            <TableCell>
                    {row.location?.coordinates
                      ? `${row.location.coordinates[1]}, ${row.location.coordinates[0]}`
                      : "N/A"}
                  </TableCell>
            <TableCell>{row.reporter_id.fullName}</TableCell>
            <TableCell><StatusChip status={row.status} /></TableCell>
            
            <TableCell>{row.assigned_engineer_id ? row.assigned_engineer_id.fullName : "N/A"}</TableCell>
            <TableCell>{new Date(row.created_at).toLocaleString()}</TableCell>
            <TableCell>
              <IconButton
                color="error"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();   // IMPORTANT
                  handleDeleteReport(row._id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </TableCell>

          </TableRow>
        ))}
      </TableBody>

    </Table>
  </TableContainer>

  {/* Pagination */}
  <Box sx={{ mt: 3, display: "flex", justifyContent: "center", py: 2 }}>
    <Pagination
      count={totalPages}        // from backend
      page={page}               // controlled
      onChange={(e, value) => setPage(value)}
      variant="outlined"
      shape="rounded"
    />
  </Box>
</Card>)}
    </Box>
  );
}
