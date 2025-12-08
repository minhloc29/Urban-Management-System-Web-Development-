const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // 1. Lấy token từ header
  const authHeader = req.header('Authorization');

  // DEBUG: In ra để kiểm tra
  // console.log("👉 Auth Header:", authHeader); 

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Không tìm thấy Token xác thực. Truy cập bị từ chối.'
    });
  }

  try {
    // 2. Lấy chuỗi token thực tế
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ.'
      });
    }

    // 3. Giải mã Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Gán thông tin user vào request
    req.user = decoded;

    // --- SỬA QUAN TRỌNG: CHUẨN HÓA ID ---
    // Token của Lộc lưu là 'id', nhưng Mongoose và Controller thường dùng '_id'
    // Ta gán thêm _id = id để code ở đâu cũng chạy được
    if (req.user.id && !req.user._id) {
        req.user._id = req.user.id;
    }
    // -------------------------------------

    console.log("✅ Auth Success | User ID:", req.user._id);

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