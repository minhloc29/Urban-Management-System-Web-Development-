const jwt = require('jsonwebtoken');


const authMiddleware = (req, res, next) => {

  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Không tìm thấy Token xác thực. Truy cập bị từ chối.'
    });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;

    if (req.user.id && !req.user._id) {
        req.user._id = req.user.id;
    }
    // console.log("✅ Auth Success | User ID:", req.user._id);
    next();

  } catch (err) {
    console.error('Auth Middleware Error:', err.message);
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn.'
    });
  }
};


module.exports = authMiddleware;