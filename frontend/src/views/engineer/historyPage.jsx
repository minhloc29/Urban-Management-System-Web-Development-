import { useState, useEffect } from "react";
import {
  Box, Card, Typography, Chip, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, CircularProgress, 
  useMediaQuery, useTheme, Stack, Divider
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { apiGet } from "../../utils/api"; 

export default function TechnicianHistoryPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Responsive Check

  const [search, setSearch] = useState("");
  const [historyTasks, setHistoryTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await apiGet('/api/engineer/assigned');
        const data = response.data || response || [];
        // Chỉ lấy những việc đã KẾT THÚC
        const finishedTasks = data.filter(t => ['completed', 'rejected'].includes(t.status));
        finishedTasks.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        setHistoryTasks(finishedTasks);
      } catch (err) {
        console.error("Lỗi tải lịch sử:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getStatusChip = (status) => {
    switch (status) {
      case "completed": return <Chip label="Hoàn thành" color="success" size="small" variant={isMobile ? "outlined" : "filled"} />;
      case "rejected": return <Chip label="Đã từ chối" color="error" size="small" />;
      default: return <Chip label={status} size="small" />;
    }
  };

  const filteredData = historyTasks.filter(task => 
    (task.title?.toLowerCase() || "").includes(search.toLowerCase()) || 
    (task.address?.toLowerCase() || "").includes(search.toLowerCase())
  );

  // --- RENDER CARD MOBILE ---
  const MobileHistoryCard = ({ task }) => (
    <Card sx={{ mb: 2, p: 2, borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#666' }}>
          #{task._id ? task._id.substring(0,8) : 'N/A'}
        </Typography>
        <Box display="flex" alignItems="center" gap={0.5}>
           <AccessTimeIcon sx={{fontSize: 14, color: '#999'}}/>
           <Typography variant="caption" color="text.secondary">
             {new Date(task.updated_at || task.created_at).toLocaleDateString('vi-VN')}
           </Typography>
        </Box>
      </Box>

      <Typography variant="subtitle1" fontWeight="bold">
        {task.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {task.type_id?.name || task.incidentType || "Chưa phân loại"}
      </Typography>
      
      <Divider sx={{my: 1.5}} />

      <Box display="flex" justifyContent="space-between" alignItems="center">
         <Box display="flex" gap={1} alignItems="center" sx={{maxWidth: '60%'}}>
            <LocationOnIcon fontSize="small" color="disabled"/>
            <Typography variant="caption" noWrap>{task.address}</Typography>
         </Box>
         {getStatusChip(task.status)}
      </Box>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{mb: 4}}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e88e5', fontSize: {xs: '1.8rem', md: '3rem'} }}>
          Lịch sử công việc
        </Typography>
        <Typography variant="body1" sx={{ color: "#616161", mt: 1 }}>
          Danh sách các sự cố đã xử lý xong.
        </Typography>
      </Box>

      {loading ? (
           <Box display="flex" justifyContent="center" p={4}><CircularProgress/></Box>
      ) : filteredData.length === 0 ? (
           <Typography align="center" color="text.secondary" sx={{mt: 4}}>Chưa có lịch sử nào.</Typography>
      ) : (
           <>
             {isMobile ? (
               <Box>
                 {filteredData.map(task => <MobileHistoryCard key={task._id} task={task} />)}
               </Box>
             ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <Table stickyHeader sx={{ '& .MuiTableCell-stickyHeader': { backgroundColor: '#0f1720 !important', color: '#bdbdbd !important', fontWeight: 700 } }}>
                    <TableHead>
                        <TableRow>
                        <TableCell sx={{fontWeight: 'bold'}}>Mã sự cố</TableCell>
                        <TableCell sx={{fontWeight: 'bold'}}>Sự cố</TableCell>
                        <TableCell sx={{fontWeight: 'bold'}}>Địa điểm</TableCell>
                        <TableCell sx={{fontWeight: 'bold'}}>Trạng thái</TableCell>
                        <TableCell sx={{fontWeight: 'bold'}}>Thời gian</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map((task) => (
                            <TableRow key={task._id} hover>
                                <TableCell sx={{fontFamily: 'monospace', color: '#1976d2'}}>{task._id ? task._id.substring(0,8) : 'N/A'}...</TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="bold">{task.title}</Typography>
                                    <Typography variant="caption" color="text.secondary">{task.type_id?.name || task.incidentType || "Chưa phân loại"}</Typography>
                                </TableCell>
                                <TableCell>{task.address}</TableCell>
                                <TableCell>{getStatusChip(task.status)}</TableCell>
                                <TableCell>
                                    {new Date(task.updated_at || task.created_at).toLocaleDateString('vi-VN')}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </TableContainer>
             )}
           </>
      )}
    </Box>
  );
}