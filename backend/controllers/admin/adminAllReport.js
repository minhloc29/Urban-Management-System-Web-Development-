const Incident = require('../../models/Incident');

exports.getAllReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sort = 'newest', status } = req.query;

    // Build the query
    const query = {};

    // Search filter
    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { address: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Sort options
    let sortOption = { created_at: -1 }; // Default: newest
    switch (sort) {
      case 'oldest':
        sortOption = { created_at: 1 };
        break;
      case 'newest':
        sortOption = { created_at: -1 };
        break;
      case 'pending':
        query.status = { $in: ['reported', 'assigned', 'in_progress'] };
        break;
      case 'completed':
        query.status = { $in: ['completed'] };
        break;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reports = await Incident.find(query)
      .populate('reporter_id', 'fullName email')
      .populate('type_id', 'name')
      .populate('assigned_engineer_id', 'fullName email')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Incident.countDocuments(query);

    res.status(200).json({
      success: true,
      data: reports,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total,
    });
  } catch (err) {
    console.error('Get all reports error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
      error: err.message,
    });
  }
};

exports.deleteReport = async (req, res) => {
  try {

    console.log(req)
    
    const { id } = req.params;
    const report = await Incident.findById(id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

    await Incident.findByIdAndDelete(id);

    return res.json({ success: true, message: 'Report deleted' });
  } catch (err) {
    console.error('Delete report error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};