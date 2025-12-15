import { useState, useEffect } from "react";
import {
  Box, Grid, Card, Typography, InputBase, Button,
  TableContainer, TableHead, TableCell, Table, CircularProgress, 
  TableBody, TableRow, Pagination, useMediaQuery, useTheme,
  Stack, Divider, Avatar
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EngineeringIcon from '@mui/icons-material/Engineering';
import { apiGet } from "../../utils/api";
import AddEngineer from "./addEngineer";

export default function EngineersPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [search, setSearch] = useState("");
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const limit = 10; 

  const fetchEngineers = async () => {
    setLoading(true);
    try {
      const params = { page, limit, search: search || "" };
      const response = await apiGet("/api/admin/engineer", params);
      if (response.success) {
        setEngineers(response.data || []);
        setTotalPages(response.totalPages || 1);
      } else {
        setError(response.message);
      }
    } catch (err) { setError("Lỗi kết nối server."); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEngineers(); }, [page, search]);
  const handlePageChange = (_, value) => setPage(value);

  // --- MOBILE CARD COMPONENT ---
  const MobileEngineerCard = ({ eng }) => (
    <Card sx={{ mb: 2, p: 2, borderRadius: 3, border: '1px solid #444', bgcolor: '#1e2129' }}>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Avatar sx={{ bgcolor: '#1976d2' }}><EngineeringIcon /></Avatar>
        <Box>
          <Typography variant="h6" fontWeight="bold" color="#fff">{eng.fullName}</Typography>
          <Typography variant="body2" color="#aaa">{eng.email}</Typography>
        </Box>
      </Box>
      <Divider sx={{ borderColor: '#333', mb: 1.5 }} />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="#ccc">Active Tasks:</Typography>
        <Typography variant="h6" color="#38bdf8" fontWeight="bold">{eng.activeTasks}</Typography>
      </Box>
    </Card>
  );

  if (loading) return <Box sx={{ textAlign: "center", p: 5 }}><CircularProgress /></Box>;

  return (
  <>
    {showAddForm ? (
      <AddEngineer onSuccess={() => { setShowAddForm(false); fetchEngineers(); }} />
    ) : (
      <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100vh', color: '#e0e0e0' }}>
        
        <Box mb={3}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, fontSize: {xs: '1.5rem', md: '2.1rem'} }}>Engineers</Typography>
            <Typography variant="subtitle2" sx={{ color: '#bdbdbd' }}>Manage engineers and workloads</Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", bgcolor: '#23272f', borderRadius: 2, px: 2, py: 1, border: '1px solid #444' }}>
              <SearchIcon sx={{ mr: 1, color: '#bdbdbd' }} />
              <InputBase placeholder="Search engineer..." fullWidth value={search} onChange={(e) => setSearch(e.target.value)} sx={{ color: '#e0e0e0' }} />
            </Box>
          </Grid>
          <Grid item xs={12} md={2} sx={{ ml: "auto" }}>
            <Button variant="contained" fullWidth sx={{ height: "42px" }} onClick={() => setShowAddForm(true)}>Add Engineer</Button>
          </Grid>
        </Grid>

        {isMobile ? (
          // MOBILE VIEW
          <Box>{engineers.map((eng, idx) => <MobileEngineerCard key={idx} eng={eng} />)}</Box>
        ) : (
          // DESKTOP VIEW
          <Card sx={{ p: 0, borderRadius: 3, border: '1px solid #444' }}>
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader sx={{ '& .MuiTableCell-stickyHeader': { bgcolor: '#0f1720 !important', color: '#bdbdbd !important', fontWeight: 700 } }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Active Tasks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {engineers.map((eng, idx) => (
                    <TableRow key={idx} hover sx={{ '&:hover': { bgcolor: '#282c34' } }}>
                      <TableCell>{eng.fullName}</TableCell>
                      <TableCell>{eng.email}</TableCell>
                      <TableCell>{eng.activeTasks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}

        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <Pagination count={totalPages} page={page} onChange={handlePageChange} variant="outlined" shape="rounded" />
        </Box>
      </Box>
    )}
  </>
);
}