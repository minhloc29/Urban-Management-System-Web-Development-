import { useState, useEffect } from "react";
// --- 1. THÊM IMPORT NÀY ---
import { useNavigate } from "react-router-dom"; 
// --------------------------
import {
  Box,
  Card,
  Typography,
  Chip,
  Button,
  InputBase,
  Pagination,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { apiGet } from "../../utils/api";

export default function TechnicianMyTasksPage() {
  // --- 2. KHỞI TẠO NAVIGATE ---
  const navigate = useNavigate();
  // ---------------------------

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Gọi API lấy danh sách
      // Lưu ý: Nếu Backend chạy local không qua Docker thì dùng http://localhost:5000/api/incidents/assigned
      const response = await apiGet("/api/engineer/assigned");
      
      const data = response.data || response || []; 
      
      const formattedTasks = data.map(item => ({
        taskId: item._id || item.id || "N/A",
        title: item.title || item.description || "Sự cố",
        incidentType: item.incidentType?.name || item.incidentType || "Chưa phân loại",
        address: item.address || item.location || "Chưa cập nhật",
        priority: item.priority || "medium",
        deadline: item.deadline ? new Date(item.deadline).toLocaleDateString('vi-VN') : "Không có",
        status: item.status || "assigned"
      }));

      setMyTasks(formattedTasks);

    } catch (err) {
      console.error("❌ Lỗi gọi API:", err);
      setError("Không thể tải danh sách công việc.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const getStatusChip = (status) => {
    switch (status) {
      case "assigned":
        return <Chip label="Mới phân công" color="info" variant="outlined" size="small" sx={{fontWeight: 'bold'}} />;
      case "in_progress":
        return <Chip label="Đang xử lý" color="warning" size="small" sx={{color: '#fff', fontWeight: 'bold'}} />;
      case "completed":
        return <Chip label="Hoàn thành" color="success" size="small" sx={{fontWeight: 'bold'}} />;
      case "rejected":
        return <Chip label="Đã từ chối" color="error" size="small" />;
      default:
        return <Chip label="Không xác định" size="small" />;
    }
  };

  const getPriorityInfo = (priority) => {
      switch(priority) {
          case 'high': return <span style={{color: '#d32f2f', fontWeight: 'bold'}}>Cao 🔥</span>;
          case 'medium': return <span style={{color: '#ed6c02', fontWeight: 'bold'}}>Trung bình</span>;
          case 'low': return <span style={{color: '#2e7d32', fontWeight: 'bold'}}>Thấp</span>;
          default: return 'Bình thường';
      }
  }

  // --- 3. SỬA HÀM NÀY: NHẬN THÊM taskId VÀ GẮN SỰ KIỆN CLICK ---
  const getActionButton = (status, taskId) => {
    if (status === "assigned")
      return (
        <Button 
            variant="contained" color="primary" size="small" disableElevation
            // Khi bấm "Bắt đầu" -> Chuyển sang trang update luôn để đổi trạng thái
            onClick={() => navigate(`/engineer/update/${taskId}`)}
        >
          Bắt đầu
        </Button>
      );
    if (status === "in_progress")
      return (
        <Button 
            variant="contained" color="warning" size="small" disableElevation sx={{color: '#fff'}}
            // Khi bấm "Cập nhật" -> Chuyển sang trang update kèm ID
            onClick={() => navigate(`/engineer/update/${taskId}`)}
        >
          Cập nhật
        </Button>
      );
    if (status === "completed")
      return (
        <Button variant="outlined" color="success" size="small" disabled>
          Xong
        </Button>
      );
    return null;
  };
  // -------------------------------------------------------------

  const filteredTasks = myTasks.filter(task => {
      const matchStatus = filterStatus === 'all' || task.status === filterStatus;
      const matchSearch = search === '' || 
                          task.title.toLowerCase().includes(search.toLowerCase()) || 
                          task.taskId.toLowerCase().includes(search.toLowerCase()) ||
                          task.address.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{mb: 4}}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e88e5' }}>
          Danh sách công việc
        </Typography>
        <Typography variant="body1" sx={{ color: "#616161", mt: 1 }}>
          Quản lý và cập nhật tiến độ các sự cố được phân công cho bạn.
        </Typography>
      </Box>

      

      {error && <Alert severity="error" sx={{mb: 3}}>{error}</Alert>}

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden', minHeight: 300 }}>
        {loading ? (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, flexDirection: 'column', gap: 2}}>
                <CircularProgress />
                <Typography color="text.secondary">Đang tải danh sách công việc...</Typography>
            </Box>
        ) : filteredTasks.length === 0 ? (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200}}>
                <Typography color="text.secondary">Không tìm thấy công việc nào phù hợp.</Typography>
            </Box>
        ) : (
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
                <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#455a64' }}>Mã công việc</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#455a64' }}>Sự cố</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#455a64' }}>Địa điểm</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#455a64' }}>Mức độ</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#455a64' }}>Hạn chót</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#455a64' }}>Trạng thái</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#455a64' }}>Thao tác</TableCell>
                </TableRow>
            </TableHead>
            
            <TableBody>
                {filteredTasks.map((task) => (
                <TableRow
                    key={task.taskId}
                    hover
                    sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        transition: '0.2s',
                        '&:hover': { backgroundColor: '#F9FAFB' }
                    }}
                >
                    <TableCell component="th" scope="row" sx={{fontFamily: 'monospace', fontWeight: 600, color: '#1976d2'}}>
                    {task.taskId.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                        <Typography variant="body2" sx={{fontWeight: 600}}>{task.title}</Typography>
                        <Typography variant="caption" color="text.secondary">{task.incidentType}</Typography>
                    </TableCell>
                    <TableCell sx={{maxWidth: 200}}>
                        <Typography variant="body2" noWrap title={task.address}>
                            {task.address}
                        </Typography>
                    </TableCell>
                    <TableCell>{getPriorityInfo(task.priority)}</TableCell>
                    <TableCell>{task.deadline}</TableCell>
                    <TableCell>{getStatusChip(task.status)}</TableCell>
                    <TableCell align="center">
                        <Box sx={{display: 'flex', justifyContent: 'center', gap: 1}}>
                            
                            {/* --- 4. TRUYỀN taskId VÀO HÀM --- */}
                            {getActionButton(task.status, task.taskId)}
                            {/* -------------------------------- */}

                            <Tooltip title="Xem chi tiết">
                                <IconButton size="small">
                                    <InfoOutlinedIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        )}
      </TableContainer>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
        <Pagination count={Math.ceil(filteredTasks.length / 5)} color="primary" shape="rounded" />
      </Box>
    </Box>
  );
}