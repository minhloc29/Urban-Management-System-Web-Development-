import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Avatar,
  CircularProgress
} from "@mui/material";
import axios from "axios";

import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RecentReportsCard from "./card/RecentReportsCard";
import UserIntroCard from "./card/UserIntroCard";
import UserProfileCard from "./card/UserProfileCard";

export default function UserHomePage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- SỬA 1: Dùng object state để lưu cả Tên và Role ---
  const [userInfo, setUserInfo] = useState({
    fullName: "Citizen",
    role: "Smart-City Resident"
  });

  useEffect(() => {
    // --- SỬA 2: Lấy cả Tên và Role từ LocalStorage ---
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // Tạo role hiển thị đẹp hơn (viết hoa chữ cái đầu)
        let displayRole = "Resident";
        if (parsedUser.role) {
            // Ví dụ: "technician" -> "Technician"
            displayRole = parsedUser.role.charAt(0).toUpperCase() + parsedUser.role.slice(1);
        }

        setUserInfo({
            fullName: parsedUser.fullName || "Citizen",
            role: displayRole
        });

      } catch (err) {
        console.error("Lỗi parse user info:", err);
      }
    }

    // 2. LẤY DỮ LIỆU BÁO CÁO (Giữ nguyên)
    const fetchRecentReports = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/incidents/public");

        if (res.data.success) {
          const recentData = res.data.data.slice(0, 5); 

          const mappedReports = recentData.map((item) => ({
            id: `R-${item._id.slice(-6).toUpperCase()}`, 
            category: item.type_id?.name || "Sự cố",
            location: item.address,
            status: mapStatus(item.status)
          }));

          setReports(mappedReports);
        }
      } catch (error) {
        console.error("Lỗi tải Recent Reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentReports();
  }, []);

  const mapStatus = (status) => {
    const statusMap = {
      reported: "Mới gửi",
      assigned: "Đã phân công",
      in_progress: "Đang xử lý",
      completed: "Hoàn tất",
      rejected: "Từ chối"
    };
    return statusMap[status] || "Pending";
  };

  return (
    <Box
      sx={{
        p: 4,
        minHeight: "100vh",
        background: "radial-gradient(circle at 20% 20%, #1a1f40 0%, #0c0f26 70%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Decor */}
      <Box sx={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "rgba(56,189,248,0.15)", filter: "blur(120px)", top: 60, left: -80 }} />
      <Box sx={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "rgba(129,140,248,0.18)", filter: "blur(140px)", bottom: 80, right: -40 }} />

      {/* HERO SECTION */}
      <Grid container sx={{ justifyContent: "space-around" }}>
        
        {/* TRUYỀN TÊN VÀO INTRO */}
        <Grid item xs={6}>
            <UserIntroCard username={userInfo.fullName}/>
        </Grid>
        
        {/* --- SỬA 3: TRUYỀN PROPS VÀO USER PROFILE CARD --- */}
        <Grid item xs="auto">
            <UserProfileCard 
                name={userInfo.fullName}   // Truyền tên thật
                role={userInfo.role}       // Truyền vai trò thật
                avatarSrc=""               // Để trống hoặc thêm ảnh nếu có
            />
        </Grid>

      </Grid>

      {/* SHORTCUT CARDS */}
      <Grid container spacing={3} sx={{ mt: 5, justifyContent: "space-around" }}>
        <FeatureCard
          icon={<ReportProblemIcon sx={{ fontSize: 42 }} />}
          title="Report an Issue"
          desc="Gửi báo cáo nhanh chóng kèm hình ảnh và vị trí."
          color="#fca5a5"
          href="/user/report-problem"
        />
        <FeatureCard
          icon={<ListAltIcon sx={{ fontSize: 42 }} />}
          title="Track My Reports"
          desc="Theo dõi tiến trình xử lý các sự cố của bạn."
          color="#93c5fd"
          href="/user/my-reports"
        />
        <FeatureCard
          icon={<AccessTimeIcon sx={{ fontSize: 42 }} />}
          title="View History"
          desc="Xem lại lịch sử các sự cố đã hoàn tất."
          color="#c4b5fd"
          href="/user/my-reports"
        />
      </Grid>

      {/* RECENT REPORTS */}
      <Box sx={{ mt: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress sx={{ color: 'white' }} />
          </Box>
        ) : (
          <RecentReportsCard reports={reports} />
        )}
      </Box>
    </Box>
  );
}

/* Feature Card Component */
function FeatureCard({ icon, title, desc, color, href }) {
  return (
    <Grid item xs={12} md={4}>
      <Card
        onClick={() => (window.location.href = href)}
        sx={{
          p: 4, height: "100%", borderRadius: "20px",
          background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.08)", transition: "0.25s", cursor: "pointer",
          "&:hover": { transform: "translateY(-6px)", boxShadow: `0 0 24px ${color}55` },
        }}
      >
        <Avatar sx={{ bgcolor: `${color}33`, width: 64, height: 64, color: color }}>
          {icon}
        </Avatar>
        <Typography variant="h6" sx={{ mt: 2, fontWeight: 700, color: 'white' }}>{title}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.7, mt: 1, color: 'white' }}>{desc}</Typography>
      </Card>
    </Grid>
  );
}