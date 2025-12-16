import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  InputBase,
  Button,
  Chip,
  TableContainer,
  TableHead,
  TableCell,
  Table,
  CircularProgress,
  TableBody,
  TableRow,
  Pagination,
  useMediaQuery,
  useTheme
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { apiGet, apiPost } from "../../utils/api";
import AddEngineer from "./addEngineer";
import StatusChip from "../../ui-component/admin/StatusChip";

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
    setError(null);

    try {
      const params = {
        page,
        limit,
        search: search || "",
      };

      const response = await apiGet("/api/admin/engineer", params);
      
      if (response.success) {
        setEngineers(response.data || []);
        setTotalPages(response.totalPages || 1);
      } else {
        setError(response.message || "Failed to fetch engineers");
      }
    } catch (err) {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEngineers();
  }, [page, search]);

  
  const handlePageChange = (_, value) => {
    setPage(value);
  };
  
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

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
  <>
    {showAddForm ? (
      <AddEngineer onSuccess={() => {
        setShowAddForm(false);
        fetchEngineers(); // refresh list after adding
      }} />
    ) : (
      <Box sx={{ p: 3, minHeight: '100vh', color: '#e0e0e0' }}>
        
        {/* Title */}
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Engineers
        </Typography>
        <Typography variant="subtitle2" sx={{ color: '#bdbdbd', mb: 3 }}>
          Manage engineers and workloads
        </Typography>

        {/* Search + Add Button */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
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
                placeholder="Search engineer..."
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ color: '#e0e0e0' }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={4} md={2} sx={{ ml: "auto" }}>
            <Button
              variant="contained"
              fullWidth
              sx={{ height: "42px" }}
              onClick={() => setShowAddForm(true)}
            >
              Add Engineer
            </Button>
          </Grid>
        </Grid>

        {/* Table */}
        {isMobile ? (
          // MOBILE VIEW
          <Box>{engineers.map((eng, idx) => <MobileEngineerCard key={idx} eng={eng} />)}</Box>
        ) : (
        <Card sx={{ p: 0, borderRadius: 3, border: '1px solid #444' }}>
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
              {/* Header */}
              <TableHead>
                <TableRow sx={{ backgroundColor: '#1f2229' }}>
                  <TableCell sx={{ color: '#bdbdbd', fontWeight: 700 }}>Name</TableCell>
                  <TableCell sx={{ color: '#bdbdbd', fontWeight: 700 }}>Email</TableCell>
                  <TableCell sx={{ color: '#bdbdbd', fontWeight: 700 }}>Active Tasks</TableCell>
                </TableRow>
              </TableHead>

              {/* Rows */}
              <TableBody>
                {engineers.map((eng, idx) => (
                  <TableRow key={idx} hover sx={{ '&:hover': { backgroundColor: '#282c34' } }}>
                    <TableCell>{eng.fullName}</TableCell>
                    <TableCell>{eng.email}</TableCell>
                    <TableCell>{eng.activeTasks}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "center", py: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
            />
          </Box>
        </Card> )}
      </Box>
    )}
  </>
);

}
