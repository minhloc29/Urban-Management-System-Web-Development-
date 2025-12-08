import { useState, useEffect } from "react";
import {
  Box, Card, Typography, Chip, InputBase, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, CircularProgress
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { apiGet } from "../../utils/api"; 

export default function TechnicianHistoryPage() {
  const [search, setSearch] = useState("");
  const [historyTasks, setHistoryTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await apiGet('/api/user/incidents/assigned');
        const data = response.data || response || [];

        // --- FIX LOGIC: LỌC CHUẨN LỊCH SỬ ---
        // Chỉ lấy những việc đã KẾT THÚC (Hoàn thành hoặc Bị từ chối)
        // Những việc đang làm (in_progress) sẽ ở bên trang My Tasks
        const finishedTasks = data.filter(t => 
            ['completed', 'rejected'].includes(t.status)
        );

        // Sắp xếp: Mới nhất lên đầu
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
      case "completed": return <Chip label="Hoàn thành" color="success" size="small" sx={{fontWeight: 'bold'}} />;
      case "rejected": return <Chip label="Đã từ chối" color="error" size="small" sx={{fontWeight: 'bold'}} />;
      default: return <Chip label={status} size="small" />;
    }
  };

  const filteredData = historyTasks.filter(task => 
    (task.title?.toLowerCase() || "").includes(search.toLowerCase()) || 
    (task.address?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{mb: 4}}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e88e5' }}>
          Lịch sử công việc
        </Typography>
        <Typography variant="body1" sx={{ color: "#616161", mt: 1 }}>
          Danh sách các sự cố đã xử lý xong hoặc bị hủy bỏ.
        </Typography>
      </Box>

      <Card sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", bgcolor: "#F5F5F5", borderRadius: 2, px: 2, py: 1, flexGrow: 1 }}>
                <SearchIcon sx={{ mr: 1, color: "#757575" }} />
                <InputBase
                    placeholder="Tìm theo tên sự cố, địa chỉ..."
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </Box>
        </Box>
      </Card>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#F0F4F8' }}>
            <TableRow>
              <TableCell sx={{fontWeight: 'bold'}}>Mã sự cố</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Sự cố</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Địa điểm</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Trạng thái kết thúc</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Thời gian</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
                <TableRow><TableCell colSpan={5} align="center"><CircularProgress/></TableCell></TableRow>
            ) : filteredData.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center">Chưa có lịch sử nào.</TableCell></TableRow>
            ) : (
                filteredData.map((task) => (
                <TableRow key={task._id} hover>
                    <TableCell sx={{fontFamily: 'monospace', color: '#1976d2'}}>
                        {task._id ? task._id.substring(0,8) : 'N/A'}...
                    </TableCell>
                    <TableCell>
                        <Typography variant="body2" fontWeight="bold">{task.title}</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {task.type_id?.name || task.incidentType || "Chưa phân loại"}
                        </Typography>
                    </TableCell>
                    <TableCell>{task.address}</TableCell>
                    <TableCell>{getStatusChip(task.status)}</TableCell>
                    <TableCell>
                        {new Date(task.updated_at || task.created_at).toLocaleDateString('vi-VN')}
                        <Typography variant="caption" display="block" color="text.secondary">
                             {new Date(task.updated_at || task.created_at).toLocaleTimeString('vi-VN')}
                        </Typography>
                    </TableCell>
                </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}