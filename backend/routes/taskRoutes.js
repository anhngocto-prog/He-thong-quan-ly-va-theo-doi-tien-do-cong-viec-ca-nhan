const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');

// 1. Lấy toàn bộ danh sách công việc của một User cụ thể
// GET http://localhost:5000/api/tasks?user_id=1
router.get('/', getTasks);          

// 2. Tạo một công việc mới
// POST http://localhost:5000/api/tasks
router.post('/', createTask);        

// 3. Cập nhật trạng thái hoặc thông tin công việc (Nút "Xong" sẽ gọi đường dẫn này)
// PUT http://localhost:5000/api/tasks/1
router.put('/:task_id', updateTask);  

// 4. Xóa một công việc
// DELETE http://localhost:5000/api/tasks/1
router.delete('/:task_id', deleteTask); 

module.exports = router;