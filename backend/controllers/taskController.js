const { mssql } = require('../config/db');
const Task = require('../models/taskModel');

// 1. Lấy danh sách công việc của một User cụ thể
const getTasks = async (req, res) => {
    const { user_id } = req.query; // Lấy user_id truyền trên đường link url
    if (!user_id) return res.status(400).json({ message: 'Thiếu user_id!' });

    try {
        const tasks = await Task.getAllByUserId(user_id);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Thêm công việc mới
const createTask = async (req, res) => {
    const { title, description, deadline, priority, user_id } = req.body;
    if (!title || !user_id) return res.status(400).json({ message: 'Tiêu đề và user_id không được để trống!' });

    try {
        const result = await Task.create(title, description, deadline, priority, user_id);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Sửa công việc / Cập nhật trạng thái Hoàn thành (Đã được tối ưu!)
// Thay thế lại hàm updateTask trong backend/controllers/taskController.js
const updateTask = async (req, res) => {
    const { task_id } = req.params;
    const { title, description, deadline, priority, status } = req.body;

    try {
        const pool = await mssql.connect();
        
        // 1. Nếu chỉ cập nhật riêng trạng thái (Khi bấm nút "Hoàn thành")
        if (status && !title) {
            await pool.request()
                .input('task_id', mssql.Int, task_id)
                .input('status', mssql.NVarChar, status)
                .query('UPDATE Tasks SET status = @status WHERE task_id = @task_id'); // Đã bỏ updated_at
            return res.status(200).json({ message: 'Đã cập nhật trạng thái hoàn thành!' });
        }

        // 2. Nếu sửa toàn bộ thông tin công việc (Dành cho tính năng sửa sau này)
        await pool.request()
            .input('task_id', mssql.Int, task_id)
            .input('title', mssql.NVarChar, title)
            .input('description', mssql.NVarChar, description)
            .input('deadline', mssql.Date, deadline)
            .input('priority', mssql.NVarChar, priority)
            .input('status', mssql.NVarChar, status || 'Pending')
            .query(`UPDATE Tasks 
                    SET title = @title, description = @description, deadline = @deadline, 
                        priority = @priority, status = @status 
                    WHERE task_id = @task_id`); // Đã bỏ updated_at

        res.status(200).json({ message: 'Cập nhật công việc thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật công việc: ' + error.message });
    }
};
// 4. Xóa công việc
const deleteTask = async (req, res) => {
    const { task_id } = req.params;

    try {
        const result = await Task.delete(task_id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };