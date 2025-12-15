import { useState, useEffect } from "react";
import {
  Box, Grid, Card, Typography, InputBase, Select, MenuItem, Pagination,
  TableContainer, Table, TableRow, TableCell, TableHead, TableBody,
  useMediaQuery, useTheme, Stack, Divider
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { apiGet } from "../../utils/api";
import StatusChip from "../../ui-component/admin/StatusChip";

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

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page, limit, search, sort });
        const response = await apiGet("/api/admin/reports", params);
        if (response.success) {
          setReports(response.data || []);
          setTotalPages(response.totalPages || 1);
        }
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchReports();
  }, [page, sort, search]);

  // --- MOBILE CARD ---
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
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100vh', color: '#e0e0e0' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#e0e0e0' }}>All Reports</Typography>
      <Typography variant="subtitle2" sx={{ color: '#bdbdbd', mb: 3 }}>Manage all citizen-submitted issues</Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: "flex", alignItems: "center", bgcolor: '#23272f', borderRadius: 2, px: 2, py: 1, border: '1px solid #444' }}>
            <SearchIcon sx={{ mr: 1, color: '#bdbdbd' }} />
            <InputBase placeholder="Search reports..." fullWidth value={search} onChange={(e) => setSearch(e.target.value)} sx={{ color: '#e0e0e0' }} />
          </Box>
        </Grid>
        <Grid item xs={12} md={2} sx={{ ml: "auto" }}>
          <Select fullWidth value={sort} onChange={(e) => setSort(e.target.value)} sx={{ bgcolor: '#23272f', borderRadius: 2, height: '42px', color: '#e0e0e0' }} MenuProps={{ PaperProps: { sx: { bgcolor: '#23272f', color: '#e0e0e0' } } }}>
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
        <Card sx={{ p: 0, borderRadius: 3, border: '1px solid #444' }}>
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader sx={{ '& .MuiTableCell-stickyHeader': { bgcolor: '#0f1720 !important', color: '#bdbdbd !important', fontWeight: 700 } }}>
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Citizen</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Engineer</TableCell>
                  <TableCell>Reported</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((row) => (
                  <TableRow key={row.id} hover sx={{ '&:hover': { bgcolor: '#282c34', cursor: 'pointer' } }}>
                    <TableCell>{row.type_id.name}</TableCell>
                    <TableCell>{row.location?.coordinates ? `${row.location.coordinates[1]}, ${row.location.coordinates[0]}` : "N/A"}</TableCell>
                    <TableCell>{row.reporter_id.fullName}</TableCell>
                    <TableCell>{row.priority}</TableCell>
                    <TableCell><StatusChip status={row.status} /></TableCell>
                    <TableCell>{row.assigned_engineer_id ? row.assigned_engineer_id.fullName : "N/A"}</TableCell>
                    <TableCell>{new Date(row.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
        <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} variant="outlined" shape="rounded" />
      </Box>
    </Box>
  );
}