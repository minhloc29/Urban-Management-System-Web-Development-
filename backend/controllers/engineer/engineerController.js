const Incident = require('../../models/Incident');
const IncidentType = require('../../models/IncidentType');
const User = require('../../models/User');
const mongoose = require('mongoose'); 


exports.getAssignedIncidents = async (req, res) => {
    
  try {
    let currentEngineerId = req.user ? req.user._id : null;

    
    let query = {};
    
    if (currentEngineerId) {

        query = { assigned_engineer_id: new mongoose.Types.ObjectId(currentEngineerId) };
    } 
    else {
        console.log("⚠️ [3] Không có User ID -> Chạy chế độ TEST (Lấy tất cả incident đã giao)");
        query = { status: { $in: ['assigned', 'in_progress'] } };
    }


    const tasks = await Incident.find(query)
      .populate('type_id', 'name')
      .populate('reporter_id', 'fullName phone email')
      .select('title description status priority address location type_id reporter_id created_at images')
      .sort({ created_at: -1 });

    console.log("Tasks found:", tasks.length);
    tasks.forEach((t, i) => {
      console.log(`Task ${i + 1}: ${t.title}, Location:`, t.location?.coordinates);
    });

    if (tasks.length === 0 && currentEngineerId) {
        console.log("💡 [GỢI Ý] Có thể User ID này chưa được gán vào trường 'assigned_engineer_id' của incident nào.");
        console.log("   -> Hãy thử update thủ công 1 incident trong DB gán cho ID này.");
    }

    console.log("========================================\n");

    res.status(200).json({
      success: true,
      data: tasks,
      total: tasks.length
    });

  } catch (error) {
    console.error("❌ [ERROR] Lỗi Controller:", error);
    res.status(500).json({ 
        success: false, 
        message: 'Lỗi server debug',
        error: error.message 
    });
  }
};

exports.updateIncidentProgress = async (req, res) => {
  try {
    const { id } = req.params; 
    const { status_to, note } = req.body;
    const engineerId = req.user._id;
    console.log(`🛠️ Engineer ${engineerId} đang cập nhật sự cố ${id}`);

    const incident = await Incident.findById(id);
    if (!incident) {
        return res.status(404).json({ message: "Không tìm thấy sự cố này." });
    }

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