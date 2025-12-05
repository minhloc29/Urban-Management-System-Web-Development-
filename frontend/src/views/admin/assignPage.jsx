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
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ReportRow from '../../ui-component/admin/ReportRow';
import debounce from 'lodash.debounce';

export default function AssignCustomerPage() {
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [reports, setReports] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

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

        const response = await fetch(`http://localhost:5000/api/admin/assign?${params}`);
        const data = await response.json();

        if (response.ok) {
          setReports(data.data || []);
          setTotalPages(data.totalPages || 1);
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

  // debounce search
  const debounced = useMemo(() => debounce((val) => {
    setPage(1);
    loadReports({ q: val, p: 1 });
  }, 400), [loadReports]);

  useEffect(() => {
    loadReports();
    return () => debounced.cancel();
  }, [loadReports, debounced]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    debounced(e.target.value);
  };

  const handleAssigned = () => {
    loadReports(); // refresh after assignment
  };

  return (
    <Box sx={{ p: 3, background: 'linear-gradient(135deg, #23272f 0%, #2c313a 100%)', minHeight: '100vh', color: '#e0e0e0' }}>
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

      {/* Table Wrapper */}
      <Card sx={{
        p: 0,
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        color: '#e0e0e0',
        border: '1px solid rgba(255,255,255,0.03)'
      }}>
        {/* Header Row */}
        <Grid container sx={{ px: 3, py: 2, fontWeight: 700, color: '#bdbdbd', borderBottom: '1px solid rgba(255,255,255,0.03)', justifyContent: "space-around" }}>
          <Grid item xs={1.2}>ID</Grid>
          <Grid item xs={2}>Category</Grid>
          <Grid item xs={2.2}>Location</Grid>
          <Grid item xs={2}>Citizen</Grid>
          <Grid item xs={1.6}>Status</Grid>
          <Grid item xs={2}>Engineer</Grid>
          <Grid item xs={0.8} />
        </Grid>

        {/* Content */}
        {loading ? (
          <Box display="flex" justifyContent="center" p={6}><CircularProgress /></Box>
        ) : (
          <>
            {reports.length === 0 ? (
              <Box p={6} textAlign="center">No reports found</Box>
            ) : (
              <Box>
                {reports.map((r) => (
                  <Box key={r.id || r._id}>
                    <ReportRow report={r} onAssigned={handleAssigned} />
                  </Box>
                ))}
              </Box>
            )}
          </>
        )}

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
      </Card>
    </Box>
  );
}
