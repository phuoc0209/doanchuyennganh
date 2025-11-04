# Trang web cơ bản (marketplace-style)

Trang tĩnh mẫu, hiện đã có giao diện dạng chợ (danh sách sản phẩm/bài viết) cùng thanh tìm kiếm và bộ lọc.

Mở nhanh:

- Mở file `index.html` trong trình duyệt (double-click hoặc chuột phải -> Open with Browser) hoặc bằng PowerShell:

```powershell
ii 'c:\Users\Yen\OneDrive\Desktop\LTM\myblog\doanchuyennganh\basic-website\index.html'
```

Tính năng hiện có:

- Thanh tìm kiếm (tìm theo tiêu đề, mô tả, địa điểm).
- Bộ lọc danh mục (nhấn các chip ở header để lọc theo loại).
- Danh sách bài dạng card, responsive (grid 3/2/1 cột tùy màn hình).
- Hiển thị thời gian ở footer.
- Nhấn phím `t` để thử chuyển giao diện tối/sáng (demo).

Tùy chỉnh nhanh:

- Thêm/bớt bài: chỉnh trong `index.html` mục `#posts-grid` (mỗi `.post` có các thuộc tính `data-title`, `data-loc`, `data-cat`).
- Thay đổi giao diện: chỉnh `styles.css`.
- Tùy biến tìm kiếm/lọc: chỉnh `script.js` (hàm `filterPosts`).

Yêu cầu: không có build step — chỉ cần trình duyệt hiện đại.

Chức năng Đăng nhập/Đăng ký (demo):

- Tôi đã thêm modal Đăng nhập và Đăng ký. Đây là demo client-side dùng `localStorage` để lưu người dùng — KHÔNG an toàn cho sản phẩm thật.
- Lưu ý bảo mật: Không dùng phương pháp này trong môi trường production. Cần backend, hashing mật khẩu, HTTPS và kiểm soát phiên.

Muốn tôi triển khai:

- Tạo API backend (Node/Express) để lưu người dùng an toàn.
- Kết nối form với backend và thêm xác thực JWT hoặc sessions.
