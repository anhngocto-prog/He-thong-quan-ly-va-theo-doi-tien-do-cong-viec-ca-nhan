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
    
    // Validate dữ liệu trống
    if (!title || !user_id) {
        return res.status(400).json({ message: 'Tiêu đề và user_id không được để trống!' });
    }

    // Leak case: Kiểm tra tiêu đề quá dài
    if (title.length > 100) {
        return res.status(400).json({ message: 'Tiêu đề công việc không được vượt quá 100 ký tự!' });
    }

    // Leak case: Kiểm tra deadline trong quá khứ
    if (deadline && new Date(deadline) < new Date()) {
        return res.status(400).json({ message: 'Hạn hoàn thành phải lớn hơn hoặc bằng thời gian hiện tại!' });
    }

    try {
        const result = await Task.create(title, description, deadline, priority, user_id);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Sửa công việc / Cập nhật trạng thái
const updateTask = async (req, res) => {
    const { task_id } = req.params;
    const { title, description, deadline, priority, status } = req.body;

    // Leak case: Nếu có sửa deadline, kiểm tra xem có hợp lệ không
    if (deadline && new Date(deadline) < new Date()) {
        return res.status(400).json({ message: 'Hạn hoàn thành phải lớn hơn hoặc bằng thời gian hiện tại!' });
    }
    
    // Leak case: Kiểm tra tiêu đề quá dài khi chỉnh sửa
    if (title && title.length > 100) {
        return res.status(400).json({ message: 'Tiêu đề công việc không được vượt quá 100 ký tự!' });
    }

    try {
        // Đẩy toàn bộ logic kết nối SQL sang Model để đúng chuẩn MVC
        const result = await Task.update(task_id, { title, description, deadline, priority, status });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
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