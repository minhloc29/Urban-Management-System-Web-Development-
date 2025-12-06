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
  Pagination
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { apiGet, apiPost } from "../../utils/api";
import AddEngineer from "./addEngineer";

export default function EngineersPage() {
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
      
      console.log(response)
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

  const getStatusChip = (status) => {
    const colors = {
      Active: { bg: "#D3F9D8", text: "#2B8A3E" },
      Busy: { bg: "#FFE7D9", text: "#B93815" },
      Offline: { bg: "#E0E0E0", text: "#555" }
    };

    const defaultColor = { bg: "#E0E0E0", text: "#555" };
    const color = colors[status] || defaultColor;

    return (
      <Chip
        label={status || "Unknown"}
        sx={{
          backgroundColor: color.bg,
          color: color.text,
          fontWeight: 600,
          borderRadius: "8px",
        }}
      />
    );
  };

  const handlePageChange = (_, value) => {
    setPage(value);
  };

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
      <Box sx={{ p: 3, background: 'linear-gradient(135deg, #23272f 0%, #2c313a 100%)', minHeight: '100vh', color: '#e0e0e0' }}>
        
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
        <Card sx={{ p: 0, borderRadius: 3, background: 'linear-gradient(135deg, #23272f 0%, #2c313a 100%)', border: '1px solid #444' }}>
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
                  <TableCell sx={{ color: '#bdbdbd', fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ color: '#bdbdbd', fontWeight: 700 }}>Active Tasks</TableCell>
                  <TableCell sx={{ color: '#bdbdbd', fontWeight: 700 }}>Action</TableCell>
                </TableRow>
              </TableHead>

              {/* Rows */}
              <TableBody>
                {engineers.map((eng, idx) => (
                  <TableRow key={idx} hover sx={{ '&:hover': { backgroundColor: '#282c34' } }}>
                    <TableCell>{eng.name}</TableCell>
                    <TableCell>{eng.email}</TableCell>
                    <TableCell>{getStatusChip(eng.status)}</TableCell>
                    <TableCell>{eng.tasks}</TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined">View</Button>
                    </TableCell>
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
        </Card>
      </Box>
    )}
  </>
);

}
