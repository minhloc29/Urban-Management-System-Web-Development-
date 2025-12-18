import React, { useState, useEffect } from "react";
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
  useTheme,
  Menu,
  MenuItem,
  IconButton,
  ListItemText,
  Select

} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { apiGet, apiPost, apiPatch } from "../../utils/api";
import AddEngineer from "./addEngineer";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Collapse } from "@mui/material";

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
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [openEngineerRow, setOpenEngineerRow] = useState(null);

  const limit = 10; 

  const handleOpenTasks = (event, engineer) => {
    setAnchorEl(event.currentTarget);
    setSelectedEngineer(engineer);
  };

  const handleCloseTasks = () => {
    setAnchorEl(null);
    setSelectedEngineer(null);
  };

  const handleUnassign = async (incidentId) => {
  const ok = window.confirm(
    "Remove this task from the engineer?"
  );
  if (!ok) return;

  try {
    const res = await apiPatch(
      "/api/admin/engineer/unassign",
      { incidentId }
    );

    if (res.success) {
      fetchEngineers(); // refresh engineers + tasks
    } else {
      alert(res.message || "Failed to unassign task");
    }
  } catch (err) {
    console.error(err);
    alert("Failed to unassign task");
  }
};


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
                  <TableCell sx={{ color: '#bdbdbd', fontWeight: 700 }}></TableCell>
                  <TableCell sx={{ color: '#bdbdbd', fontWeight: 700 }}>Name</TableCell>
                  <TableCell sx={{ color: '#bdbdbd', fontWeight: 700 }}>Email</TableCell>
                  <TableCell sx={{ color: '#bdbdbd', fontWeight: 700 }}>Active Tasks</TableCell>
                </TableRow>
              </TableHead>

              {/* Rows */}
             {engineers.map((eng) => (
  <React.Fragment key={eng._id}>

    {/* MAIN ROW */}
    <TableRow
      hover
      sx={{ cursor: "pointer" }}
      onClick={() =>
        setOpenEngineerRow(
          openEngineerRow === eng._id ? null : eng._id
        )
      }
    >
      <TableCell sx={{ width: 40 }}>
        {openEngineerRow === eng._id ? (
          <ExpandLessIcon />
        ) : (
          <ExpandMoreIcon />
        )}
      </TableCell>

      <TableCell>{eng.fullName}</TableCell>
      <TableCell>{eng.email}</TableCell>
      <TableCell>{eng.incidents?.length || 0}</TableCell>
    </TableRow>

    {/* EXPANDED ROW */}
    <TableRow>
      <TableCell
        colSpan={4}
        sx={{
          py: 0,
          border: 0,
          backgroundColor: "rgba(255,255,255,0.02)"
        }}
      >
        <Collapse
          in={openEngineerRow === eng._id}
          timeout="auto"
          unmountOnExit
        >
          <Box sx={{ p: 2 }}>

            <Typography sx={{ fontWeight: 600, mb: 1 }}>
              Active Tasks
            </Typography>

            {(eng.incidents || []).length === 0 ? (
              <Typography color="#aaa">
                No active tasks
              </Typography>
            ) : (
              (eng.incidents || []).map((inc) => (
                <Box
                  key={inc._id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1,
                    mb: 1,
                    borderRadius: 1,
                    backgroundColor: "#0f1720"
                  }}
                >
                  <Box>
                    <Typography fontSize={14}>
                      {inc.title || "Untitled"}
                    </Typography>
                    <Typography fontSize={12} color="#aaa">
                      {inc.type}
                    </Typography>
                  </Box>

                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleUnassign(inc._id)}
                  >
                    Remove
                  </Button>
                </Box>
              ))
            )}

          </Box>
        </Collapse>
      </TableCell>
    </TableRow>

  </React.Fragment>
))}

            </Table>
          </TableContainer>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseTasks}
            PaperProps={{
              sx: {
                bgcolor: "#1e2129",
                color: "#e0e0e0",
                minWidth: 260,
                border: "1px solid #333"
              }
            }}
          >
            {selectedEngineer?.incidents?.map((inc) => (
              <MenuItem key={inc._id} sx={{ display: "flex", justifyContent: "space-between" }}>
                <ListItemText
                  primary={inc.title}
                  secondary={inc.type}
                />

                <Button
                  size="small"
                  color="error"
                  onClick={() => handleUnassign(inc._id)}
                >
                  Remove
                </Button>
              </MenuItem>
            ))}

            {selectedEngineer?.incidents?.length === 0 && (
              <MenuItem disabled>No active tasks</MenuItem>
            )}
          </Menu>

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