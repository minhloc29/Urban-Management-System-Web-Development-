const Incident = require('../models/Incident');
const IncidentType = require('../models/IncidentType');
const User = require('../models/User');

exports.getIncidentsForAssignment = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '', sort = 'newest' } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { location: { $regex: search, $options: 'i' } },
        { 'reporter_id.fullName': { $regex: search, $options: 'i' } },
      ];
    }
    if (status) {
      query.status = status;
    }

    const sortOption = sort === 'newest' ? { createdAt: -1 } : { createdAt: 1 };

    const incidents = await Incident.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('type_id', 'name icon_url')
      .populate('reporter_id', 'fullName')
      .populate('assigned_team_id', 'fullName');

    const total = await Incident.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: incidents,
      totalPages: Math.ceil(total / limit),
      page: parseInt(page),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching incidents.',
      error: err.message,
    });
  }
};