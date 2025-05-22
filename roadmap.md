
# Goal:
Tạo một tool dùng để phân tích SWOT


## Giao diện nhập thông tin (Input UI)
Cho phép người dùng nhập:

Mô tả vấn đề / ý tưởng / mục tiêu (dạng tự do)

Các mục tiêu cụ thể (tuỳ chọn)

Ngành nghề / lĩnh vực (dropdown: startup, giáo dục, y tế, bán hàng,...)

Giai đoạn (khởi đầu, mở rộng, suy giảm,...)

Loại quyết định: ví dụ như đầu tư / từ chối / mở rộng / thu hẹp / pivot

Dùng AI để tự động bóc tách từ input và tạo draft SWOT ban đầu.

## 🤖 Phân tích tự động ban đầu (AI-driven)
Sử dụng AI để:

Gợi ý sơ bộ các điểm mạnh / yếu / cơ hội / thách thức dựa trên mô tả của người dùng

Cho phép người dùng thêm / sửa / xoá từng gợi ý

✅ Có thể cung cấp các câu hỏi gợi mở như:

“Điều gì khiến bạn khác biệt so với đối thủ?”

“Bạn đang gặp trở ngại gì về nguồn lực?”

“Thị trường có cơ hội gì trong 6 tháng tới?”

## 📊 Trình bày ma trận SWOT (Matrix View)
Hiển thị ma trận:

```
+----------------+------------------+
| Strengths (S)  | Weaknesses (W)   |
+----------------+------------------+
| Opportunities (O) | Threats (T)   |
+----------------+------------------+
```

Cho phép kéo-thả, chỉnh sửa nội dung

Đánh dấu các yếu tố ưu tiên cao / thấp (dùng màu sắc, icon)

Tích hợp checkbox hoặc score để đánh giá mức độ ảnh hưởng (impact) của từng yếu tố

## 4. 🔁 Phân tích kết hợp (SWOT strategies synthesis)
Tạo 4 chiến lược đề xuất tự động từ phân tích SO, WO, ST, WT
Cho phép người dùng chọn chiến lược phù hợp nhất
Cung cấp recommendation như:

- Hành động cụ thể
- Rủi ro cần lưu ý
- Cách tận dụng lợi thế


## Share
Lưu project SWOT để xem lại

Xuất PDF, hoặc chia sẻ qua link (đặc biệt hữu ích cho startup / nhóm làm việc)

Tích hợp Google Drive, Notion, Trello?

## Backend: 
Nhận thông tin từ frontend và phân tích SWOT dựa trên các yếu tố đã nhập. Kết quả sẽ được trả về cho frontend để hiển thị.
Bổ sung openai agent (langchain) để phân tích SWOT dựa trên các yếu tố đã nhập. Kết quả sẽ được trả về cho frontend để hiển thị.

## Tech stack:
- Frontend: ReactJS + TailwindCSS + TypeScript + Zustand + shadcn
- Backend: FastAPI + SQLmodel
- Database: PostgreSQL
- AI: OpenAI (Langchain)

## Example of SWOT Analysis:
STRENGTHS
Current profit ratio increased
Employee morale high
Market share has increased

WEAKNESSES
Legal suits not resolved
Plant capacity has fallen
Lack of strategic management system

OPPORTUNITIES
Western European unification
Rising health consciousness in selecting foods
Demand for soups increasing annually

Opportunity-Strength (OS) Strategies
Acquire food company in Europe (S1, S3, O1)
Develop new healthy soups (S2, O2)
Opportunity-Weakness (OW) Strategies
Develop new Pepperidge Farm products (W1, O2, O3)
THREATS
Low value of dollar
Tin cans are not biodegradable

Threat-Strength (TS) Strategies
Develop new biodegradable soup containers (S1, T2)
Threat-Weakness (TW) Strategies
Close unprofitable European operations (W3, T1)