const Role = require('../models/Role'); // Import the Role model

exports.getEngineers = async (req, res) => {
  try {
    // Fetch the ObjectId for the "engineer" role
    const engineerRole = await Role.findOne({ name: 'technician' }).select('_id');
    if (!engineerRole) {
      return res.status(404).json({ success: false, message: 'Engineer role not found' });
    }

    // Query users with the "engineer" role
    const engineers = await User.find({ role: engineerRole._id })
      .select('fullName email status isActive') // Select only the required fields
      .lean();

    const engineerData = await Promise.all(
      engineers.map(async (engineer) => {
        const activeTasks = await Incident.countDocuments({
          assigned_team_id: engineer._id,
          status: { $in: ['in_progress', 'assigned'] }, // Active tasks
        });

        return {
          ...engineer,
          activeTasks,
        };
      })
    );

    res.status(200).json({ success: true, data: engineerData });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch engineers', error: err.message });
  }
};