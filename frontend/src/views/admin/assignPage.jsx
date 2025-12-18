// src/pages/AssignCustomerPage.jsx
import React, { useEffect, useMemo, useState, useCallback} from 'react';
import {
  Box, Grid, Typography, InputBase, MenuItem, Select, Pagination, CircularProgress,
  Button, Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
  useMediaQuery, useTheme, Card, Collapse, Divider, Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { apiGet, apiPost } from '../../utils/api';
import StatusChip from '../../ui-component/admin/StatusChip';

export default function AssignCustomerPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [reports, setReports] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openRow, setOpenRow] = useState(null);
  const [selectedEngineer, setSelectedEngineer] = useState(""); // Change to string/null
  const [engineers, setEngineers] = useState([]);
  const limit = 10;

  const loadReports = useCallback(async ({ q = search, s = statusFilter, p = page, so = sort } = {}) => {
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
        
        if (response.success) {
          setReports(response.data || []);
          setTotalPages(response.totalPages || 1);
        }
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    }, [search, statusFilter, page, sort]);

  const loadAvailableEngineers = useCallback(async () => {
    try {
      const response = await apiGet(`/api/admin/engineer/available`);
      if (response.success) setEngineers(response.data || []);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => { loadReports(); loadAvailableEngineers(); }, [loadReports, loadAvailableEngineers]);

  const handleAssigned = async (reportId) => {
    if (!selectedEngineer) return alert("Please select an engineer");
    try {
      const response = await apiPost(`/api/admin/assign/assign_engineer`, { incidentId: reportId, engineerId: selectedEngineer });
      if (response.success) { alert("Assigned successfully!"); loadReports(); setOpenRow(null); setSelectedEngineer(""); } 
      else { alert(response.message); }
    } catch (err) { console.error(err); alert("Failed."); }
  };

  // --- MOBILE ASSIGN CARD ---
  const MobileAssignCard = ({ r }) => {
    const isOpen = openRow === r._id;
    return (
      <Card sx={{ mb: 2, p: 2, borderRadius: 3, border: '1px solid #444', bgcolor: '#1e2129' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" onClick={() => setOpenRow(isOpen ? null : r._id)}>
          <Box>
            <Typography variant="subtitle1" color="#fff" fontWeight="bold">{r.type_id.name}</Typography>
            <Typography variant="caption" color="#aaa">{r.reporter_id.fullName}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
             <StatusChip status={r.status} />
             {isOpen ? <ExpandLessIcon sx={{color: '#fff'}}/> : <ExpandMoreIcon sx={{color: '#fff'}}/>}
          </Box>
        </Box>
        
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <Divider sx={{ borderColor: '#333', my: 2 }} />
            <Typography variant="body2" color="#ccc" mb={1}><b>Desc:</b> {r.description || "No description"}</Typography>
            <Typography variant="body2" color="#ccc" mb={2}><b>Address:</b> {r.address}</Typography>
            
            <Typography variant="subtitle2" color="#fff" mb={1}>Assign Engineer:</Typography>
            <Stack direction="row" spacing={1}>
                <Select size="small" fullWidth value={selectedEngineer} onChange={(e) => setSelectedEngineer(e.target.value)} sx={{ background: "#07090cff", color: "white" }}>
                    {engineers.map((eng) => <MenuItem value={eng._id} key={eng._id}>{eng.fullName}</MenuItem>)}
                </Select>
                <Button variant="contained" onClick={() => handleAssigned(r._id)}>Assign</Button>
            </Stack>
        </Collapse>
      </Card>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100vh', color: '#e0e0e0' }}>
      <Box mb={3}>
         <Typography variant="h4" sx={{ fontWeight: 600, fontSize: {xs: '1.5rem', md: '2.1rem'} }}>Assignments</Typography>
         <Typography variant="subtitle2" sx={{ color: '#bdbdbd' }}>Assign incidents to engineers</Typography>
      </Box>

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
            <MenuItem value="reported">Reported</MenuItem>
            <MenuItem value="assigned">Assigned</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={6} md={3}>
            <Select fullWidth value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} displayEmpty sx={{ bgcolor: '#23272f', color: '#e0e0e0', height: 45 }}>
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="assigned">Assigned</MenuItem>
            </Select>
        </Grid>
      </Grid>

      {/* DATA VIEW */}
      {loading ? <Box textAlign="center" p={5}><CircularProgress/></Box> : 
       isMobile ? (
         <Box>{reports.map(r => <MobileAssignCard key={r._id} r={r} />)}</Box>
       ) : (
         <TableContainer sx={{ maxHeight: 580, border: '1px solid #444', borderRadius: 3 }}>
           <Table stickyHeader sx={{ '& .MuiTableCell-stickyHeader': { bgcolor: '#0f1720 !important', color: '#bdbdbd !important', fontWeight: 700 } }}>
             <TableHead>
               <TableRow>
                 <TableCell sx={{width: 50}}/>
                 <TableCell>Category</TableCell>
                 <TableCell>Citizen</TableCell>
                 <TableCell>Status</TableCell>
                 <TableCell>Engineer</TableCell>
               </TableRow>
             </TableHead>
             <TableBody>
               {reports.map((r) => (
                 <React.Fragment key={r._id}>
                   <TableRow hover onClick={() => setOpenRow(openRow === r._id ? null : r._id)} sx={{ cursor: "pointer" }}>
                     <TableCell>{openRow === r._id ? <ExpandLessIcon /> : <ExpandMoreIcon />}</TableCell>
                     <TableCell>{r.type_id.name}</TableCell>
                     <TableCell>{r.reporter_id.fullName}</TableCell>
                     <TableCell><StatusChip status={r.status} /></TableCell>
                     <TableCell>{r.assigned_engineer_id ? r.assigned_engineer_id.fullName : "N/A"}</TableCell>
                   </TableRow>
                   <TableRow>
                     <TableCell colSpan={6} sx={{ py: 0, border: 0, bgcolor: "rgba(255,255,255,0.02)" }}>
                       <Collapse in={openRow === r._id} timeout="auto" unmountOnExit>
                         <Box sx={{ p: 2 }}>
                           <Typography sx={{ fontWeight: 600, mb: 1 }}>Details</Typography>
                           <Box sx={{ ml: 1, mb: 2, color: "#ccc" }}>
                             <p><b>Title:</b> {r.title}</p>
                             <p><b>Address:</b> {r.address}</p>
                           </Box>
                           <Box sx={{ display: "flex", gap: 2 }}>
                             <Select size="small" value={selectedEngineer} onChange={(e) => setSelectedEngineer(e.target.value)} sx={{ width: 250, background: "#07090cff", color: "white" }}>
                               {engineers.map((eng) => <MenuItem value={eng._id} key={eng._id}>{eng.fullName}</MenuItem>)}
                             </Select>
                             <Button variant="contained" onClick={() => handleAssigned(r._id)}>Assign</Button>
                           </Box>
                         </Box>
                       </Collapse>
                     </TableCell>
                   </TableRow>
                 </React.Fragment>
               ))}
             </TableBody>
           </Table>
         </TableContainer>
       )
      }
      
      <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
        <Pagination count={totalPages} page={page} onChange={(_, v) => { setPage(v); loadReports({ p: v }); }} variant="outlined" shape="rounded" />
      </Box>
    </Box>
  );
}