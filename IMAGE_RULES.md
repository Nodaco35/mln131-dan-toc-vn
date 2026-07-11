# QUY TẮC VÀ ĐỊNH DẠNG HÌNH ẢNH (IMAGE RULES)

Tài liệu này hướng dẫn các thành viên trong nhóm cách chuẩn bị, đặt tên và quản lý hình ảnh cho dự án **Catalog 54 Dân tộc**. Các hình ảnh sau khi được đưa vào đúng thư mục và đặt đúng tên sẽ **tự động** được hiển thị trên giao diện của trang chi tiết dân tộc.

## 1. Vị trí lưu trữ ảnh

Tất cả hình ảnh của dự án phải được lưu trữ trong thư mục:
`public/images/`

Bên trong thư mục `images`, bạn cần **tạo các thư mục con** tương ứng với từng dân tộc. Tên thư mục con phải trùng khớp hoàn toàn với trường `id` của dân tộc đó trong file `data.json`.

**Ví dụ:** Dân tộc Xinh Mun có `id` là `xinh-mun`, vậy thư mục chứa ảnh sẽ là:
`public/images/xinh-mun/`

## 2. Quy tắc đặt tên và định dạng ảnh

Mỗi dân tộc sẽ cần tối đa **13 bức ảnh**, được chia làm các phần sau:

### 2.1. Ảnh Mascot (Nhân vật đại diện)
- **Tên file bắt buộc:** `mascot.png`
- **Định dạng:** PNG (Khuyến khích nền trong suốt / Transparent background).
- **Đường dẫn ví dụ:** `public/images/xinh-mun/mascot.png`

### 2.2. Ảnh Nội dung (Storytelling)
Mỗi dân tộc có 4 phần nội dung (`trang_phuc`, `am_thuc`, `phong_tuc`, `chuyen_ke`). Dưới mỗi phần nội dung sẽ hiển thị 3 hình ảnh.
- **Quy tắc tên file:** `{tên-phần-nội-dung}_{số-thứ-tự}.jpg`
- **Số thứ tự:** Từ `1` đến `3`.
- **Định dạng ưu tiên:** JPG (để tối ưu hóa dung lượng). PNG cũng được chấp nhận nhưng bạn sẽ cần báo lại để đổi đuôi trong code. Hiện tại hệ thống đang tự động nhận diện đuôi `.jpg` cho các ảnh này.

**Danh sách tên file cần chuẩn bị cho mỗi dân tộc:**

**A. Trang phục (3 ảnh):**
- `trang_phuc_1.jpg`
- `trang_phuc_2.jpg`
- `trang_phuc_3.jpg`

**B. Ẩm thực (3 ảnh):**
- `am_thuc_1.jpg`
- `am_thuc_2.jpg`
- `am_thuc_3.jpg`

**C. Phong tục (3 ảnh):**
- `phong_tuc_1.jpg`
- `phong_tuc_2.jpg`
- `phong_tuc_3.jpg`

**D. Chuyện kể (3 ảnh):**
- `chuyen_ke_1.jpg`
- `chuyen_ke_2.jpg`
- `chuyen_ke_3.jpg`

## 3. Cách nhận biết hệ thống đang thiếu ảnh nào?

Giao diện đã được thiết kế sẵn tính năng **Fallback (Hiển thị thay thế)**.
Nếu một thư mục dân tộc chưa được tạo, hoặc tên file ảnh bị sai/chưa có, trên giao diện trang web sẽ xuất hiện các ô xám có kèm dòng chữ cảnh báo. 

**Ví dụ:**
- Nếu thiếu ảnh mascot, ô vuông sẽ hiển thị chữ: `Thiếu ảnh Mascot`
- Nếu thiếu ảnh trang phục số 1, ô vuông sẽ hiển thị: `Thiếu ảnh trang_phuc_1.jpg`

Các thành viên chỉ cần duyệt qua các trang dân tộc trên trình duyệt. Nếu thấy ô nào báo thiếu ảnh nào, hãy chuẩn bị ảnh đúng với cái tên được yêu cầu đó và ném vào thư mục `public/images/{id}/`. F5 lại trình duyệt, ảnh sẽ tự động hiện lên!
