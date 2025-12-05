const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. Cấu hình nơi lưu trữ (Storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Đường dẫn lưu file: nằm trong thư mục 'uploads' ở root dự án
    const uploadPath = 'uploads/';

    // Kiểm tra xem thư mục có tồn tại không, nếu không thì tạo mới
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Đặt tên file mới: fieldname-thời_gian.đuôi_file
    // Ví dụ: images-1715000000000.jpg
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// 2. Bộ lọc file (Chỉ chấp nhận ảnh)
const fileFilter = (req, file, cb) => {
  // Chỉ chấp nhận các file có mime type bắt đầu bằng 'image/' (jpg, png, jpeg...)
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Sai định dạng! Chỉ chấp nhận file ảnh.'), false);
  }
};

// 3. Khởi tạo Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Giới hạn file 5MB
  }
});

module.exports = upload;