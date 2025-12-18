const Incident = require('../../models/Incident');
const IncidentType = require('../../models/IncidentType');
const User = require('../../models/User');

// Display all incidents on admin page
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
      if(status === 'reported'){
        query.status = { $in: ['reported'] };
      }
      else if(status === 'assigned'){
        query.status = { $in: ['assigned'] };
      }
       else if(status === 'completed'){
        query.status = { $in: ['completed'] };
      }
      else{
        query.status = status;
      }
      
    }

    
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const sortOption = sort === 'newest' ? { created_at: -1 } : { created_at: 1 };

    const incidents = await Incident.find(query)
      .sort(sortOption)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate('type_id', 'name icon_url')
      .populate('reporter_id', 'fullName')
      .populate('assigned_engineer_id', 'fullName');

    const total = await Incident.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: incidents,
      totalPages: Math.ceil(total / limitNum),
      page: pageNum,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching incidents.',
      error: err.message,
    });
  }
};

// Assign Engineer to an Incident
exports.assignEngineer = async (req, res) => {
  try {

    const { incidentId, engineerId } = req.body;

    console.log('req.user:', req.user);

    console.log(incidentId)
    console.log(engineerId)

    if (!incidentId || !engineerId) {
      return res.status(400).json({ success: false, message: 'Incident ID and Engineer ID are required' });
    }

    console.log("i am here")
    const incident = await Incident.findById(incidentId);

    console.log("Check incident: ", incident)
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    // Update the assigned engineer and status
    incident.assigned_engineer_id = engineerId;
    incident.status = 'assigned';

    incident.updates.push({
      updater_id: req.user.id, // Assuming the user making the request is logged in
      status_to: 'assigned',
      note: `Assigned to engineer with ID: ${engineerId}`,
      update_time: new Date(),
    });

    await incident.save();

    res.status(200).json({ success: true, message: 'Engineer assigned successfully', data: incident });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to assign engineer', error: err.message });
  }
};