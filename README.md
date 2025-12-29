# Fstudio Store - E-commerce Platform

Hệ thống thương mại điện tử bán sản phẩm công nghệ với giao diện quản trị và cửa hàng trực tuyến.

## 🛠️ Công nghệ sử dụng

### Frontend (Client)
- **Next.js** - React Framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Component library

### Backend (Server)
- **Laravel** - PHP Framework
- **MySQL** - Database
- **JWT Authentication** - API Authentication
- **RESTful API** - API Architecture

## 📋 Yêu cầu hệ thống

- Node.js >= 16.x
- PHP >= 8.0
- Composer
- MySQL >= 5.7
- Git

## 🚀 Cài đặt và chạy project

### 1. Clone repository

```bash
git clone https://github.com/Nghiem060220041/Fstudio.git
cd fstudio-store
```

### 2. Cài đặt Backend (Server)

```bash
cd server

# Cài đặt dependencies
composer install

# Copy file .env
cp .env.example .env

# Tạo key
php artisan key:generate

# Cấu hình database trong file .env
# DB_DATABASE=fstudio
# DB_USERNAME=root
# DB_PASSWORD=

# Chạy migration và seeder
php artisan migrate --seed

# Tạo storage link
php artisan storage:link

# Chạy server (port 8000)
php artisan serve
```

### 3. Cài đặt Frontend (Client)

```bash
cd ../client

# Cài đặt dependencies
npm install

# Copy file .env
cp .env.local.example .env.local

# Cấu hình API endpoint trong .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Chạy development server (port 3000)
npm run dev
```

### 4. Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Admin Panel**: http://localhost:3000/admin

## ✨ Chức năng chính

### Khách hàng (Customer)
- 🔍 Tìm kiếm và lọc sản phẩm
- 🛒 Giỏ hàng và thanh toán
- 💳 Thanh toán VNPay
- 🎟️ Áp dụng mã giảm giá (Coupon)
- 👤 Quản lý thông tin cá nhân
- 📦 Theo dõi đơn hàng
- ⭐ Đánh giá sản phẩm

### Quản trị viên (Admin)
- 📊 Dashboard thống kê doanh thu
- 📦 Quản lý sản phẩm (CRUD)
- 🏷️ Quản lý danh mục, thương hiệu
- 👥 Quản lý khách hàng
- 🎫 Quản lý mã giảm giá
- 📋 Quản lý đơn hàng
- 👤 Quản lý người dùng và phân quyền
- 🖼️ Quản lý banner, blog
- 📈 Xuất báo cáo doanh thu (Excel)

## 📁 Cấu trúc thư mục

```
fstudio-store/
├── client/               # Frontend Next.js
│   ├── src/
│   │   ├── app/         # Next.js App Router
│   │   ├── components/  # React Components
│   │   ├── lib/         # Utilities, APIs
│   │   └── types/       # TypeScript types
│   └── public/          # Static files
│
└── server/              # Backend Laravel
    ├── app/
    │   ├── Http/        # Controllers, Middleware
    │   ├── Models/      # Eloquent Models
    │   ├── Services/    # Business Logic
    │   └── Repositories/ # Data Access Layer
    ├── database/        # Migrations, Seeders
    └── routes/          # API Routes
```

## 🔑 Tài khoản mặc định

### Admin
- Email: `admin@fpt.com`
- Password: `123456`

### Customer
- Email: `nghiemle0602@gmail.com`
- Password: `Nl110024`

## 📝 Scripts hữu ích

### Client
```bash
npm run dev          # Development mode
npm run build        # Build production
npm run start        # Start production server
npm run lint         # Lint code
```

### Server
```bash
php artisan serve              # Start server
php artisan migrate:fresh --seed  # Reset database
php artisan cache:clear        # Clear cache
```

## 🤝 Đóng góp

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Nhóm phát triển

- Group 06 - DALN

## 📞 Liên hệ

- Gmail: nghiemle0602@gmail.comcom
