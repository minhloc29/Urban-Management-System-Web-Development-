// src/pages/AssignCustomerPage.jsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  InputBase,
  IconButton,
  MenuItem,
  Select,
  Pagination,
  CircularProgress,
  Button,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import ReportRow from '../../ui-component/admin/ReportRow';
import debounce from 'lodash.debounce';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Collapse } from "@mui/material";
import { apiGet, apiPost } from '../../utils/api';
import StatusChip from '../../ui-component/admin/StatusChip';

export default function AssignCustomerPage() {
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [reports, setReports] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [openRow, setOpenRow] = useState(null);
  const [selectedEngineer, setSelectedEngineer] = useState({});

  const [engineers, setEngineers] = useState([]);

  const limit = 10;

  const loadReports = useCallback(
    async ({ q = search, s = statusFilter, p = page, so = sort } = {}) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: p,
          limit,
          search: q || '',
          status: s || '',
          sort: so || ''
        });

        const response = await apiGet(`/api/admin/assign/incidents?${params.toString()}`);
        
        console.log("Check all incidents: ", response)
        if (response.success) {
          setReports(response.data || []);
          setTotalPages(response.totalPages || 1);
        } else {
          console.error('Failed to fetch reports:', data.message);
        }
      } catch (err) {
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    },
    [search, statusFilter, page, sort]
  );

  const loadAvailableEngineers = useCallback(async () => {
  try {
    const response = await apiGet(`/api/admin/engineer/available`);
    if (response.success) {
      setEngineers(response.data || []); // Store full engineer objects
    } else {
      console.error('Failed to fetch engineers:', response.message);
    }
  } catch (err) {
    console.error('Error fetching engineers:', err);
  }
}, []);
  // debounce search
  useEffect(() => {
    loadReports();
    loadAvailableEngineers(); // Fetch engineers when the component mounts
  }, [loadReports, loadAvailableEngineers]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    debounced(e.target.value);
  };



  const handleAssigned = async (reportId) => {
    try {
      const response = await apiPost(`/api/admin/assign/assign_engineer`, {
        incidentId: reportId, // Pass the incident ID
        engineerId: selectedEngineer, // Pass the selected engineer ID
      });

      if (response.success) {
        alert("Engineer assigned successfully!");
        loadReports(); // Refresh the list of reports after assignment
      } else {
        alert(response.message || "Failed to assign engineer.");
      }
    } catch (err) {
      console.error("Error assigning engineer:", err);
      alert("Failed to assign engineer.");
    }
  };

  return (
    <Box sx={{ p: 3, minHeight: '100vh', color: '#e0e0e0' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <div>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>All Customers</Typography>
          <Typography variant="subtitle2" sx={{ color: '#bdbdbd' }}>Active Members</Typography>
        </div>

        <Box display="flex" gap={2}>
          <Button variant="outlined" size="small">Export CSV</Button>
          <Button variant="outlined" size="small">Bulk assign</Button>
        </Box>
      </Box>

      {/* Top Controls */}
      <Grid container spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
        <Grid item xs={12} sm={6} md={5}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#23272f',
              borderRadius: 2,
              px: 2,
              py: 1,
              border: '1px solid #444',
              width: '100%'
            }}
          >
            <SearchIcon sx={{ mr: 1, color: '#bdbdbd' }} />
            <InputBase
              placeholder="Search by id, location or citizen"
              fullWidth
              value={search}
              onChange={handleSearchChange}
              sx={{ color: '#e0e0e0' }}
            />
          </Box>
        </Grid>

        <Grid item xs={6} sm={3} md={2}>
          <Select
            fullWidth
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); loadReports({ s: e.target.value, p: 1 }); }}
            displayEmpty
            sx={{ backgroundColor: '#23272f', borderRadius: 2, height: '42px', color: '#e0e0e0' }}
            MenuProps={{ PaperProps: { sx: { backgroundColor: '#23272f', color: '#e0e0e0' } } }}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="assigned">Assigned</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
            <MenuItem value="critical">Critical</MenuItem>
          </Select>
        </Grid>

        <Grid item xs={6} sm={3} md={2}>
          <Select
            fullWidth
            value={sort}
            onChange={(e) => { setSort(e.target.value); loadReports({ so: e.target.value }); }}
            sx={{ backgroundColor: '#23272f', borderRadius: 2, height: '42px', color: '#e0e0e0' }}
            MenuProps={{ PaperProps: { sx: { backgroundColor: '#23272f', color: '#e0e0e0' } } }}
          >
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
          </Select>
        </Grid>
      </Grid>

      
        <TableContainer sx={{ maxHeight: 580 }}>
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
      <TableRow >
        <TableCell sx={{ color: '#bdbdbd', minWidth: 120 }}></TableCell>
        <TableCell sx={{ color: '#bdbdbd', minWidth: 120 }}>Category</TableCell>
        <TableCell sx={{ color: '#bdbdbd', minWidth: 140 }}>Citizen</TableCell>
        <TableCell sx={{ color: '#bdbdbd', minWidth: 120 }}>Status</TableCell>
        <TableCell sx={{ color: '#bdbdbd', minWidth: 140 }}>Engineer</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>

      {loading ? (
        <TableRow>
          <TableCell colSpan={7} align="center">
            <CircularProgress />
          </TableCell>
        </TableRow>
      ) : reports.length === 0 ? (
        <TableRow>
          <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
            No reports found
          </TableCell>
        </TableRow>
      ) : (
       reports.map((r) => (
  <React.Fragment key={r._id || r.id}>

    {/* Main Row */}
    <TableRow
      hover
      sx={{ cursor: "pointer" }}
      onClick={() => setOpenRow(openRow === r._id ? null : r._id)}
    >
      <TableCell>
        {openRow === r._id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </TableCell>
        <TableCell>{r.type_id.name}</TableCell>
        
      <TableCell>{r.reporter_id.fullName}</TableCell>
      <TableCell><StatusChip status={r.status} /></TableCell>
      
      <TableCell>  {r.assigned_engineer_id ? r.assigned_engineer_id.fullName : "N/A"}
</TableCell>
    </TableRow>

    {/* Expanded Row */}
    <TableRow>
      <TableCell
        colSpan={8}
        sx={{ py: 0, border: 0, backgroundColor: "rgba(255,255,255,0.02)" }}
      >
        <Collapse in={openRow === r._id} timeout="auto" unmountOnExit>
          <Box sx={{ p: 2 }}>

            <Typography sx={{ fontWeight: 600, mb: 1 }}>
              Problem Details
            </Typography>
            <Box sx={{ ml: 1, mb: 2, color: "#ccc" }}>
              <p><b>Title:</b> {r.title}</p>
              <p><b>Description:</b> {r.description || "No description"}</p>
              <p><b>Address:</b> {r.address}</p>
            </Box>

            <Typography sx={{ fontWeight: 600, mb: 1 }}>
              Assign Engineer
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Select
                size="small"
                value={selectedEngineer}
                onChange={(e) => setSelectedEngineer(e.target.value)} // Set the engineer ID
                sx={{ width: 200, background: "#07090cff", color: "white" }}
              >
                {engineers.map((eng) => (
                  <MenuItem value={eng._id} key={eng._id}>
                    {eng.fullName} {/* Display the full name */}
                  </MenuItem>
                ))}
              </Select>

              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  console.log("Assign engineer:", selectedEngineer);
                  handleAssigned(r._id);
                }}
              >
                Assign
              </Button>
            </Box>

          </Box>
        </Collapse>
      </TableCell>
    </TableRow>

  </React.Fragment>
))

      )}

    </TableBody>

  </Table>
</TableContainer>
        {/* Pagination */}
        <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, v) => { setPage(v); loadReports({ p: v }); }}
            variant="outlined"
            shape="rounded"
          />
        </Box>
    </Box>
  );
}
