FROM node:22-alpine

WORKDIR /app

# Copy cả package.json và lock file (nếu có)
COPY package*.json ./

# Cài thư viện
RUN npm install --legacy-peer-deps

COPY . .

# Tạo thư mục uploads để lưu ảnh
RUN mkdir -p uploads

# Mở cổng 5000
EXPOSE 5000

# --- SỬA Ở ĐÂY ---
# Chạy trực tiếp file app.cjs như bạn yêu cầu
CMD ["node", "app.cjs"]