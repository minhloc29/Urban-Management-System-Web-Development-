const Incident = require('../models/Incident');
const IncidentType = require('../models/IncidentType');
const User = require('../models/User');
const mongoose = require('mongoose'); 

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

exports.getAssignedIncidents = async (req, res) => {
  console.log("\n========================================");
  console.log("🔥 [DEBUG START] API /assigned đã được gọi");
  
  try {
    // 1. Kiểm tra User ID từ Token (nếu có)
    let currentEngineerId = req.user ? req.user._id : null;
    console.log("👤 [1] User ID từ Token:", currentEngineerId);

    // 2. Kiểm tra dữ liệu thô trong Database (Lấy 1 bản ghi bất kỳ để soi field)
    const sample = await Incident.findOne();
    if (sample) {
        console.log("📝 [2] Cấu trúc mẫu 1 Incident trong DB:");
        console.log(`   - _id: ${sample._id}`);
        console.log(`   - title: ${sample.title}`);
        console.log(`   - status: ${sample.status}`);
        console.log(`   - assigned_engineer_id: ${sample.assigned_engineer_id} (Kiểu: ${typeof sample.assigned_engineer_id})`);
        // Kiểm tra xem có field cũ 'engineer' hay 'engineer_id' không
        if (sample.engineer) console.log(`   ⚠️ Cảnh báo: Có field cũ 'engineer': ${sample.engineer}`);
    } else {
        console.log("⚠️ [2] Database đang RỖNG! Không có incident nào.");
        return res.status(200).json([]); // Trả về rỗng luôn
    }

    // 3. Xây dựng Query
    let query = {};
    
    // NẾU CÓ USER ĐĂNG NHẬP: Lọc theo ID
    if (currentEngineerId) {
        // Chuyển string ID sang ObjectId để chắc chắn khớp
        query = { assigned_engineer_id: new mongoose.Types.ObjectId(currentEngineerId) };
    } 
    // NẾU KHÔNG CÓ USER (Test mode): Lọc theo trạng thái
    else {
        console.log("⚠️ [3] Không có User ID -> Chạy chế độ TEST (Lấy tất cả incident đã giao)");
        query = { status: { $in: ['assigned', 'in_progress'] } };
    }

    console.log("🔍 [3] Query Filter:", JSON.stringify(query));

    // 4. Thực thi tìm kiếm
    const tasks = await Incident.find(query)
      .populate('type_id', 'name')
      .populate('reporter_id', 'name phone')
      .sort({ created_at: -1 });

    console.log(`✅ [4] Kết quả tìm thấy: ${tasks.length} task`);
    
    // Nếu tìm không thấy gì, in ra gợi ý
    if (tasks.length === 0 && currentEngineerId) {
        console.log("💡 [GỢI Ý] Có thể User ID này chưa được gán vào trường 'assigned_engineer_id' của incident nào.");
        console.log("   -> Hãy thử update thủ công 1 incident trong DB gán cho ID này.");
    }

    console.log("========================================\n");

    res.status(200).json(tasks);

  } catch (error) {
    console.error("❌ [ERROR] Lỗi Controller:", error);
    res.status(500).json({ 
        success: false, 
        message: 'Lỗi server debug',
        error: error.message 
    });
  }
};

// --- 4. HÀM CẬP NHẬT TIẾN ĐỘ (Cho Engineer) ---
exports.updateIncidentProgress = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID sự cố từ URL
    const { status_to, note } = req.body; // Lấy trạng thái mới và ghi chú từ Form
    const engineerId = req.user._id; // Lấy ID của Engineer đang đăng nhập

    console.log(`🛠️ Engineer ${engineerId} đang cập nhật sự cố ${id}`);

    // 1. Tìm sự cố hiện tại để lấy trạng thái cũ (status_from)
    const incident = await Incident.findById(id);
    if (!incident) {
        return res.status(404).json({ message: "Không tìm thấy sự cố này." });
    }

    // 2. Xử lý ảnh mới (nếu có upload)
    let newImages = [];
    if (req.files && req.files.length > 0) {
        newImages = req.files.map(file => ({
            image_url: `/uploads/${file.filename}`,
            uploader_id: engineerId,
            type: 'after', // Đánh dấu là ảnh "sau khi xử lý"
            description: 'Ảnh cập nhật tiến độ'
        }));
    }

    // 3. Chuẩn bị dữ liệu cập nhật
    const updateData = {
        // Cập nhật trạng thái chính của sự cố
        status: status_to,
        
        // Đẩy thêm ảnh mới vào mảng images
        $push: {
            images: { $each: newImages },
            
            // QUAN TRỌNG: Đẩy lịch sử vào mảng updates
            updates: {
                updater_id: engineerId,
                update_time: new Date(),
                status_from: incident.status, // Trạng thái cũ
                status_to: status_to,         // Trạng thái mới
                note: note || ''
            }
        }
    };

    // 4. Thực hiện Update vào DB
    const updatedIncident = await Incident.findByIdAndUpdate(
        id,
        updateData,
        { new: true } // Trả về dữ liệu mới nhất
    );

    console.log("✅ Cập nhật thành công!");

    res.status(200).json({
        success: true,
        message: "Cập nhật tiến độ thành công!",
        data: updatedIncident
    });

  } catch (error) {
    console.error("❌ Lỗi updateIncidentProgress:", error);
    res.status(500).json({ message: error.message });
  }
};