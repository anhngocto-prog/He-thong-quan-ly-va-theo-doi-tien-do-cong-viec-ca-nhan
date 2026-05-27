const { mssql } = require('../config/db');

const Task = {
    // 1. Lấy toàn bộ danh sách công việc của một User cụ thể
    getAllByUserId: async (user_id) => {
        try {
            const pool = await mssql.connect();
            const result = await pool.request()
                .input('user_id', mssql.Int, user_id)
                .query('SELECT * FROM Tasks WHERE user_id = @user_id ORDER BY deadline ASC');
            return result.recordset;
        } catch (error) {
            throw new Error('Lỗi khi lấy danh sách công việc: ' + error.message);
        }
    },

    // 2. Tạo một công việc mới
    create: async (title, description, deadline, priority, user_id) => {
        try {
            const pool = await mssql.connect();
            await pool.request()
                .input('title', mssql.NVarChar, title)
                .input('description', mssql.NVarChar, description)
                .input('deadline', mssql.Date, deadline)
                .input('priority', mssql.NVarChar, priority)
                .input('user_id', mssql.Int, user_id)
                .query(`INSERT INTO Tasks (title, description, deadline, priority, user_id) 
                        VALUES (@title, @description, @deadline, @priority, @user_id)`);
            return { message: 'Thêm công việc mới thành công!' };
        } catch (error) {
            throw new Error('Lỗi khi tạo công việc: ' + error.message);
        }
    },

    // 3. Cập nhật trạng thái hoặc thông tin công việc (Sửa)
    update: async (task_id, title, description, deadline, priority, status) => {
        try {
            const pool = await mssql.connect();
            await pool.request()
                .input('task_id', mssql.Int, task_id)
                .input('title', mssql.NVarChar, title)
                .input('description', mssql.NVarChar, description)
                .input('deadline', mssql.Date, deadline)
                .input('priority', mssql.NVarChar, priority)
                .input('status', mssql.NVarChar, status)
                .query(`UPDATE Tasks 
                        SET title = @title, description = @description, deadline = @deadline, 
                            priority = @priority, status = @status 
                        WHERE task_id = @task_id`);
            return { message: 'Cập nhật công việc thành công!' };
        } catch (error) {
            throw new Error('Lỗi khi cập nhật công việc: ' + error.message);
        }
    },

    // 4. Xóa một công việc
    delete: async (task_id) => {
        try {
            const pool = await mssql.connect();
            await pool.request()
                .input('task_id', mssql.Int, task_id)
                .query('DELETE FROM Tasks WHERE task_id = @task_id');
            return { message: 'Xóa công việc thành công!' };
        } catch (error) {
            throw new Error('Lỗi khi xóa công việc: ' + error.message);
        }
    }
};

module.exports = Task;