import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import hook điều hướng
import {
  Box, Card, Grid, Typography, TextField, MenuItem, Button, Chip, Divider, 
  CircularProgress, Alert, Avatar, Stack, IconButton
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close'; // ✅ Thêm icon dấu X để xóa ảnh
import DeleteIcon from '@mui/icons-material/Delete'; 

import { apiGet, apiPost } from "../../utils/api"; // Giả định bạn đã có hàm apiPost hỗ trợ upload

export default function TaskUpdatePage() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taskFound, setTaskFound] = useState(false); // <-- State mới để kiểm tra task

  // Form State
  const [status, setStatus] = useState("in_progress");
  const [notes, setNotes] = useState("");
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Nếu không có ID trong URL ngay từ đầu, chúng ta biết ngay là không tìm thấy.
    if (!id) {
        console.error("❌ Không tìm thấy ID trên URL!");
        setLoading(false);
        setTaskFound(false); // Đánh dấu không tìm thấy
        return;
    }

    const fetchTaskDetail = async () => {
      try {
        setLoading(true);
        // Gọi API lấy danh sách để tìm task hiện tại
        const response = await apiGet(`/api/engineer/assigned`); 
        const tasks = response.data || response || [];
        
        // Tìm task có ID trùng khớp
        const found = tasks.find(t => t._id === id || t.id === id);
        
        if (found) {
            setTask(found);
            setStatus(found.status === 'assigned' ? 'in_progress' : found.status);
            setTaskFound(true); 
        } else {
            console.error("❌ Không tìm thấy task nào khớp với ID:", id);
            setTaskFound(false); 
        }
      } catch (err) {
        console.error("Lỗi tải chi tiết:", err);
        setTaskFound(false); // <-- Đánh dấu không tìm thấy
      } finally {
        setLoading(false); 
      }
    };

    fetchTaskDetail();
  }, [id]);

  // --- Các hàm xử lý ảnh và submit giữ nguyên ---
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setImages(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
    setPreviewUrls(prev => {
        URL.revokeObjectURL(prev[indexToRemove]);
        return prev.filter((_, index) => index !== indexToRemove);
    });
  };

  const handleSubmit = async () => {
    if (!notes && status !== 'completed') {
        return alert("Vui lòng nhập ghi chú tiến độ!");
    }
    setSubmitting(true);
    try {
        const formData = new FormData();
        formData.append('status_to', status); 
        formData.append('note', notes);       
        images.forEach((file) => { formData.append('images', file); });

        // Tạm thời bỏ comment dòng gọi API thật khi backend đã sẵn sàng
        await apiPost(`/api/engineer/${id}/update`, formData);

        console.log("Submit giả lập thành công:", { status, notes, images });
        alert("Cập nhật thành công!");
        navigate(-1); 

    } catch (err) {
        console.error(err);
        alert("Có lỗi xảy ra khi cập nhật!");
    } finally {
        setSubmitting(false);
    }
  };

  // --- LOGIC RENDER MỚI ĐÃ SỬA LỖI ---
  if (loading) return <Box p={3}><CircularProgress /></Box>;
  
  // Chỉ hiển thị lỗi khi việc tải dữ liệu đã kết thúc (loading=false) 
  // VÀ xác nhận là không tìm thấy task (taskFound=false)
  if (!taskFound) {
      return (
        <Box p={3}>
            <Alert severity="error">
                Không tìm thấy công việc với ID: **{id || "Không có ID"}**. Vui lòng kiểm tra lại URL hoặc danh sách công việc được giao.
            </Alert>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{mt: 2}}>
                Quay lại
            </Button>
        </Box>
      );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Phần JSX giao diện chính của bạn giữ nguyên */}
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{mb: 2}}>
        Quay lại
      </Button>
      {/* ... code giao diện còn lại ... */}
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 3, color: '#1e88e5' }}>
        Cập nhật tiến độ
      </Typography>
      {/* ... các Grid và Card ... */}
       <Grid container spacing={3}>
        {/* Cột trái: Thông tin sự cố (Read only) */}
        <Grid item xs={12} md={5}>
            <Card sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                <Typography variant="h4" sx={{ mb: 2 }}>Chi tiết sự cố</Typography>
                
                <Stack spacing={2}>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">Tiêu đề</Typography>
                        <Typography variant="body1" fontWeight="bold">{task.title}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">Địa điểm</Typography>
                        <Typography variant="body1">{task.address || task.location}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">Loại sự cố</Typography>
                        <Chip label={task.incidentType?.name || "Chưa phân loại"} size="small" />
                    </Box>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">Mô tả ban đầu</Typography>
                        <Typography variant="body2" sx={{bgcolor: '#f5f5f5', p: 1, borderRadius: 1}}>
                            {task.description}
                        </Typography>
                    </Box>
                </Stack>
            </Card>
        </Grid>

        {/* Cột phải: Form cập nhật */}
        <Grid item xs={12} md={7}>
            <Card sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h4" sx={{ mb: 3, color: '#ed6c02' }}>Nhập thông tin xử lý</Typography>

                <Grid container spacing={3}>
                    {/* Chọn trạng thái mới */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Trạng thái mới</Typography>
                        <TextField
                            select
                            fullWidth
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <MenuItem value="in_progress">Đang xử lý (In Progress)</MenuItem>
                            <MenuItem value="completed">Đã hoàn thành (Completed)</MenuItem>
                            <MenuItem value="rejected">Không thể xử lý (Reject)</MenuItem>
                        </TextField>
                    </Grid>

                    {/* Ghi chú */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Ghi chú / Kết quả xử lý</Typography>
                        <TextField
                            fullWidth
                            multiline
                            minRows={4}
                            placeholder="Ví dụ: Đã lấp hố ga, đang chờ khô bê tông..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </Grid>

                    {/* Upload ảnh */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Ảnh minh chứng (Sau khi xử lý)</Typography>
                        
                        <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
                            Chọn ảnh
                            <input hidden accept="image/*" type="file" multiple onChange={handleImageUpload} />
                        </Button>

                        {/* Preview ảnh đã chọn */}
                        <Box sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
                            {previewUrls.map((url, index) => (
                                <Box key={index} sx={{ position: 'relative' }}>
                                    <Avatar 
                                        src={url}
                                        variant="square"
                                        sx={{ width: 100, height: 100, borderRadius: 1 }}
                                    />
                                    <IconButton
                                        size="small"
                                        onClick={() => handleRemoveImage(index)}
                                        sx={{
                                            position: 'absolute',
                                            top: -10,
                                            right: -10,
                                            backgroundColor: 'error.main',
                                            color: 'white',
                                            '&:hover': { backgroundColor: 'error.dark' }
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={submitting}
                            fullWidth
                            startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {submitting ? "Đang gửi..." : "Xác nhận cập nhật"}
                        </Button>
                    </Grid>
                </Grid>
            </Card>
        </Grid>
      </Grid>
    </Box>
  );
}