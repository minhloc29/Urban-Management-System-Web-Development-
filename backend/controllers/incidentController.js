const Incident = require('../models/Incident');

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