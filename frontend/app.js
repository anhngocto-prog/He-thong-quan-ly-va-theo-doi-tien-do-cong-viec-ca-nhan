// ========== CẤU HÌNH & BIẾN TOÀN CỤC ==========
const API_URL = 'http://localhost:5000/api';
let isLoginMode = true;
let currentUser = JSON.parse(localStorage.getItem('user')) || null;

// ========== KHỞI TẠO ==========
window.onload = () => {
    checkAuthStatus();
};

// ========== 1. CHUYỂN ĐỔI ĐĂNG NHẬP / ĐĂNG KÝ ==========
function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const authTitle = document.getElementById('auth-title');
    const btnPrimary = document.getElementById('btn-primary');
    const authToggle = document.getElementById('auth-toggle');
    const emailGroup = document.querySelector('.id-email');

    if (isLoginMode) {
        authTitle.innerHTML = '✨ ĐĂNG NHẬP.EXE ✨';
        btnPrimary.innerHTML = '<i class="fas fa-plug"></i> Đăng Nhập';
        authToggle.innerHTML = '<i class="fas fa-exchange-alt"></i> Chưa có tài khoản? Đăng ký ngay';
        emailGroup.style.display = 'none';
    } else {
        authTitle.innerHTML = '🌸 ĐĂNG KÝ TÀI KHOẢN.EXE 🌸';
        btnPrimary.innerHTML = '<i class="fas fa-user-plus"></i> Đăng Ký';
        authToggle.innerHTML = '<i class="fas fa-arrow-left"></i> Đã có tài khoản? Đăng nhập';
        emailGroup.style.display = 'block';
    }
}

// ========== 2. XỬ LÝ ĐĂNG NHẬP / ĐĂNG KÝ ==========
async function handleAuth() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!username || !password) {
        alert('🌸 Vui lòng nhập tài khoản và mật khẩu nhé!');
        return;
    }

    // ĐĂNG KÝ
    if (!isLoginMode) {
        if (!email) {
            alert('📧 Vui lòng nhập email để đăng ký!');
            return;
        }
        try {
            const response = await fetch(`${API_URL}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, email })
            });
            const data = await response.json();
            
            if (response.ok) {
                alert('🎉 Đăng ký thành công! Hãy đăng nhập nhé.');
                toggleAuthMode();
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';
            } else {
                alert('❌ Thất bại: ' + data.message);
            }
        } catch (error) {
            alert('😿 Lỗi kết nối Server! Kiểm tra backend tại localhost:5000');
        }
    } 
    // ĐĂNG NHẬP
    else {
        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();

            if (response.ok) {
                alert('✨ Đăng nhập thành công! ✨');
                localStorage.setItem('user', JSON.stringify(data.user));
                currentUser = data.user;
                checkAuthStatus();
                await loadTasks();
            } else {
                alert('❌ Lỗi: ' + data.message);
            }
        } catch (error) {
            alert('😿 Lỗi kết nối Server!');
        }
    }
}

// ========== 3. KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP ==========
function checkAuthStatus() {
    const authSection = document.getElementById('auth-section');
    const taskSection = document.getElementById('task-section');
    const userDisplay = document.getElementById('user-display');

    if (currentUser) {
        authSection.style.display = 'none';
        taskSection.style.display = 'block';
        userDisplay.innerText = currentUser.username;
    } else {
        authSection.style.display = 'block';
        taskSection.style.display = 'none';
    }
}

// ========== 4. TẢI DANH SÁCH CÔNG VIỆC ==========
async function loadTasks() {
    if (!currentUser) return;
    
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const priorityFilter = document.getElementById('filter-priority').value;
    const statusFilter = document.getElementById('filter-status').value;

    try {
        const response = await fetch(`${API_URL}/tasks?user_id=${currentUser.user_id}`);
        let tasks = await response.json();

        // THỐNG KÊ
        const total = tasks.length;
        const done = tasks.filter(t => t.status === 'Completed').length;
        document.getElementById('stat-total').innerText = total;
        document.getElementById('stat-done').innerText = done;
        document.getElementById('stat-pending').innerText = total - done;
        document.getElementById('task-counter').innerText = `${tasks.length} tasks 🌼`;

        // LỌC & TÌM KIẾM
        tasks = tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchTerm);
            const matchesPriority = (priorityFilter === 'All') || (task.priority === priorityFilter);
            const matchesStatus = (statusFilter === 'All') || (task.status === statusFilter);
            return matchesSearch && matchesPriority && matchesStatus;
        });

        const taskList = document.getElementById('task-list');
        
        if (tasks.length === 0) {
            taskList.innerHTML = '<div class="empty-tasks-message"><i class="fas fa-cat"></i> Không tìm thấy công việc nào!</div>';
            return;
        }

        taskList.innerHTML = tasks.map(task => {
            const isDone = task.status === 'Completed';
            const priorityClass = task.priority === 'Cao' ? 'p-high' : (task.priority === 'Trung bình' ? 'p-medium' : 'p-low');
            const priorityIcon = task.priority === 'Cao' ? '🔥' : (task.priority === 'Trung bình' ? '⚡' : '❄️');
            const dateStr = task.deadline ? new Date(task.deadline).toLocaleDateString('vi-VN') : 'Không có hạn';
            
            return `
                <div class="task-item ${isDone ? 'completed' : ''}" data-task-id="${task.task_id}">
                    <div class="task-info">
                        <h4>
                            ${escapeHtml(task.title)}
                            <span class="priority-tag ${priorityClass}">${priorityIcon} ${task.priority}</span>
                        </h4>
                        <p>${task.description ? escapeHtml(task.description) : '💬 Không có mô tả'}</p>
                        <p>📅 Hạn chót: <strong>${dateStr}</strong> | Trạng thái: ${isDone ? '✅ Đã hoàn thành' : '⏳ Đang chờ'}</p>
                    </div>
                    <div class="task-actions">
                        ${!isDone ? `<button class="btn-done" onclick="updateStatus(${task.task_id}, 'Completed')"><i class="fas fa-check"></i> Hoàn thành</button>` : ''}
                        <button onclick="handleDeleteTask(${task.task_id})"><i class="fas fa-trash-alt"></i> Xóa</button>
                    </div>
                </div>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Lỗi tải task:', error);
        document.getElementById('task-list').innerHTML = '<div class="empty-tasks-message"><i class="fas fa-database"></i> Lỗi kết nối server!</div>';
    }
}

// ========== 5. THÊM CÔNG VIỆC MỚI ==========
async function handleCreateTask() {
    const title = document.getElementById('task-title').value.trim();
    const description = document.getElementById('task-desc').value.trim();
    const deadline = document.getElementById('task-deadline').value;
    const priority = document.getElementById('task-priority').value;

    if (!title) {
        alert('🌸 Tên công việc không được bỏ trống nhé!');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                description,
                deadline,
                priority,
                user_id: currentUser.user_id,
                status: 'Pending'
            })
        });

        if (response.ok) {
            document.getElementById('task-title').value = '';
            document.getElementById('task-desc').value = '';
            document.getElementById('task-deadline').value = '';
            await loadTasks();
            alert('✨ Thêm công việc thành công! ✨');
        } else {
            const data = await response.json();
            alert('❌ Lỗi: ' + data.message);
        }
    } catch (error) {
        alert('😿 Lỗi kết nối Server!');
    }
}

// ========== 6. CẬP NHẬT TRẠNG THÁI HOÀN THÀNH (FIX LỖI) ==========
async function updateStatus(task_id, newStatus) {
    console.log('Đang cập nhật task:', task_id, '->', newStatus); // Debug
    
    try {
        // Gửi request PUT để cập nhật status
        const response = await fetch(`${API_URL}/tasks/${task_id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                status: newStatus 
            })
        });
        
        console.log('Response status:', response.status); // Debug
        
        // Đọc response body
        const data = await response.json();
        console.log('Response data:', data); // Debug
        
        if (response.ok) {
            alert('✅ Cập nhật trạng thái thành công!');
            await loadTasks(); // Tải lại danh sách
        } else {
            // Hiển thị lỗi chi tiết
            alert('Không thể cập nhật! Lỗi: ' + (data.message || 'Không rõ nguyên nhân'));
        }
    } catch (error) {
        console.error('Lỗi chi tiết:', error);
        alert('Lỗi kết nối hoặc server không phản hồi! Kiểm tra backend.');
    }
}

// ========== 7. XÓA CÔNG VIỆC ==========
async function handleDeleteTask(task_id) {
    if (!confirm('Bạn có chắc muốn xóa công việc này không? 🥺')) return;

    try {
        const response = await fetch(`${API_URL}/tasks/${task_id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            await loadTasks();
            alert('🗑️ Đã xóa công việc!');
        } else {
            const data = await response.json();
            alert('Không thể xóa: ' + (data.message || 'Lỗi không xác định'));
        }
    } catch (error) {
        alert('Lỗi kết nối Server!');
    }
}

// ========== 8. ĐĂNG XUẤT ==========
function logout() {
    if (confirm('Bạn muốn đăng xuất? Hẹn gặp lại nhé 🌸')) {
        localStorage.removeItem('user');
        currentUser = null;
        checkAuthStatus();
    }
}

// ========== 9. TIỆN ÍCH ==========
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}