const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/db'); 

const app = express();

// Cấu hình Middleware
app.use(cors());
app.use(express.json()); 

// Gọi hàm kết nối database từ file db.js
connectDB();

// Cấu hình các Tuyến đường API cho Users
app.use('/api/users', require('./routes/userRoutes'));

// Thêm dòng này vào ngay dưới nha bạn:
app.use('/api/tasks', require('./routes/taskRoutes'));

// Tạo đường dẫn test
app.get('/', (req, res) => {
    res.send('Server Backend đang hoạt động bình thường!');
});

// Chạy Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy mượt mà tại cổng: http://localhost:${PORT}`);
});