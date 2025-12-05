const jwt = require('jsonwebtoken');


const authMiddleware = (req, res, next) => {
  // 1. Lấy token từ header của request
  // Format chuẩn: "Authorization: Bearer <token>"
  const authHeader = req.header('Authorization');


  // --- THÊM LOG ĐỂ DEBUG ---
  console.log("👉 Auth Header nhận được:", authHeader); 
  // -------------------------
  // Kiểm tra xem header có tồn tại không


  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Không tìm thấy Token xác thực. Truy cập bị từ chối.'
    });
  }


  try {
    // 2. Lấy chuỗi token thực tế (bỏ chữ "Bearer " ở đầu)
    const token = authHeader.replace('Bearer ', '');


    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ.'
      });
    }


    // 3. Giải mã (Verify) token bằng khóa bí mật (JWT_SECRET)
    // Biến decoded sẽ chứa thông tin user (id, role...) mà Lộc đã gói vào khi Login
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    // 4. Gán thông tin user vào request (req.user)
    // Để các hàm xử lý phía sau (như createIncident) có thể dùng được
    req.user = decoded;


    // Cho phép đi tiếp sang hàm tiếp theo (Controller)
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