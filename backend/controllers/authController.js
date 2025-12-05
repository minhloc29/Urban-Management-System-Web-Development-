const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ fullName, email, password, và role.'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email này đã được sử dụng.'
      });
    }

    const roleDoc = await Role.findOne({ name: role });
    if (!roleDoc) {
      return res.status(400).json({
        success: false,
        message: `Role không hợp lệ. Phải là 'citizen', 'authority', hoặc 'technician'.`
      });
    }

    const user = new User({
      fullName: fullName,
      email,
      password,
      role: roleDoc._id
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Người dùng đã được đăng ký thành công.'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi đăng ký người dùng.',
      error: err.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate({
      path: 'role',
      model: 'Role',
      populate: {
        path: 'permissions',
        model: 'Permission'
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with the provided email.'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role.name
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role.name,
        permissions: user.role.permissions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login.',
      error: error.message
    });
  }
};