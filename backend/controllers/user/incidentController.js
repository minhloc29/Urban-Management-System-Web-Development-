const Incident = require('../../models/Incident');
const IncidentType = require('../../models/IncidentType');
const { emitNewIncident } = require('../../utils/eventEmitter');


exports.createIncident = async (req, res) => {
  try {
   
    const { title, description, address, lat, lng, typeName } = req.body;

    const files = req.files; 

    if (!title || !typeName) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin tiêu đề hoặc loại sự cố' });
    }

    const typeDoc = await IncidentType.findOne({ name: typeName });
    if (!typeDoc) {
      return res.status(400).json({ success: false, message: 'Loại sự cố không hợp lệ' });
    }

    let imageObjects = [];
    if (files && files.length > 0) {
      const protocol = req.protocol;
      const host = req.get('host');
      const serverUrl = `${protocol}://${host}`;

      imageObjects = files.map(file => ({
        image_url: `${serverUrl}/uploads/${file.filename}`,
        type: 'before', 
        description: 'Ảnh người dân báo cáo'
      }));
    }

    const newIncident = new Incident({
      title,
      description,
      address,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)] 
      },
      type_id: typeDoc._id,
      reporter_id: req.user.id, 
      images: imageObjects,    
      status: 'reported'
    });

    await newIncident.save();

   

    console.log("HIHI")
    // ✅ Emit event to notify admins (with error handling)
    try {
      emitNewIncident(newIncident);
    } catch (socketError) {
      console.error('Socket emit error:', socketError.message);
      // Don't fail the request if socket fails
    }

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

exports.getPublicIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find()
      .sort({ createdAt: -1 })
      .populate('type_id', 'name icon_url')
      .populate('reporter_id', 'fullName');

    return res.status(200).json({
      success: true,
      count: incidents.length,
      data: incidents,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi lấy dữ liệu.',
      error: err.message,
    });
  }
};

exports.getMyIncidents = async (req, res) => {
  try {
    // 1. Lấy ID của User từ Token (do Auth Middleware giải mã)
    const userId = req.user._id; 

    console.log(`👤 User ${userId} đang xem lịch sử báo cáo.`);

    // 2. Tìm trong DB những sự cố do User này tạo (reporter_id trùng khớp)
    const incidents = await Incident.find({ reporter_id: userId })
      .populate('type_id', 'name') // Lấy tên loại sự cố
      .sort({ created_at: -1 });   // Sắp xếp mới nhất lên đầu

    res.status(200).json({
      success: true,
      count: incidents.length,
      data: incidents
    });

  } catch (error) {
    console.error("❌ Lỗi getMyIncidents:", error);
    res.status(500).json({ message: error.message });
  }
};
