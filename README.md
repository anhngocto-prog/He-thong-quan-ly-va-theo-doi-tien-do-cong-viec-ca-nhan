# Hệ thống quản lý và theo dõi tiến độ công việc cá nhân

Dự án xây dựng ứng dụng hỗ trợ quản lý, sắp xếp và theo dõi tiến độ công việc cá nhân một cách hiệu quả, bao gồm giao diện người dùng (Frontend) và hệ thống xử lý dữ liệu (Backend).

---

## Tính năng chính

- Đăng ký và đăng nhập tài khoản người dùng
- Thêm, sửa, xóa công việc cá nhân
- Thiết lập Deadline và mức độ ưu tiên
- Đánh dấu trạng thái hoàn thành công việc
- Tìm kiếm và lọc công việc theo tên hoặc mức độ ưu tiên

---

## Công nghệ sử dụng

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** NodeJS, ExpressJS
- **Database:** Microsoft SQL Server
- **Công cụ hỗ trợ:** GitHub, Visual Studio Code

---

## Cấu trúc dự án

```plaintext
DỰ ÁN CẬP NHẬT CÁ NHÂN/
│
├── backend/          # Xử lý logic hệ thống (NodeJS, ExpressJS)
├── frontend/         # Giao diện người dùng (HTML, CSS, JS)
├── .gitignore        # Chặn các file rác và file bảo mật (.env, node_modules)
├── SQLdulieu.sql     # File script cấu trúc và dữ liệu SQL Server
├── Untitled.mdj      # File thiết kế sơ đồ (StarUML)
├── PLAN.md           # Kế hoạch phát triển dự án
├── ANALYSIS.md       # Phân tích hệ thống
└── README.md         # Hướng dẫn và giới thiệu tổng quan dự án
```

---

## Hướng dẫn cài đặt và chạy dự án

### 1. Cài đặt Backend

```bash
cd backend
npm install
node server.js
```

### 2. Kết nối Database

- Cài đặt Microsoft SQL Server
- Tạo database cho hệ thống
- Chạy file script SQL trong thư mục `database`

---

## Mục tiêu dự án

Xây dựng hệ thống quản lý công việc cá nhân giúp người dùng:
- Theo dõi tiến độ công việc
- Quản lý deadline hiệu quả
- Tăng năng suất làm việc cá nhân

---
