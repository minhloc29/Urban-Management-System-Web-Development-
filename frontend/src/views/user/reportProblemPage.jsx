import React, { useState } from "react";
import {
  Box,
  Card,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  Chip,
  Alert,
  CircularProgress
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DeleteIcon from "@mui/icons-material/Delete"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { apiGet, apiPost } from "../../utils/api";
export default function ReportProblem() {
  const navigate = useNavigate();

  const [images, setImages] = useState([]);       
  const [previewUrls, setPreviewUrls] = useState([]); 

  const [title, setTitle] = useState("");        
  const [category, setCategory] = useState("");   
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");     

  const [coords, setCoords] = useState({ lat: 21.0285, lng: 105.8542 });

  const [loading, setLoading] = useState(false);  
  const [message, setMessage] = useState(null);   

  const categories = [
    { label: "Ổ gà", value: "Ổ gà", icon: "🚧" },
    { label: "Rác thải", value: "Rác thải", icon: "🗑️" },
    { label: "Đèn hỏng", value: "Đèn đường hỏng", icon: "💡" },
    { label: "Ngập úng", value: "Rò rỉ nước", icon: "💧" }, 
  ];

  const handleImageUpload = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      if (images.length + filesArray.length > 5) {
        alert("Maximum 5 images!");
        return;
      }

      setImages((prev) => [...prev, ...filesArray]);

      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const detectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setAddress(`Toạ độ: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
      }, (err) => {
        alert("Không thể lấy vị trí: " + err.message);
      });
    } else {
      alert("Trình duyệt không hỗ trợ Geolocation");
    }
  };

  const handleSubmit = async () => {
    if (!title || !category || !address) {
      setMessage({ type: "error", text: "Vui lòng nhập Tiêu đề, Loại sự cố và Địa chỉ!" });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("typeName", category); // Gửi tên loại để Backend tìm ID
      formData.append("address", address);
      formData.append("lat", coords.lat);
      formData.append("lng", coords.lng);

      images.forEach((image) => {
        formData.append("images", image);
      });

      const res = await apiPost("/api/user/incidents", formData);

      if (res.success) {
        alert("Gửi báo cáo thành công!");
      }

    } catch (err) {
      console.error(err);
      setMessage({ 
        type: "error", 
        text: "Lỗi: " + (err.response?.data?.message || "Không kết nối được Server") 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: "900px", margin: "0 auto" }}>
      {/* Header */}
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
        Gửi Báo Cáo Sự Cố
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "gray", mb: 3 }}>
        Chụp ảnh và gửi thông tin để chúng tôi xử lý kịp thời.
      </Typography>

      {message && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

      <Card sx={{ p: 4, borderRadius: 4, boxShadow: "0 6px 25px rgba(0,0,0,0.05)" }}>

        {/* --- KHU VỰC UPLOAD ẢNH --- */}
        <Typography sx={{ fontWeight: 600, mb: 1 }}>Hình ảnh hiện trường</Typography>
        <Box
          sx={{
            border: "2px dashed",
            borderRadius: 3,
            p: 3,
            textAlign: "center",
            mb: 3,
            bgcolor: "#fafafa"
          }}
        >
          <CloudUploadIcon fontSize="large" sx={{ color: "#777", mb: 1 }} />
          <Typography variant="body2" color="textSecondary">
            Kéo thả hoặc chọn ảnh (Tối đa 5 ảnh)
          </Typography>
          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Chọn Ảnh
            <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
          </Button>
        </Box>

        {/* --- PREVIEW ẢNH --- */}
        {previewUrls.length > 0 && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {previewUrls.map((src, idx) => (
              <Grid item key={idx} sx={{ position: "relative" }}>
                <img
                  src={src}
                  alt="preview"
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 10,
                    objectFit: "cover",
                    border: "1px solid #ddd"
                  }}
                />
                <IconButton 
                  size="small" 
                  sx={{ 
                    position: "absolute", top: 5, right: -5, 
                    bgcolor: "white", boxShadow: 1, 
                    "&:hover": { bgcolor: "#ffebee" } 
                  }}
                  onClick={() => removeImage(idx)}
                >
                  <DeleteIcon fontSize="small" color="error" />
                </IconButton>
              </Grid>
            ))}
          </Grid>
        )}


        <Typography sx={{ fontWeight: 600, mb: 1 }}>Tiêu đề sự cố <span style={{color:'red'}}>*</span></Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Ví dụ: Ổ gà lớn đường Nguyễn Trãi"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Typography sx={{ fontWeight: 600, mb: 1 }}>Loại sự cố <span style={{color:'red'}}>*</span></Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
          {categories.map((c) => (
            <Chip
              key={c.value}
              label={`${c.icon} ${c.label}`}
              clickable
              onClick={() => setCategory(c.value)}
              color={category === c.value ? "primary" : "default"}
              variant={category === c.value ? "filled" : "outlined"}
            />
          ))}
        </Box>

        <Typography sx={{ fontWeight: 600, mb: 1 }}>Mô tả chi tiết</Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Mô tả thêm về tình trạng, mức độ nguy hiểm..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 3 }}
        />

        {/* 4. Vị trí */}
        <Typography sx={{ fontWeight: 600, mb: 1 }}>Vị trí <span style={{color:'red'}}>*</span></Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Nhập địa chỉ hoặc bấm nút Detect"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Button
            variant="contained"
            color="success"
            startIcon={<LocationOnIcon />}
            onClick={detectLocation}
            sx={{ ml: 1, whiteSpace: "nowrap" }}
          >
            Định vị
          </Button>
        </Box>

        {/* --- BUTTON GỬI --- */}
        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
          disabled={loading} // Khóa nút khi đang gửi
          sx={{ py: 1.5, borderRadius: 2, fontWeight: 700, fontSize: "1rem" }}
        >
          {loading ? <CircularProgress size={24} color="inherit"/> : "Gửi Báo Cáo"}
        </Button>
      </Card>
    </Box>
  );
}