-- Seed fetal development daily content — weeks 0–42
-- 43 articles, one per pregnancy week, public-read via existing articles RLS policy

insert into articles (slug, title_vi, body_md_vi, tags, age_min_months, age_max_months, published_at) values

(
  'thai-nhi-tuan-0',
  'Tuần 0 — Trước Thụ Thai',
  E'## 🌱 Tuần 0 — Trước Thụ Thai\n\n| Ngày | Nội dung |\n|------|----------|\n| 0w0d | Con chưa tồn tại — tinh trùng và trứng đang chờ gặp nhau trong cơ thể bố và mẹ. |\n| 0w1d | Trứng đã ở trong cơ thể mẹ từ khi mẹ sinh ra — tuổi trứng bằng tuổi mẹ. |\n| 0w2d | Các nang trứng bắt đầu phát triển. Trong cả cuộc đời mẹ có ~2 triệu nang, nhưng chỉ ~500 trứng rụng. |\n| 0w3d | Chu kỳ rụng trứng 28 ngày, mỗi tháng chỉ 1 trứng trưởng thành — rất quý giá! |\n| 0w4d | Trứng là tế bào lớn nhất cơ thể phụ nữ, đường kính ~0,1mm, sống lâu hơn các tế bào khác. |\n| 0w5d | Nang trứng chính phát triển khác nhau mỗi ngày, đến ngày 14 đạt kích thước lớn nhất rồi rụng. |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 0', 'tam cá nguyệt 1'],
  null, null, now()
),

(
  'thai-nhi-tuan-1',
  'Tuần 1 — Rụng Trứng',
  E'## 🥚 Tuần 1 — Rụng Trứng\n\n| Ngày | Nội dung |\n|------|----------|\n| 1w0d | Trứng đang phát triển, sắp kết hợp với 1 trong hàng vạn tinh trùng. |\n| 1w1d | Bố có thể xuất ~200 triệu tinh trùng/lần, khoảng 1 triệu sẽ tranh giành 1 trứng. |\n| 1w2d | Trứng chín → rụng ra ngoài → vào vòi trứng chờ tinh trùng. |\n| 1w3d | Progesterone làm cổ tử cung giãn nở, tạo điều kiện cho tinh trùng đi vào. |\n| 1w4d | 100–300 triệu tinh trùng bơi ngược dòng trong cơ thể mẹ. |\n| 1w5d | Trứng chỉ sống được 12–36 giờ. Nếu không thụ tinh kịp phải chờ tháng sau. |\n| 1w6d | Lông mao quét trứng vào vòi trứng — đây sẽ là "nhà" của con 10 tháng tới! |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 1', 'tam cá nguyệt 1'],
  null, null, now()
),

(
  'thai-nhi-tuan-2',
  'Tuần 2 — Thụ Tinh',
  E'## 💫 Tuần 2 — Thụ Tinh\n\n| Ngày | Nội dung |\n|------|----------|\n| 2w0d | Tinh trùng di chuyển qua ống cổ tử cung, vào vòi trứng chờ gặp trứng. |\n| 2w1d | Cuộc đua khốc liệt: tinh trùng xâm nhập, trứng chọn 1 bạn đồng hành. |\n| 2w2d | Tinh trùng đi từ âm đạo đến vòi trứng trong 1–1,5 giờ (nhanh nhất vài phút). |\n| 2w3d | Chỉ tinh trùng nhanh nhất, mạnh nhất mới gặp được trứng — quyết định trí thông minh của con. |\n| 2w4d | Tinh trùng phải phá vỡ vòng tế bào cumulus bao quanh trứng mới tiếp cận được. |\n| 2w5d | Đầu tinh trùng vào trứng trước, trứng kéo vào, đuôi ở ngoài. Bề mặt trứng tạo màng ngăn tinh trùng khác. |\n| 2w6d | Tinh trùng + trứng = trứng được thụ tinh! Vòi trứng cung cấp dinh dưỡng và vận chuyển vào tử cung. |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 2', 'tam cá nguyệt 1'],
  null, null, now()
),

(
  'thai-nhi-tuan-3',
  'Tuần 3 — Làm Tổ',
  E'## 🔬 Tuần 3 — Làm Tổ\n\n| Ngày | Nội dung |\n|------|----------|\n| 3w0d | Trứng thụ tinh phân chia 3–4 lần: từ 2 → 16 tế bào, hình thành khối cầu nhỏ chắc chắn. |\n| 3w1d | Phôi nang bám vào tử cung — mẹ có thể ra một ít máu nhạt, đó là dấu hiệu con đã vào bụng mẹ! |\n| 3w2d | Phôi nang cấy vào tử cung, bắt đầu tạo môi trường độc lập để phát triển. |\n| 3w3d | Túi ối xuất hiện: màng trong (chứa con + nước ối) và màng ngoài (màng đệm, một phần nhau thai). |\n| 3w4d | Nhau thai đang hình thành — vẫn cần máu mẹ vận chuyển dinh dưỡng đến. |\n| 3w5d | Con là khối bầu dục nhỏ, có lớp lông tơ truyền dinh dưỡng/oxy và thải chất thải. |\n| 3w6d | Mô nhau thai tiết hormone và protein. Hệ tuần hoàn máu của con bước đầu hình thành. |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 3', 'tam cá nguyệt 1'],
  null, null, now()
),

(
  'thai-nhi-tuan-4',
  'Tuần 4 — Phôi Thai',
  E'## 🌿 Tuần 4 — Phôi Thai\n\n| Ngày | Nội dung |\n|------|----------|\n| 4w0d | Tế bào nhau thai vận chuyển máu. Nước ối bảo vệ con. Túi noãn hoàng tạo hồng cầu. |\n| 4w1d | Con bước vào thời kỳ phôi thai: nội bì, trung bì, ngoại bì — ba lớp sẽ thành các cơ quan khác nhau. |\n| 4w2d | Con có đuôi dài như cá ngựa nhỏ. Hệ thần kinh (não, tủy sống) và thận bắt đầu phát triển. |\n| 4w3d | Con kết nối với mẹ qua dây rốn (1 tĩnh mạch + 2 động mạch). Đã phân biệt được đầu và đuôi. |\n| 4w4d | Hệ thần kinh trung ương phát triển. Tế bào "dây sống" hình thành — sau này là tủy sống. |\n| 4w5d | Cơ thể dần duỗi ra. Thận phát triển nhưng chưa hoạt động — vẫn nhờ nhau thai trao đổi chất. |\n| 4w6d | Nhau thai thực sự bắt đầu hình thành. Tế bào não tạo ra nhanh chóng. Con sắp có ý thức! |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 4', 'tam cá nguyệt 1'],
  null, null, now()
),

(
  'thai-nhi-tuan-5',
  'Tuần 5 — Tim Bắt Đầu Đập',
  E'## 💓 Tuần 5 — Tim Bắt Đầu Đập\n\n| Ngày | Nội dung |\n|------|----------|\n| 5w0d | Đầu con rất to, 4 ngăn tim đang phát triển. Lồng ngực và khoang bụng bắt đầu hình thành. |\n| 5w1d | Con lớn bằng hạt hướng dương. Mạch máu hình thành, máu tuần hoàn. Hai chấm đen nhỏ = mắt của con! |\n| 5w2d | Nhau thai vất vả truyền dinh dưỡng. Cánh tay và đùi bắt đầu phát triển. |\n| 5w3d | Động mạch chủ hình thành, tim bắt đầu vận chuyển máu và dinh dưỡng đến các cơ quan! |\n| 5w4d | Lồng ngực và khoang bụng tách nhau. Phổi, ruột, tuyến tụy, dạ dày bắt đầu phát triển. |\n| 5w5d | Gan cơ bản hình thành, tuyến giáp phát triển. Hai cánh tay trông như vây cá — rất dễ thương! |\n| 5w6d | Tim bắt đầu đập — vận chuyển máu tươi và dinh dưỡng đến các cơ quan. |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 5', 'tam cá nguyệt 1'],
  null, null, now()
),

(
  'thai-nhi-tuan-6',
  'Tuần 6 — Hình Dáng Người',
  E'## 👁️ Tuần 6 — Hình Dáng Người\n\n| Ngày | Nội dung |\n|------|----------|\n| 6w0d | Con lớn gấp 1000 lần ban đầu, trông như quả nho khô. Con thích cuộn chữ C trong nước ối. |\n| 6w1d | Các lớp da hình thành. Đường nét miệng, mí mắt, lỗ mũi mờ dần hiện ra. |\n| 6w2d | Não tiến hóa thành 3 phần: não trước, não giữa, não sau. Môi bắt đầu xuất hiện. |\n| 6w3d | Tim hình thành các ngăn. Loa tai, mí mắt, núm vú và môi trên thành hình. |\n| 6w4d | Da phát triển, phân biệt được mặt/miệng/mắt/tai. Ngón tay, ngón chân bắt đầu xuất hiện. |\n| 6w5d | Cơ và sụn phát triển. Ruột, gan, tuyến tụy đã có hình dạng. |\n| 6w6d | Hàm trên/dưới xuất hiện. Mô tuyến vú phát triển. Con bắt đầu chuyển động trong tử cung — có thể thấy qua siêu âm! |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 6', 'tam cá nguyệt 1'],
  null, null, now()
),

(
  'thai-nhi-tuan-7',
  'Tuần 7 — Bằng Quả Việt Quất',
  E'## 🫐 Tuần 7 — Bằng Quả Việt Quất\n\n| Ngày | Nội dung |\n|------|----------|\n| 7w0d | Con lớn bằng quả việt quất. Đuôi sắp biến mất. Ngón tay/chân như màng chân vịt nhỏ. |\n| 7w1d | Khung xương và hệ thống thính giác bước đầu hình thành — nhưng chưa nghe được giọng mẹ. |\n| 7w2d | Tế bào não phát triển nhanh, nhạy cảm với thông tin từ cơ thể mẹ. Đầu vẫn chiếm nửa cơ thể. |\n| 7w3d | Vòm miệng phát triển, răng/hàm/cơ mặt bắt đầu hình thành. Xương cứng dần. |\n| 7w4d | Con bắt đầu thành hình người. Tim/não/gan/phổi/thận phát triển nhanh. Nhịp tim bình thường hơn. |\n| 7w5d | Con bắt đầu "đi tiểu". Cơ quan sinh sản ngoài bắt đầu phát triển. Dây rốn hình thành! |\n| 7w6d | Tay chân lớn nhanh. Bắt đầu mọc mầm răng sữa. Nụ vị giác phát triển! |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 7', 'tam cá nguyệt 1'],
  null, null, now()
),

(
  'thai-nhi-tuan-8',
  'Tuần 8 — Bằng Quả Mâm Xôi',
  E'## 🫧 Tuần 8 — Bằng Quả Mâm Xôi\n\n| Ngày | Nội dung |\n|------|----------|\n| 8w0d | Con lớn bằng quả mâm xôi. Ngũ quan đầy đủ, đầu to tròn, tim và khoang bụng cơ bản hình thành. |\n| 8w1d | Xúc giác phát triển sớm, thính giác nhạy cảm. Con cần thêm thời gian để học chớp mắt. |\n| 8w2d | Lỗ mũi và chóp mũi mọc ra. Ngón chân vẫn dính nhau. Con sắp nghe được giọng mẹ! |\n| 8w3d | Bề mặt não trơn phẳng, ít nếp nhăn. Hệ nội tiết phát triển. Có thể nghe tim thai qua siêu âm! |\n| 8w4d | Mũi và miệng phát triển, vòm miệng đầu hình thành. Con thử uốn cong khuỷu tay và cổ tay. |\n| 8w5d | "Đuôi nhỏ" biến mất. Tay chân dài hơn. Xương, cơ, khớp mọc ra. |\n| 8w6d | Da mỏng và trong suốt, có khả năng xúc giác cơ bản. Hệ thần kinh trung ương phát triển nhanh. |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 8', 'tam cá nguyệt 1'],
  null, null, now()
),

(
  'thai-nhi-tuan-9',
  'Tuần 9 — Có Phản Xạ Thần Kinh',
  E'## 🧠 Tuần 9 — Có Phản Xạ Thần Kinh\n\n| Ngày | Nội dung |\n|------|----------|\n| 9w0d | "Đuôi nhỏ" biến mất. Ngón tay/chân phân biệt rõ. Con đã có phản xạ thần kinh, thích vận động. |\n| 9w1d | Con là búp bê đầu to nhưng đang cố gắng cao lên. Các cơ quan đã có hình dạng sơ khai. |\n| 9w2d | Tim đập mạnh. Xúc giác phát triển nhanh để sớm tương tác với mẹ. |\n| 9w3d | Khuỷu tay và đầu gối thử uốn cong. Con luyện tập vươn người và ngáp. |\n| 9w4d | Hệ thần kinh phản ứng với kích thích bên ngoài. Răng sữa bắt đầu mọc (dưới lợi). |\n| 9w5d | Ngũ quan trên khuôn mặt thành hình. Con giống bố hay mẹ hơn? |\n| 9w6d | Khuôn mặt lập thể hơn. Mắt di chuyển vào giữa. Cẳng tay/khuỷu/ngón tay phân biệt được. |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 9', 'tam cá nguyệt 1'],
  null, null, now()
),

(
  'thai-nhi-tuan-10',
  'Tuần 10',
  E'## 🦴 Tuần 10\n\n| Ngày | Nội dung |\n|------|----------|\n| 10w0d | Xương hộp sọ phát triển và cứng lại. Nhiều cơ quan bắt đầu hoạt động. |\n| 10w1d | Da dày dần. Con thích vươn vai, tập thể dục trong "căn nhà nhỏ". |\n| 10w2d | Tim đập mạnh mẽ. Hệ tiêu hóa phát triển nhanh. Con có thể hấp thu glucose! |\n| 10w3d | Cổ cứng cáp hơn, sắp nâng đỡ được đầu. Ngũ quan rõ nét hơn. |\n| 10w4d | Dây rốn bắt đầu quấn theo sự di chuyển của con — nhưng con biết cách tháo ra. |\n| 10w5d | Đại não phát triển còn nhanh hơn cả xương và cơ. |\n| 10w6d | Mọc lông mày và lông khắp người. Lỗ mũi hình thành. Con đang thở qua dây rốn — không bị sặc nước ối. |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 10', 'tam cá nguyệt 1'],
  null, null, now()
),

(
  'thai-nhi-tuan-11',
  'Tuần 11',
  E'## 👂 Tuần 11\n\n| Ngày | Nội dung |\n|------|----------|\n| 11w0d | Mắt và tai rất rõ nét. Con biết lộn nhào, vươn vai. |\n| 11w1d | Khuôn mặt phát triển — con và mẹ bắt đầu có điểm giống nhau. Mắt di chuyển về giữa, tai vào vị trí. |\n| 11w2d | Khả năng tiêu hóa sẵn sàng để mút và bú sữa ngay sau khi sinh. Mí mắt vẫn nhắm. |\n| 11w3d | Tủy xương tạo máu. Nhiều tế bào bạch cầu được phân chia để bảo vệ cơ thể. |\n| 11w4d | Con bắt đầu đi tiểu vào nước ối — nhưng nước tiểu rất sạch. Phản xạ có điều kiện tốt hơn. |\n| 11w5d | Nhịp tim rõ ràng — mẹ có nghe thấy khi khám thai không? Nhau thai hình thành, dây rốn truyền dinh dưỡng. |\n| 11w6d | Móng tay, tóc, lợi răng sữa tăng nhanh. Mẹ có thấy con qua siêu âm chưa? |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 11', 'tam cá nguyệt 1'],
  null, null, now()
),

(
  'thai-nhi-tuan-12',
  'Tuần 12',
  E'## ✋ Tuần 12\n\n| Ngày | Nội dung |\n|------|----------|\n| 12w0d | Con luôn cuộn tròn cho an toàn. Biết mở miệng, ngáp, nuốt. |\n| 12w1d | Tất cả khớp hình thành. Cổ nâng được đầu. Bàn tay nắm chặt được, ngón chân uốn cong. |\n| 12w2d | Tạo máu linh hoạt, ngũ quan rõ nét. Dấu vân tay bắt đầu phát triển. Dây thanh âm hình thành. |\n| 12w3d | Ngón chân tách ra. Mắt cá chân hoàn thiện. Tai dựng lên. Mặt mũi ngày càng xinh. |\n| 12w4d | Đại não tiếp tục phát triển. Nhãn cầu bắt đầu nhạy cảm với ánh sáng. |\n| 12w5d | Mặt mọc lông mịn. 20 chiếc răng sữa hình thành trong lợi. Gan tiết mật, tuyến tụy sản sinh insulin. |\n| 12w6d | Da hồng hào, trơn bóng. Dấu vân tay gần hoàn chỉnh — chứng minh thư độc nhất vô nhị của con! |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 12', 'tam cá nguyệt 1'],
  null, null, now()
),

(
  'thai-nhi-tuan-13',
  'Tuần 13',
  E'## 🌸 Tuần 13\n\n| Ngày | Nội dung |\n|------|----------|\n| 13w0d | Tỷ lệ thân hình cân đối hơn. Môi khép mở. Cổ đỡ được đầu. Con thường xuyên lật người. |\n| 13w1d | Gan/thận/lá lách tiếp tục phát triển. Có lớp lông tơ mỏng bảo vệ da — sẽ biến mất sau khi sinh. |\n| 13w2d | Tuyến nước bọt phát huy tác dụng. Nếu mẹ ấn nhẹ vào bụng, con sẽ cảm nhận được! |\n| 13w3d | Con đã có vài chiếc răng nhỏ trong lợi. Biết cau mày, mút ngón tay. |\n| 13w4d | Cơ quan tiêu hóa và tiết niệu bắt đầu hoạt động. Con đang tập thở trong tử cung. |\n| 13w5d | Nhau thai phát triển hoàn thiện. Mẹ và con kết nối qua dây rốn — mẹ phải ăn đầy đủ nhé! |\n| 13w6d | Cổ họng hình thành, ruột già tích phân. Con hoàn toàn nhận dinh dưỡng từ nhau thai. |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 13', 'tam cá nguyệt 1'],
  null, null, now()
),

(
  'thai-nhi-tuan-14',
  'Tuần 14 — Ý Thức Đầu Tiên',
  E'## 🤲 Tuần 14 — Ý Thức Đầu Tiên\n\n| Ngày | Nội dung |\n|------|----------|\n| 14w0d | Con gần bằng bàn tay mẹ. Lá lách tạo máu linh hoạt. Phổi xuất hiện sợi đàn hồi. |\n| 14w1d | Tay chân hoàn thiện. Con tự do chơi trong nước ối — vươn tay, đá chân (mẹ chưa cảm nhận được). |\n| 14w2d | Đại não đã sinh ra ý thức ban đầu. Đầu dựng thẳng. Lợi có hình dạng sơ khai. |\n| 14w3d | Cánh tay/cẳng chân vươn dài. Trán nhô về trước. Mẹ có thể cảm nhận nấc của con trong bụng! |\n| 14w4d | Con bơi trong nước ối như kiện tướng. Ngón tay/cổ tay rất linh hoạt. |\n| 14w5d | Hệ hô hấp hoàn thiện. Khí quản và lông mao khí quản hình thành. |\n| 14w6d | Ý thức đại não ngày càng rõ ràng. Con luyện tập cơ nhỏ để khỏe mạnh hơn. |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 14', 'tam cá nguyệt 2'],
  null, null, now()
),

(
  'thai-nhi-tuan-15',
  'Tuần 15',
  E'## 🏊 Tuần 15\n\n| Ngày | Nội dung |\n|------|----------|\n| 15w0d | Xương cơ rất phát triển. Con xoay mình, mút, tập thở, khua tay múa chân thường xuyên. |\n| 15w1d | Ngũ quan lập thể hơn, đẹp hơn. Tay chân linh hoạt đặc biệt. |\n| 15w2d | Con biết quay đầu, xoay tay và nửa thân trên. Thể hiện yêu/ghét bằng lắc người và đá chân. |\n| 15w3d | Con đang hít/thở nước ối để phát triển túi khí trong phổi — chuẩn bị cho hơi thở đầu tiên. |\n| 15w4d | Tập động tác uống nước ối. Mắt vẫn nhắm nhưng đã cảm nhận được ánh sáng. |\n| 15w5d | Con rất nhạy cảm với ánh sáng. Thích nơi sáng nhưng ngủ thích chỗ tối — đừng chiếu đèn pin quá lâu! |\n| 15w6d | Con bơi trong nước ối với các động tác lặp đi lặp lại. Vật cứng nhất trong cơ thể con là men răng. |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 15', 'tam cá nguyệt 2'],
  null, null, now()
),

(
  'thai-nhi-tuan-16',
  'Tuần 16 — Nghe Được Giọng Bố Mẹ',
  E'## 🎵 Tuần 16 — Nghe Được Giọng Bố Mẹ\n\n| Ngày | Nội dung |\n|------|----------|\n| 16w0d | Chức năng thính giác phát triển rất tốt. Con thích nhất giọng bố mẹ và nhạc nhẹ nhàng. |\n| 16w1d | Đầu tròn trịa hơn. Cơ thể linh hoạt hơn nhiều. Tự do quay đầu và cánh tay. |\n| 16w2d | Tay vận động nhiều: nắm lại, cử động ngón cái, vặn cổ tay, kéo dây rốn nghịch ngợm. |\n| 16w3d | Sụn biến thành xương. Cơ lưng cứng cáp hơn. |\n| 16w4d | Khi mẹ ấn nhẹ vào bụng, con lập tức đưa tay hoặc chân ra đáp lại! |\n| 16w5d | Nụ vị giác trên lưỡi hoàn toàn phát triển. Con phân biệt được vị nước ối — dù hơi mặn nhưng con rất thích! |\n| 16w6d | Con hiếu động, mẹ cảm nhận rõ cử động thai. Dùng ống nghe có thể nghe tiếng tim đập mạnh. |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 16', 'tam cá nguyệt 2'],
  null, null, now()
),

(
  'thai-nhi-tuan-17',
  'Tuần 17',
  E'## 🦶 Tuần 17\n\n| Ngày | Nội dung |\n|------|----------|\n| 17w0d | Con bận rộn duỗi tay và đá chân! Mẹ ngày càng cảm nhận rõ hơn. |\n| 17w1d | Thính giác dần hình thành. Tiếng nói và tiếng hát của mẹ khiến con cảm nhận tình yêu ấm áp. |\n| 17w2d | Tất cả cơ quan đã phát triển thành hình. Tỷ lệ cơ thể (đầu/thân/chân) cân đối hơn. |\n| 17w3d | Toàn thân mọc lông mịn, lông mày đầy đủ, móng tay mọc ra. Hầu hết lông tơ sẽ biến mất sau khi sinh. |\n| 17w4d | Dạ dày có tế bào tạo chất nhầy. Nếp nhăn não tăng lên. 1–2 giờ sau khi mẹ ăn, con bắt đầu hấp thu! |\n| 17w5d | Mạch máu dưới da nhìn thấy được. Da dày hơn để bảo vệ. Tai vào vị trí bình thường. |\n| 17w6d | Đầu hơi cao, đã có cổ với ranh giới rõ. Đầu và cổ phát triển thành đường thẳng. |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 17', 'tam cá nguyệt 2'],
  null, null, now()
),

(
  'thai-nhi-tuan-18',
  'Tuần 18 — Các Giác Quan Bùng Nổ',
  E'## 🍅 Tuần 18 — Các Giác Quan Bùng Nổ\n\n| Ngày | Nội dung |\n|------|----------|\n| 18w0d | Con trông như quả cà chua. Thường xuyên vươn tay đá chân. |\n| 18w1d | Khi mẹ vui, hormone thay đổi → não giữa tạo thông tin → truyền cho con qua máu. Mẹ phải vui vẻ nhé! |\n| 18w2d | Cấu trúc cơ thể gần hoàn thiện. Trung khu hô hấp hoạt động. Cơ quan tiêu hóa bắt đầu hoạt động. |\n| 18w3d | Đại não phân chia thành các khu khứu giác, vị giác, thính giác, xúc giác chuyên biệt. |\n| 18w4d | Da màu đỏ đậm. Tuyến bã nhờn bài tiết. Chất gây hình thành bao phủ bề mặt da. |\n| 18w5d | Con nấc thưa hơn nhưng kéo dài hơn — thường nấc nửa tiếng mới dừng. Mẹ đừng lo! |\n| 18w6d | Con nghe và phân biệt được giọng mẹ với người khác — giảm nhịp tim, thư giãn khi nghe giọng mẹ. |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 18', 'tam cá nguyệt 2'],
  null, null, now()
),

(
  'thai-nhi-tuan-19',
  'Tuần 19',
  E'## 🍎 Tuần 19\n\n| Ngày | Nội dung |\n|------|----------|\n| 19w0d | Con nặng gần bằng quả táo. Tay chân cân xứng. Thận sản sinh nước tiểu. Tóc mọc ra. |\n| 19w1d | Con nuốt thường xuyên hơn — hấp thu dinh dưỡng trong nước ối bên cạnh nhau thai. |\n| 19w2d | Con phân biệt được sáng/chiều/tối. Lúc con vận động nhiều là cơ hội tốt để mẹ thủ thỉ! |\n| 19w3d | Con nhận ra giọng mẹ ngày càng rõ. Bố cũng nên nói chuyện để con làm quen giọng bố! |\n| 19w4d | Con có lịch ngủ/thức như em bé sơ sinh. Tư thế ngủ rất độc đáo. |\n| 19w5d | Nước tiểu thải vào nước ối — nhưng nước ối được thay hoàn toàn mỗi 3–4 giờ. |\n| 19w6d | Con đang sản xuất phân su — dính, màu đen, sẽ là "thành quả" đầu tiên trên tã sau khi sinh! |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 19', 'tam cá nguyệt 2'],
  null, null, now()
),

(
  'thai-nhi-tuan-20',
  'Tuần 20 — Nửa Chặng Đường',
  E'## 🍊 Tuần 20 — Nửa Chặng Đường\n\n| Ngày | Nội dung |\n|------|----------|\n| 20w0d | Con nặng bằng quả cam. Rất hiếu động, cử động thai thường xuyên ngày lẫn đêm. |\n| 20w1d | Lông mày hình thành. Tóc nhỏ xíu mọc trên đầu. Nếu là bé gái, tử cung đã hình thành hoàn toàn! |\n| 20w2d | Tim ngày càng khỏe. Máu tuần hoàn qua dây rốn chỉ mất 30 giây một vòng. |\n| 20w3d | Thận tiếp quản sản xuất nước ối — hỗ trợ tiêu hóa, bài tiết và lọc chất thải. |\n| 20w4d | Nhịp tim mạnh mẽ. Nếu sinh đôi, nhịp tim hai bé có thể chênh nhau trên 10 lần/phút. |\n| 20w5d | Cơ phát triển nhanh. Dù ngủ con cũng có thể máy rất mạnh. Mẹ đừng giật mình! |\n| 20w6d | Nếu là bé trai, tinh hoàn bắt đầu di chuyển từ xương chậu xuống bìu. Nếu là bé gái, buồng trứng ở nguyên vị trí. |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 20', 'tam cá nguyệt 2'],
  null, null, now()
),

(
  'thai-nhi-tuan-21',
  'Tuần 21',
  E'## 🧅 Tuần 21\n\n| Ngày | Nội dung |\n|------|----------|\n| 21w0d | Con gần bằng củ hành tây. Lông mày và mí mắt đầy đủ. Ý thức đang phát triển. |\n| 21w1d | Da vẫn mỏng trong suốt — có thể thấy xương, cơ quan và mạch máu. |\n| 21w2d | Thời gian thức lâu hơn. Mẹ có thể kể chuyện, hát — con sẽ tích cực đáp lại! |\n| 21w3d | Cơ phát triển nhanh, diện mạo rõ nét, xương khỏe mạnh. Con thường xuyên thay đổi động tác. |\n| 21w4d | Môi rõ ràng hơn. Mầm răng trong lợi. Răng thật xuất hiện 4–7 tháng sau khi sinh. |\n| 21w5d | Thính giác phát triển hoàn toàn — con nhận biết và phản ứng với các loại âm thanh. |\n| 21w6d | Lông mày mọc ra, mũi cao hơn, cổ dài hơn. Khi ngủ: tay khoanh trước ngực, đầu gối gập vào bụng. |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 21', 'tam cá nguyệt 2'],
  null, null, now()
),

(
  'thai-nhi-tuan-22',
  'Tuần 22',
  E'## 🐟 Tuần 22\n\n| Ngày | Nội dung |\n|------|----------|\n| 22w0d | Con linh hoạt như cá chép nhỏ, tự do bơi trong nước ối. |\n| 22w1d | Xương tai giữa cứng lại, thính giác nhạy bén hơn. Tín hiệu âm thanh đến được đại não. |\n| 22w2d | Con có cảm xúc! Vui thì đá nhẹ, không vui thì đá mạnh. |\n| 22w3d | Không gian tử cung chật chội hơn. Mẹ cảm nhận rõ sự va đập — rất thú vị! |\n| 22w4d | Da vẫn đỏ nhăn — mạch máu lộ dưới da là nguyên nhân. Sẽ chuyển hồng khi chào đời. |\n| 22w5d | Hệ hô hấp vẫn non nớt — phổi cần thêm nhiều thời gian phát triển. |\n| 22w6d | Mắt hình thành nhưng mống mắt chưa có màu. Tuyến tụy sản xuất hormone đang phát triển ổn định. |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 22', 'tam cá nguyệt 2'],
  null, null, now()
),

(
  'thai-nhi-tuan-23',
  'Tuần 23 — Giống Em Bé Sơ Sinh',
  E'## 👶 Tuần 23 — Giống Em Bé Sơ Sinh\n\n| Ngày | Nội dung |\n|------|----------|\n| 23w0d | Con giống em bé sơ sinh phiên bản thu nhỏ. Xương cơ đang phát triển. |\n| 23w1d | Nụ vị giác phát huy tác dụng — con đã yêu thích vị của nước ối! |\n| 23w2d | Tay chân linh hoạt, có thể nắm lấy bàn chân nhỏ và gặm thích thú. |\n| 23w3d | Tế bào bạch cầu hình thành để chống bệnh. Hệ miễn dịch bắt đầu phát triển độc lập. |\n| 23w4d | Phổi là cơ quan hoàn thiện cuối cùng — đang phát triển mô và mạch máu. |\n| 23w5d | Áp tai vào bụng mẹ có thể nghe thấy tim thai! Dùng ống nghe càng rõ hơn. |\n| 23w6d | Mặt và cơ thể rất giống trẻ sơ sinh. Mắt đã hình thành. |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 23', 'tam cá nguyệt 2'],
  null, null, now()
),

(
  'thai-nhi-tuan-24',
  'Tuần 24',
  E'## 🍈 Tuần 24\n\n| Ngày | Nội dung |\n|------|----------|\n| 24w0d | Con lớn bằng quả thanh long. Trông hơi gầy nhưng rất khỏe mạnh. |\n| 24w1d | Màu và chất tóc bắt đầu thay đổi (sẽ tiếp tục sau khi sinh). Con đang dự trữ nhiều dinh dưỡng hơn. |\n| 24w2d | Lỗ mũi mở ra. Dây thần kinh gần miệng nhạy cảm hơn — chuẩn bị để con tìm núm vú mẹ sau khi sinh! |\n| 24w3d | Dây rốn to hơn, hấp thu dinh dưỡng tốt hơn. Vật chất dạng keo trên dây rốn giữ cho không bị thắt. |\n| 24w4d | Mầm răng ẩn trong lợi — phải chờ đến 6 tuổi khi răng sữa rụng mới thấy. |\n| 24w5d | Thính giác ngày càng tốt. Bây giờ là thời điểm tuyệt vời để mẹ giao tiếp với con! |\n| 24w6d | Hệ thần kinh hoàn thiện. Con biết cảm thấy đau, cảm thấy ngứa. Con thích được lắc — mẹ cùng chơi nhé! |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 24', 'tam cá nguyệt 2'],
  null, null, now()
),

(
  'thai-nhi-tuan-25',
  'Tuần 25',
  E'## 🥭 Tuần 25\n\n| Ngày | Nội dung |\n|------|----------|\n| 25w0d | Con gần bằng quả xoài. Thích ánh nắng và không khí trong lành. |\n| 25w1d | Con nghịch ngợm hơn, không ngừng tìm tư thế thoải mái. Thường xuyên thay đổi vị trí. |\n| 25w2d | Tai nhạy hơn. Ngày ngày nghe thấy tim đập mẹ, tiếng trò chuyện, tiếng thở, tiếng ruột/dạ dày. |\n| 25w3d | Con bắt đầu có ký ức nhỏ — đặc biệt quen thuộc với âm thanh lặp lại nhiều lần. |\n| 25w4d | Đại não giúp con thông minh hơn. Con không chỉ khua tay chân mà còn biết xoay người! |\n| 25w5d | Cột sống khỏe hơn. Con đã học được cách chắp tay và nắm tay. |\n| 25w6d | Con mũm mĩm hơn, mỡ tăng lên — da nhăn nheo trở nên mịn màng hơn! |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 25', 'tam cá nguyệt 2'],
  null, null, now()
),

(
  'thai-nhi-tuan-26',
  'Tuần 26',
  E'## 🍇 Tuần 26\n\n| Ngày | Nội dung |\n|------|----------|\n| 26w0d | Con nặng như quả bưởi chùm. Thích hoạt động trong bụng mẹ. |\n| 26w1d | Con thích âm thanh hơn. Mẹ nhớ kể chuyện, nói giọng dịu êm — sẽ khiến con vui! |\n| 26w2d | Con lớn hơn chèn vào cơ hoành — đó là lý do mẹ cảm thấy khó thở gần đây. |\n| 26w3d | Đại não phát triển. Sóng não của con đã rất giống sóng não em bé sinh đủ tháng. |\n| 26w4d | Mí mắt mở lại, ống tai ngoài mở, võng mạc hoàn thiện hơn. Con đã có thị giác ở mức độ nhẹ! |\n| 26w5d | Con đã biết chớp mắt! Giấc ngủ có giờ giấc — mẹ nắm nếp ngủ để thai giáo hiệu quả hơn. |\n| 26w6d | Con thích mút ngón cái — giúp cơ má và hàm dưới ngày càng phát triển. |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 26', 'tam cá nguyệt 2'],
  null, null, now()
),

(
  'thai-nhi-tuan-27',
  'Tuần 27',
  E'## 🐱 Tuần 27\n\n| Ngày | Nội dung |\n|------|----------|\n| 27w0d | Con cuộn tròn trong tử cung như mèo con. Tóc đã mọc ra rồi! |\n| 27w1d | Tính cách con ngày càng rõ. Thai ít vận động thì trầm tính, vận động nhiều thì nghịch ngợm. |\n| 27w2d | Con đã có khứu giác — nhưng vì trong nước ối nên vẫn chưa ngửi được mùi. |\n| 27w3d | Nếu là bé gái, môi nhỏ đã hình thành. |\n| 27w4d | Chất hoạt động bề mặt phế nang bắt đầu bài tiết — con có thể hô hấp được nhưng chưa thích nghi môi trường ngoài. |\n| 27w5d | Võng mạc hoàn toàn phát triển. Con có thể chớp mắt được rồi. |\n| 27w6d | Hệ thần kinh thính giác hoàn thiện. Con phản ứng rõ với âm thanh. Nhạc nhẹ nhàng khiến con cảm nhận sâu sắc. |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 27', 'tam cá nguyệt 2'],
  null, null, now()
),

(
  'thai-nhi-tuan-28',
  'Tuần 28 — Não Có Nếp Nhăn',
  E'## 🧠 Tuần 28 — Não Có Nếp Nhăn\n\n| Ngày | Nội dung |\n|------|----------|\n| 28w0d | Mỡ dưới da tích tụ — con mũm mĩm hơn. Thời gian hoạt động hàng ngày dài hơn. |\n| 28w1d | Con sắp lấp đầy tử cung. Bề mặt đại não xuất hiện khe rãnh — phản ứng nhạy bén hơn. |\n| 28w2d | Hệ hô hấp chưa hoàn thiện — cần thêm thời gian để hô hấp như mẹ. |\n| 28w3d | Đừng gây kích động mạnh cho con! Nhạc quá nhanh, âm thanh quá to sẽ ảnh hưởng đến sự phát triển. |\n| 28w4d | Con thích luyện phản xạ. Môi và miệng rất nhạy cảm — nếu tay xuất hiện gần miệng, con sẽ mút ngay! |\n| 28w5d | Da bắt đầu trơn láng, hồng hào. Lông tơ dần rụng. |\n| 28w6d | Mắt mở/nhắm được. Chu kỳ ngủ riêng đã hình thành. Con phân biệt được ánh sáng mặt trời và bóng tối. |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 28', 'tam cá nguyệt 3'],
  null, null, now()
),

(
  'thai-nhi-tuan-29',
  'Tuần 29',
  E'## 🌙 Tuần 29\n\n| Ngày | Nội dung |\n|------|----------|\n| 29w0d | Con ít lộn nhào hơn nhưng thỉnh thoảng đá liên tục — thậm chí làm mẹ không ngủ được! |\n| 29w1d | Cơ và phổi hoàn thiện hơn. Đầu lớn hơn để chứa hàng tỷ tế bào thần kinh. |\n| 29w2d | Con thay đổi tư thế liên tục. Cuối cùng đầu sẽ hướng xuống vì phần đầu nặng hơn. |\n| 29w3d | Móng tay nhìn thấy rõ hơn. Mẹ có thể cảm nhận co thắt tử cung không đều — bình thường! |\n| 29w4d | Cơ quan giác quan bắt đầu thử hoạt động. Khứu giác sẽ phát huy sau khi sinh. |\n| 29w5d | Tóc dày hơn. Khi sinh, đầu có thể đầy tóc hoặc chỉ vài sợi — do di truyền từ bố mẹ. |\n| 29w6d | Thị lực vẫn rất yếu, chỉ nhận biết vật vài cm. Sẽ phát triển nhanh sau khi sinh. |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 29', 'tam cá nguyệt 3'],
  null, null, now()
),

(
  'thai-nhi-tuan-30',
  'Tuần 30',
  E'## 💪 Tuần 30\n\n| Ngày | Nội dung |\n|------|----------|\n| 30w0d | Con cần dinh dưỡng dồi dào. Người con đã dài bằng cẳng tay mẹ! |\n| 30w1d | Tay chân, cơ thể và đầu phát triển hài hòa — tỷ lệ cân đối hơn. |\n| 30w2d | Không gian hẹp đi — con không thể duỗi tự do nữa. Mẹ đừng lo, con vẫn đang lớn! |\n| 30w3d | Khi thức, con tập mở/nhắm mắt. Có ánh sáng, con quay lại và dùng tay chạm vào. |\n| 30w4d | Vỏ não nhiều nếp nhăn hơn. Con sẽ là em bé thông minh! |\n| 30w5d | Các cơ quan chính hoàn thiện. Phổi và tiêu hóa gần xong. Móng chân bắt đầu mọc. |\n| 30w6d | Con đã nghe thấy giọng nói của mẹ — hãy nói chuyện và hát cho con nghe nhé! |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 30', 'tam cá nguyệt 3'],
  null, null, now()
),

(
  'thai-nhi-tuan-31',
  'Tuần 31',
  E'## 🌟 Tuần 31\n\n| Ngày | Nội dung |\n|------|----------|\n| 31w0d | Con nuốt nước ối rồi bài tiết qua bàng quang — đang luyện chức năng tiểu tiện. |\n| 31w1d | Cánh tay và đùi đầy đặn. Nếp nhăn da giảm bớt — con ngày càng xinh hơn! |\n| 31w2d | Con ngủ 90–95% thời gian. Khi thức dậy, chăm chỉ luyện tập mở mắt, uống nước ối. |\n| 31w3d | Con mở mắt nhìn thấy "ngôi nhà nhỏ". Cả 5 giác quan đều bắt đầu hoạt động. |\n| 31w4d | Nước ối còn ~850ml, con không di chuyển qua lại được nữa — chỉ lắc lư để đáp lại mẹ. |\n| 31w5d | Tinh hoàn bé trai hạ xuống bìu. Môi lớn bé gái bắt đầu lớn lên. |\n| 31w6d | Con thường xuyên quay đầu qua lại. Mẹ chú ý để tránh dây rốn quấn cổ! |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 31', 'tam cá nguyệt 3'],
  null, null, now()
),

(
  'thai-nhi-tuan-32',
  'Tuần 32',
  E'## 🥦 Tuần 32\n\n| Ngày | Nội dung |\n|------|----------|\n| 32w0d | Cử động thai ít đi — con thích máy nhiều vào buổi tối. Vẫn có quy luật, mẹ đếm kỹ nhé. |\n| 32w1d | Con nặng như cái súp lơ. Thân hình gần giống khi chào đời. Ngày gặp mẹ gần hơn! |\n| 32w2d | Hầu hết xương cứng lại. Hộp sọ vẫn mềm và chưa khép — để con đi qua ống sinh thuận lợi. |\n| 32w3d | Đầu con nên hướng xuống dưới — tư thế thuận lợi nhất để sinh thường. |\n| 32w4d | Thính giác hoàn thiện. Con phản ứng bằng cử động và nét mặt để thể hiện thích/ghét. |\n| 32w5d | Con thở theo nhịp giống mẹ. Phổi vẫn chưa hoàn thiện — tiếp tục nuốt và nhả nước ối để tập. |\n| 32w6d | Không gian chật hẹp nhưng con vẫn kiên trì vận động. Mẹ tiếp tục ghi lại cử động thai nhé. |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 32', 'tam cá nguyệt 3'],
  null, null, now()
),

(
  'thai-nhi-tuan-33',
  'Tuần 33',
  E'## 🌡️ Tuần 33\n\n| Ngày | Nội dung |\n|------|----------|\n| 33w0d | Hệ hô hấp và tiêu hóa gần hoàn thiện. Hệ thống điều chỉnh nhiệt độ cơ thể bắt đầu hoạt động. |\n| 33w1d | Da chuyển hồng, không còn nhăn nheo, mỡ tiếp tục tích tụ. |\n| 33w2d | Con bắt đầu làm quen với tiếng ồn bên ngoài và thế giới nước ối. Mẹ đưa con đến nơi dễ chịu nhiều hơn nhé. |\n| 33w3d | Xương đầu vẫn rất mềm — hai khe hở ở thóp trước và sau, sẽ đóng lại sau khi sinh. |\n| 33w4d | Một số thai nhi đã đầy tóc, số khác chỉ có lông tơ mỏng. Mẹ đoán con thuộc loại nào? |\n| 33w5d | Bác sĩ bắt đầu chú ý ngôi thai — ảnh hưởng trực tiếp đến cách mẹ sinh con. |\n| 33w6d | Phổi và dạ dày-ruột gần hoàn thiện. Nếu sinh lúc này, con đã có thể thích nghi cuộc sống ngoài tử cung. |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 33', 'tam cá nguyệt 3'],
  null, null, now()
),

(
  'thai-nhi-tuan-34',
  'Tuần 34',
  E'## 🌈 Tuần 34\n\n| Ngày | Nội dung |\n|------|----------|\n| 34w0d | Hệ miễn dịch phát triển nhanh — giúp con chống bệnh truyền nhiễm hiệu quả sau khi sinh. |\n| 34w1d | Không gian chật, con hoạt động chậm hơn — thậm chí chỉ nằm ngoan ngoãn ngược đầu. |\n| 34w2d | Hàm lượng mỡ ~12%. Tay chân tròn trịa. Con đáng yêu hơn bao giờ hết! |\n| 34w3d | Khuôn mặt phúng phính, da không còn nhăn — trông mũm mĩm như em bé thật sự! |\n| 34w4d | Khi con vươn vai/đá chân, mẹ có thấy bụng lồi lên không? |\n| 34w5d | Móng ngón tay nhỏ xíu đã nhìn thấy rõ — không vượt quá đầu ngón tay. |\n| 34w6d | Đường nét cơ thể con lằn trên da bụng mẹ — con đang muốn mẹ nhìn thấy mình! |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 34', 'tam cá nguyệt 3'],
  null, null, now()
),

(
  'thai-nhi-tuan-35',
  'Tuần 35',
  E'## ⭐ Tuần 35\n\n| Ngày | Nội dung |\n|------|----------|\n| 35w0d | Hệ thần kinh trung ương hoàn thiện. Con dễ thức dậy hơn — mẹ nhẹ nhàng ban đêm nhé! |\n| 35w1d | Con không trôi nổi trong nước ối được nữa nhưng niềm đam mê vận động không giảm! |\n| 35w2d | Hai quả thận cơ bản phát triển xong, gan chuyển hóa được chất cặn bã. |\n| 35w3d | Ánh sáng chiếu vào bụng → con vươn vai thức dậy. Đêm khuya → con cùng mẹ nghỉ ngơi. |\n| 35w4d | Thính giác phát triển đầy đủ. Âm thanh thanh và cao thu hút con hơn — mẹ kể chuyện nhé! |\n| 35w5d | Con mũm mĩm, mỡ dưới da sắp hình thành — giúp điều chỉnh nhiệt độ sau khi sinh. |\n| 35w6d | Thành tử cung và thành bụng mỏng dần — mẹ có thể thấy bàn tay, chân và khuỷu tay lồi trên bụng. |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 35', 'tam cá nguyệt 3'],
  null, null, now()
),

(
  'thai-nhi-tuan-36',
  'Tuần 36 — Gần Ngày Sinh',
  E'## 🍼 Tuần 36 — Gần Ngày Sinh\n\n| Ngày | Nội dung |\n|------|----------|\n| 36w0d | Thận phát triển hoàn toàn. Sau khi sinh, nước tiểu sẽ được sản sinh qua thận. |\n| 36w1d | Con chuyển sang tư thế đầu hướng xuống dưới — tư thế thuận lợi nhất để sinh thường. |\n| 36w2d | Móng tay dài quá đầu ngón tay. Tóc đã được 1–2cm! |\n| 36w3d | Con chiếm thể tích ngày càng nhiều. Cân nặng mẹ + con đạt mức cao nhất (~11,5–12,5kg). |\n| 36w4d | Thận hoàn toàn. Gan vẫn xử lý chất thải. Lá lách hoàn thiện và có thể tạo ra máu. |\n| 36w5d | Lông tơ và chất gây bắt đầu rụng. Da hồng hào, trơn bóng, vô cùng đáng yêu. |\n| 36w6d | Ruột tích tụ phân su — đây sẽ là lượng phân đầu tiên sau khi sinh. |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 36', 'tam cá nguyệt 3'],
  null, null, now()
),

(
  'thai-nhi-tuan-37',
  'Tuần 37 — Sẵn Sàng Chào Đời',
  E'## 🎉 Tuần 37 — Sẵn Sàng Chào Đời\n\n| Ngày | Nội dung |\n|------|----------|\n| 37w0d | Chiều cao ~49cm, cân nặng ~3kg. Tốc độ phát triển chậm dần. Con có thể gặp mẹ bất cứ lúc nào! |\n| 37w1d | Đầu di chuyển vào khoang xương chậu — được bảo vệ bởi khung xương chậu, rất an toàn. |\n| 37w2d | Phổi và cơ quan hô hấp hoàn thiện. Nếu sinh ra lúc này con có thể tự sống được! Mỡ tăng ~38g/ngày. |\n| 37w3d | Con đang tập thở. Vì chật hẹp, con đã im lặng hơn — chờ chào đời mới tiếp tục vui chơi. |\n| 37w4d | Tóc mỏng/thưa không đáng lo — sau khi sinh vẫn có thể dày và bóng mượt. |\n| 37w5d | Con phát triển chậm hơn, động tác mạnh ít hơn. Mẹ tiếp tục theo dõi nhịp tim và cử động thai. |\n| 37w6d | Ngôi thai gần như xác định. Nếu ngôi không thuận, bác sĩ sẽ tư vấn sinh mổ. |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 37', 'tam cá nguyệt 3'],
  null, null, now()
),

(
  'thai-nhi-tuan-38',
  'Tuần 38',
  E'## 🌺 Tuần 38\n\n| Ngày | Nội dung |\n|------|----------|\n| 38w0d | Con vẫn hấp thu dinh dưỡng từ mẹ và nước ối để tăng cường miễn dịch trước khi vào đường sinh. |\n| 38w1d | Tất cả cơ quan phát triển hoàn toàn. Tim, phổi, gan, hệ hô hấp, tiêu hóa đầy đủ. Con có thể sinh tồn độc lập! |\n| 38w2d | Phổi và não có thể phát huy chức năng. Con hô hấp độc lập và não có ý thức đơn giản. |\n| 38w3d | Lông tơ về cơ bản biến mất — một số còn sót ở vai, trán, cổ. |\n| 38w4d | Đặc trưng trẻ sơ sinh ngày càng rõ. Con đã có thể khóc to — nhưng lần đầu thường không có nước mắt. |\n| 38w5d | Chiều dài dây rốn: 30–100cm, đường kính 0,8–2,0cm. Con vẫn hấp thu dinh dưỡng qua dây rốn. |\n| 38w6d | Mỡ tăng, da không còn trong suốt. Da chuyển từ đỏ/hồng sang màu trắng. |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 38', 'tam cá nguyệt 3'],
  null, null, now()
),

(
  'thai-nhi-tuan-39',
  'Tuần 39',
  E'## 🕊️ Tuần 39\n\n| Ngày | Nội dung |\n|------|----------|\n| 39w0d | Con tiếp tục tăng mỡ và dự trữ năng lượng. Phổi là cơ quan cuối cùng hoàn thiện. |\n| 39w1d | Xương sọ vẫn chưa cố định — gồm 5 mảnh riêng biệt, sẽ ép vào nhau khi chào đời. |\n| 39w2d | Các cơ quan phát triển xong. Vài giờ sau khi sinh, phổi mới thiết lập hô hấp bình thường. |\n| 39w3d | Nước ối hơi đục, màu trắng sữa — do lông tơ và chất gây bong ra. |\n| 39w4d | Ngực con nhô lên vì gan to lên trong quá trình sản xuất hồng cầu. |\n| 39w5d | Hầu hết chức năng nhau thai bắt đầu thoái hóa — vôi hóa và cục máu. Khi con sinh ra, nhau thai "hết nhiệm vụ". |\n| 39w6d | Cơ quan hoàn thiện, nhạy bén. Tay chân chắc khỏe. Khoảnh khắc gặp mẹ sắp đến rồi! |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 39', 'tam cá nguyệt 3'],
  null, null, now()
),

(
  'thai-nhi-tuan-40',
  'Tuần 40 — Ngày Dự Sinh',
  E'## 🎊 Tuần 40 — Ngày Dự Sinh\n\n| Ngày | Nội dung |\n|------|----------|\n| 40w0d | Con bước vào ngày dự sinh! Xác suất sinh đúng ngày không cao — mẹ chuẩn bị tinh thần nhé. |\n| 40w1d | Chưa có dấu hiệu sinh? Bình thường — con muốn nằm thêm vài ngày nữa! Chậm 2 tuần là bình thường. |\n| 40w2d | Con tiếp tục hấp thu dinh dưỡng mỗi ngày — rất có ích cho điều hòa thân nhiệt sau khi sinh. |\n| 40w3d | Con nuốt lông tơ, chất gây, chất bài tiết — giữ trong ruột và thải ra 1–2 ngày sau khi sinh. |\n| 40w4d | Xương trên đầu vẫn chưa nối liền — giúp đầu chui qua ống sinh dễ dàng hơn. |\n| 40w5d | Đầy tóc hay ít tóc cũng bình thường — sau khi sinh con sẽ rất xinh đẹp! |\n| 40w6d | Lớp da ngoài đang bong ra, thay bằng lớp da mới bên dưới. Mẹ có mong chờ gặp con không? |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 40', 'tam cá nguyệt 3'],
  null, null, now()
),

(
  'thai-nhi-tuan-41',
  'Tuần 41',
  E'## ⏳ Tuần 41\n\n| Ngày | Nội dung |\n|------|----------|\n| 41w0d | Con đã chuẩn bị xong, có thể ra gặp mẹ bất cứ lúc nào! |\n| 41w1d | Da con có thể khô như giấy da, cơ thể hơi thừa cân. Mẹ có thể hỏi ý kiến bác sĩ. |\n| 41w2d | Lượng nước ối giảm xuống. Mẹ kiểm tra định kỳ — nước ối quá ít sẽ làm chậm ngày gặp nhau! |\n| 41w3d | Con "chuẩn bị kỹ lưỡng, sẵn sàng lên đường" — chỉ còn chờ thời cơ. |\n| 41w4d | Da khô nhăn hơn, móng tay dài ra — trông như "cụ già tí hon"! Mẹ ăn nhiều protein và năng lượng nhé. |\n| 41w5d | Con phát triển hoàn thiện, nhu cầu oxy tăng lên. Mẹ nhớ bổ sung oxy kịp thời. |\n| 41w6d | Con rất cứng cáp rồi — nhưng hơi lười ra! Nhờ các bác sĩ "giúp" con nhé! |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 41', 'tam cá nguyệt 3'],
  null, null, now()
),

(
  'thai-nhi-tuan-42',
  'Tuần 42',
  E'## 🌸 Tuần 42\n\n| Ngày | Nội dung |\n|------|----------|\n| 42w0d | Con lúc nào cũng muốn ra ngoài gặp mẹ. Mẹ càng mong chờ thì kết quả sẽ càng tốt đẹp! |',
  array['thai kỳ', 'phát triển thai nhi', 'tuần 42', 'tam cá nguyệt 3'],
  null, null, now()
);
