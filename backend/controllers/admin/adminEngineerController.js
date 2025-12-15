const Role = require('../../models/Role'); 
const User = require('../../models/User'); 
const Incident = require('../../models/Incident'); 

exports.getEngineers = async (req, res) => {
  try {

    const engineerRole = await Role.findOne({ name: 'technician' }).select('_id');
    if (!engineerRole) {
      return res.status(404).json({ success: false, message: 'Engineer role not found' });
    }

    const engineers = await User.find({ role: engineerRole._id })
      .select('fullName email status isActive') // Select only the required fields
      .lean();

    const engineerData = await Promise.all(
      engineers.map(async (engineer) => {
        const activeTasks = await Incident.countDocuments({
          assigned_engineer_id: engineer._id,
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


exports.getAvailableEngineers = async (req, res) => {
  try {
    
    const engineerRole = await Role.findOne({ name: 'technician' }).select('_id');
    if (!engineerRole) {
      return res.status(404).json({ success: false, message: 'Engineer role not found' });
    }

    const engineers = await User.find({ role: engineerRole._id })
      .select('fullName email status isActive') // Select only the required fields
      .lean();

    const availableEngineers = await Promise.all(
      engineers.map(async (engineer) => {
        const activeTasks = await Incident.countDocuments({
          assigned_engineer_id: engineer._id,
          status: { $in: ['in_progress', 'assigned'] }, // Active tasks
        });

        // Include only engineers with no active tasks
        if (activeTasks === 0) {
          return engineer;
        }
        return null;
      })
    );

    // Remove null values from the array
    const filteredEngineers = availableEngineers.filter((engineer) => engineer !== null);

    res.status(200).json({ success: true, data: filteredEngineers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch available engineers', error: err.message });
  }
};

exports.addEngineer = async (req, res) => {
  try {
    const { fullName, email, password, phone, specialization, status } = req.body;

    // Validate required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ fullName, email, và password.'
      });
    }

    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email này đã được sử dụng.'
      });
    }

    // Find the "technician" role
    const roleDoc = await Role.findOne({ name: 'technician' });
    if (!roleDoc) {
      return res.status(400).json({
        success: false,
        message: `Role không hợp lệ. Phải là 'technician'.`
      });
    }

    // Create the engineer user
    const engineer = new User({
      fullName,
      email,
      password,
      role: roleDoc._id,
      phone,
      specialization,
      status,
    });

    await engineer.save();

    res.status(201).json({
      success: true,
      message: 'Kỹ sư đã được thêm thành công.',
      data: {
        id: engineer._id,
        fullName: engineer.fullName,
        email: engineer.email,
        role: 'technician',
        phone: engineer.phone,
        specialization: engineer.specialization,
        status: engineer.status,
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi thêm kỹ sư.',
      error: err.message
    });
  }
};

