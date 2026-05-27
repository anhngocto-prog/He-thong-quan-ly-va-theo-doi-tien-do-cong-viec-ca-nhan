const { mssql } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
    // 1. Hàm tìm kiếm người dùng bằng Username (Dùng khi Đăng nhập hoặc kiểm tra trùng lặp)
    findByUsername: async (username) => {
        try {
            const pool = await mssql.connect();
            const result = await pool.request()
                .input('username', mssql.VarChar, username)
                .query('SELECT * FROM Users WHERE username = @username');
            return result.recordset[0]; // Trả về user đầu tiên tìm thấy (nếu có)
        } catch (error) {
            throw new Error('Lỗi khi tìm username: ' + error.message);
        }
    },

    // 2. Hàm tạo một người dùng mới (Dùng khi Đăng ký)
    create: async (username, password, email) => {
        try {
            // Mã hóa mật khẩu trước khi lưu vào DB
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const pool = await mssql.connect();
            await pool.request()
                .input('username', mssql.VarChar, username)
                .input('password', mssql.VarChar, hashedPassword)
                .input('email', mssql.VarChar, email)
                .query('INSERT INTO Users (username, password, email) VALUES (@username, @password, @email)');
            
            return { message: 'Tạo tài khoản thành công!' };
        } catch (error) {
            throw new Error('Lỗi khi tạo người dùng: ' + error.message);
        }
    }
};

module.exports = User;