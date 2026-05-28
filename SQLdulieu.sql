-- 1. Tạo Cơ sở dữ liệu và chọn vùng làm việc
CREATE DATABASE PersonalTaskManager;
GO
USE PersonalTaskManager;
GO

-- 2. Tạo bảng USER (Lưu trữ thông tin tài khoản người dùng)
CREATE TABLE Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,       -- Khóa chính, tự động tăng
    username NVARCHAR(50) NOT NULL UNIQUE,       -- Tên đăng nhập (Duy nhất)
    password_hash NVARCHAR(255) NOT NULL,        -- Mật khẩu đã mã hóa băm bảo mật
    email NVARCHAR(100) NOT NULL UNIQUE,         -- Email tài khoản (Duy nhất)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP -- Thời gian tạo tài khoản tự động
);
GO

-- 3. Tạo bảng TASK (Lưu trữ danh sách công việc cá nhân)
CREATE TABLE Tasks (
    task_id INT IDENTITY(1,1) PRIMARY KEY,       -- Khóa chính, tự động tăng
    title NVARCHAR(100) NOT NULL,                -- Tiêu đề công việc (Tối đa 100 ký tự)
    description NVARCHAR(MAX) NULL,              -- Mô tả chi tiết (Cho phép để trống)
    deadline DATETIME NOT NULL,                  -- Hạn hoàn thành công việc
    priority NVARCHAR(20) NOT NULL,              -- Mức độ ưu tiên
    status NVARCHAR(20) DEFAULT 'Pending',       -- Trạng thái mặc định ban đầu là Pending
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Ngày tạo task tự động
    updated_at DATETIME NULL,                    -- Ngày cập nhật thông tin gần nhất
    user_id INT NOT NULL,                        -- ID của người dùng sở hữu task

    -- Thiết lập Khóa ngoại liên kết bảng Tasks với bảng Users
    CONSTRAINT FK_Tasks_Users FOREIGN KEY (user_id) 
        REFERENCES Users(user_id) 
        ON DELETE CASCADE,                       -- Xóa user thì tự động xóa các task liên quan

    -- Ràng buộc giá trị nhập vào cho cột trạng thái (Status)
    CONSTRAINT CHK_Task_Status CHECK (status IN ('Pending', 'Completed')),

    -- Ràng buộc giá trị nhập vào cho cột mức độ ưu tiên (Priority)
    CONSTRAINT CHK_Task_Priority CHECK (priority IN ('Low', 'Medium', 'High'))
);
GO

-- 4. Một số câu lệnh kiểm tra dữ liệu nhanh 
-- SELECT * FROM Users;
-- SELECT * FROM Tasks;