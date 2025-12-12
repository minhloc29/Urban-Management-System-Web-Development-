FROM node:22-alpine

WORKDIR /app

# --- THÊM DÒNG NÀY ĐỂ KÍCH HOẠT YARN MỚI ---
RUN corepack enable
# -------------------------------------------

# Copy package.json
COPY package.json ./
# Nếu có file yarn.lock thì copy vào luôn
COPY yarn.lock ./

# Cài thư viện
RUN yarn install

COPY . .

EXPOSE 3000

# Lệnh chạy mặc định
CMD ["yarn", "start", "--", "--host"]