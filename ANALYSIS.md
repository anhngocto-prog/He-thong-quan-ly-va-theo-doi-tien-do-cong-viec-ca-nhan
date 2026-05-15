PHÂN TÍCH HỆ THỐNG QUẢN LÝ VÀ THEO DÕI TIẾN ĐỘ CÔNG VIỆC CÁ NHÂN

1. Giới thiệu hệ thống

1.1. Mục tiêu

Hỗ trợ người dùng quản lý danh sách công việc hiệu quả, theo dõi tiến độ thực hiện, sắp xếp mức độ ưu tiên và nâng cao năng suất làm việc.

1.2. Đối tượng sử dụng

Sinh viên, nhân viên văn phòng và các cá nhân có nhu cầu quản lý thời gian.

2. Yêu cầu hệ thống (Requirements)

2.1. Yêu cầu chức năng (Functional Requirements)

Mã

Chức năng

Mô tả

FR01

Đăng ký

Người dùng tạo tài khoản mới

FR02

Đăng nhập

Truy cập vào hệ thống cá nhân

FR03

Thêm công việc

Tạo task mới với tên, mô tả, deadline

FR04

Chỉnh sửa

Cập nhật lại thông tin công việc

FR05

Xóa

Loại bỏ task khỏi danh sách

FR06

Tìm kiếm

Tìm công việc theo tên

FR07

Đặt deadline

Thiết lập thời hạn cho từng task

FR08

Theo dõi tiến độ

Xem trạng thái hoàn thành/chưa hoàn thành

2.2. Yêu cầu phi chức năng (Non-functional Requirements)

Giao diện thân thiện, dễ sử dụng.

Hệ thống hoạt động ổn định và tốc độ phản hồi nhanh.

Dữ liệu được bảo mật và lưu trữ an toàn trên SQL Server.

3. Biểu đồ Use Case (Use Case Diagram)

Biểu đồ này mô tả các chức năng chính mà người dùng có thể thực hiện trên hệ thống:

graph LR
    User((Người dùng))
    
    subgraph "Hệ thống Quản lý Công việc"
        UC1(Đăng nhập/Đăng ký)
        UC2(Thêm công việc mới)
        UC3(Chỉnh sửa/Xóa task)
        UC4(Tìm kiếm công việc)
        UC5(Thiết lập Deadline & Ưu tiên)
        UC6(Theo dõi tiến độ)
    end
    
    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6


4. Biểu đồ hoạt động (Activity Diagram)

Quy trình hệ thống xử lý khi người dùng thực hiện thêm một nhiệm vụ mới:

flowchart TD
    Start([Bắt đầu]) --> Login[Đăng nhập hệ thống]
    Login --> Select[Chọn chức năng Thêm công việc]
    Select --> Input[Nhập thông tin Task]
    Input --> Validate{Dữ liệu hợp lệ?}
    Validate -- Không --> Error[Báo lỗi & Nhập lại]
    Error --> Input
    Validate -- Có --> Save[Lưu vào Database SQL Server]
    Save --> Show[Hiển thị danh sách cập nhật]
    Show --> End([Kết thúc])


5. Thiết kế cơ sở dữ liệu (ERD)

Sơ đồ quan hệ thực thể mô tả cách lưu trữ dữ liệu người dùng và công việc:

erDiagram
    USER ||--o{ TASK : "quản lý"
    USER {
        int user_id PK
        string username
        string password
    }
    TASK {
        int task_id PK
        string title
        string description
        date deadline
        string priority
        string status
        int user_id FK
    }


6. Công nghệ sử dụng

Frontend: HTML, CSS, JavaScript

Backend: NodeJS

Database: SQL Server

Công cụ hỗ trợ: GitHub, Visual Studio Code

7. Kết luận

Tài liệu này trình bày chi tiết các thành phần logic của hệ thống. Việc sử dụng các sơ đồ chuẩn hóa giúp quá trình phát triển ở các giai đoạn sau trở nên rõ ràng và chính xác hơn.
