const Incident = require('../models/Incident');
const IncidentType = require('../models/IncidentType');

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

// ============================================================
// API: TẠO BÁO CÁO SỰ CỐ (KÈM ẢNH)
// ============================================================
exports.createIncident = async (req, res) => {
  try {
    // 1. Lấy dữ liệu text từ form
    // Lưu ý: Khi dùng FormData, dữ liệu số vẫn là dạng chuỗi, cần parse lại nếu cần
    const { title, description, address, lat, lng, typeName } = req.body;

    // 2. Lấy thông tin file ảnh (do Multer xử lý xong)
    // req.files là một mảng các file
    const files = req.files; 

    // Kiểm tra dữ liệu bắt buộc
    if (!title || !typeName) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin tiêu đề hoặc loại sự cố' });
    }

    // 3. Tìm ID của Loại sự cố (từ tên gửi lên)
    const typeDoc = await IncidentType.findOne({ name: typeName });
    if (!typeDoc) {
      return res.status(400).json({ success: false, message: 'Loại sự cố không hợp lệ' });
    }

    // 4. Xử lý đường dẫn ảnh để lưu vào DB
    // Tạo URL đầy đủ: http://localhost:5000/uploads/ten-file.jpg
    let imageObjects = [];
    if (files && files.length > 0) {
      const protocol = req.protocol;
      const host = req.get('host');
      const serverUrl = `${protocol}://${host}`;

      imageObjects = files.map(file => ({
        image_url: `${serverUrl}/uploads/${file.filename}`,
        type: 'before', // Mặc định là ảnh hiện trường
        description: 'Ảnh người dân báo cáo'
      }));
    }

    // 5. Tạo Incident mới
    const newIncident = new Incident({
      title,
      description,
      address,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)] // GeoJSON [Long, Lat]
      },
      type_id: typeDoc._id,
      reporter_id: req.user.id, // Lấy ID người dùng từ Token (quan trọng!)
      images: imageObjects,     // Lưu mảng ảnh
      status: 'reported'
    });

    await newIncident.save();

    res.status(201).json({
      success: true,
      message: 'Gửi báo cáo thành công!',
      data: newIncident
    });

  } catch (err) {
    console.error('Lỗi tạo báo cáo:', err);
    res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
  }
};