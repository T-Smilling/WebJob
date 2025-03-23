FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

# Sao chép toàn bộ mã nguồn và build
COPY . .
RUN npm run build

# Stage 2: Sử dụng Nginx để phục vụ file tĩnh
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

# Khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]