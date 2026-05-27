const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// 1. Xử lý ĐĂNG KÝ (Register)
const registerUser = async (req, res) => {
    const { username, password, email } = req.body;

    // Kiểm tra xem người dùng đã nhập đủ thông tin chưa
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
    }

    try {
        // Kiểm tra xem username đã tồn tại trong DB chưa
        const userExists = await User.findByUsername(username);
        if (userExists) {
            return res.status(400).json({ message: 'Tài khoản này đã tồn tại rồi!' });
        }

        // Nếu chưa tồn tại thì tiến hành tạo mới
        const result = await User.create(username, password, email);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Xử lý ĐĂNG NHẬP (Login)
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Vui lòng nhập tài khoản và mật khẩu!' });
    }

    try {
        // Tìm user theo username
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(400).json({ message: 'Tài khoản hoặc mật khẩu không chính xác!' });
        }

        // So sánh mật khẩu người dùng gõ vào với mật khẩu đã mã hóa trong DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Tài khoản hoặc mật khẩu không chính xác!' });
        }

        // Đăng nhập thành công, trả về thông tin user (giấu mật khẩu đi cho an toàn)
        res.status(200).json({
            message: '🎉 Đăng nhập thành công mĩ mãn!',
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser };