const Incident = require('../models/Incident');

// ============================================================
// API PUBLIC: Lấy danh sách sự cố cho Frontend (Không cần Token)
// Endpoint dự kiến: GET /api/inc=========================================
exports.getPublicIncidents = async (req, res) => {
  try {
// ===================
    // 1. Truy vấn database
    // - Lấy tất cả bản ghi trong collection 'incidents'
    // - Sắp xếp: Mới nhất lên đầu (createdAt: -1)
    const incidents = await Incident.find()
      .sort({ createdAt: -1 })
      // - Populate 'type_id': Lấy thêreporter_id'm trường 'name' và 'icon_url' từ bảng IncidentType
      .populate('type_id', 'name icon_url')
      // - Populate ': Lấy thêm tên người báo cáo (nếu cần hiển thị)
      .populate('reporter_id', 'fullName');
    

    console.log("👉 Số lượng bản ghi tìm thấy:", incidents.length);
    // 2. Trả về kết quả thành công
    return res.status(200).json({
      success: true,
      count: incidents.length,
      data: incidents
    });

  } catch (err) {
    console.error("Lỗi lấy dữ liệu Public:", err);
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi lấy dữ liệu.',
      error: err.message
    });
  }
};