# Quy chuẩn biên soạn VSTEP Speaking Part 01 – B2 LEVEL

Khi thêm mới hoặc chỉnh sửa chủ đề trong `script.js` (`practiceTopicsData`), **BẮT BUỘC** tuân thủ:

1. **Văn nói B2 tự nhiên, dễ phát âm (KHÔNG viết kiểu IELTS Writing Task 2):**
   - Bài mẫu dài **35–45 từ** (nói tự nhiên trong 30–40 giây).
   - Dùng collocations B2 thực tế trong giao tiếp hằng ngày (`clear my mind`, `unwind after a busy day`, `save money on daily travel`, `build good habits`, `boost brain development`...).
   - **Cấm dùng từ C1/C2, từ học thuật viết luận hoặc văn chương** (vd: `alleviate, mitigate, foster, cultivate, nurture, utilize, paramount, detrimental, indispensable, undeniably, remarkably, exceptionally, effortlessly, predominantly, substantially, seldom, profound, immense, tranquil, serene, pristine, exquisite, scrumptious, wholesome, savor, relish, relentless, perpetual, intricate, sophisticated, ergonomic, state-of-the-art, transformative, visionary, potent, daunting, tedious, commendable, claustrophobic, neuroplasticity, sanctuary, vistas, palate, craftsmanship, aesthetic, merchandise, prestige, resilience, perseverance, keepsakes, gridlock, rigorously, indelible, flourish, plagiarism...`).
2. **Đồng bộ đầy đủ 4 thành phần:** `formula`, `vocabGroups`, `samples[].text` và `samples[].formatted` (chú ý thẻ `<u>`/`<span>` trong `formatted` phải khớp 100% với `text`).
3. **Bắt buộc chạy kiểm tra tự động trước khi commit/push:**
   ```bash
   node check_vocab.js
   ```
   Chỉ commit khi kết quả trả về **PASS (0 lỗi)** và đã nâng version cache `?v=...` cho `script.js` trong `index.html`.
