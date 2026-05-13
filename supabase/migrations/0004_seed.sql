-- =============================================================================
-- Migration 0004: Seed data
-- milestone_catalog (~30 WHO/CDC milestones in Vietnamese)
-- starter articles
-- FollowYourBaby — Supabase data architect
-- =============================================================================

-- ---------------------------------------------------------------------------
-- milestone_catalog — WHO/CDC developmental milestones (Vietnamese)
-- ---------------------------------------------------------------------------

insert into milestone_catalog (key, category, age_min_months, age_max_months, title_vi, description_vi) values

-- ============ MOTOR (Vận động) ============

('motor.neck_control',         'motor', 1, 4,
 'Kiểm soát cổ',
 'Bé có thể ngẩng đầu và giữ đầu thẳng khi được bế đứng. Đây là dấu hiệu đầu tiên của sức mạnh cổ.'),

('motor.tummy_time_head',      'motor', 1, 4,
 'Ngẩng đầu khi nằm sấp',
 'Khi nằm sấp, bé có thể ngẩng đầu lên khoảng 45 độ trong vài giây.'),

('motor.roll_tummy_to_back',   'motor', 2, 5,
 'Lật từ nằm sấp sang nằm ngửa',
 'Bé bắt đầu tự lật người từ tư thế nằm sấp sang nằm ngửa.'),

('motor.roll_back_to_tummy',   'motor', 4, 6,
 'Lật từ nằm ngửa sang nằm sấp',
 'Bé có thể tự lật từ nằm ngửa sang nằm sấp, đây là bước tiến quan trọng trong vận động.'),

('motor.sit_with_support',     'motor', 4, 6,
 'Ngồi có hỗ trợ',
 'Bé có thể ngồi khi được đỡ hoặc dựa vào gối, đầu và lưng thẳng.'),

('motor.sit_without_support',  'motor', 6, 9,
 'Ngồi không cần hỗ trợ',
 'Bé có thể ngồi thẳng mà không cần hỗ trợ trong ít nhất vài phút.'),

('motor.bear_weight_on_legs',  'motor', 5, 7,
 'Chịu sức nặng trên chân',
 'Khi được đỡ đứng, bé có thể chịu trọng lượng cơ thể trên hai chân.'),

('motor.crawl',                'motor', 7, 10,
 'Bò',
 'Bé bắt đầu di chuyển bằng cách bò trên tay và đầu gối, hoặc bằng cách trườn bụng.'),

('motor.pull_to_stand',        'motor', 8, 11,
 'Vịn đứng',
 'Bé tự kéo mình đứng dậy bằng cách vịn vào đồ vật như ghế sofa hoặc bàn.'),

('motor.cruise',               'motor', 9, 12,
 'Đi men',
 'Bé di chuyển bằng cách vịn tay vào đồ vật và bước từng bước nhỏ sang ngang.'),

('motor.first_steps',          'motor', 9, 15,
 'Những bước đi đầu tiên',
 'Bé tự bước đi mà không cần vịn tay, thường đi vài bước trước khi ngã.'),

('motor.walk_independently',   'motor', 11, 18,
 'Đi vững',
 'Bé đi lại tự tin, ít ngã hơn và có thể thay đổi hướng khi đi.'),

('motor.run',                  'motor', 18, 24,
 'Chạy',
 'Bé bắt đầu chạy, tuy nhiên vẫn chưa thể dừng hoặc quay người nhanh chóng.'),

('motor.climb_stairs',         'motor', 18, 30,
 'Leo cầu thang',
 'Bé có thể leo lên và xuống cầu thang khi bám vào lan can hoặc có người hỗ trợ.'),

('motor.kick_ball',            'motor', 18, 30,
 'Đá bóng',
 'Bé có thể đá một quả bóng lớn mà không bị mất thăng bằng.'),

-- ============ LANGUAGE (Ngôn ngữ) ============

('lang.coo',                   'language', 1, 3,
 'Phát âm ê a',
 'Bé bắt đầu phát ra các âm thanh như "ê", "a" khi vui vẻ, đây là giai đoạn tiền ngôn ngữ.'),

('lang.laugh',                 'language', 3, 5,
 'Cười thành tiếng',
 'Bé phát ra tiếng cười thành âm thanh, thường khi được vui đùa hoặc giao tiếp.'),

('lang.babble',                'language', 4, 7,
 'Bập bẹ',
 'Bé phát ra chuỗi âm tiết như "ba-ba", "ma-ma" mà chưa có nghĩa cụ thể.'),

('lang.mama_dada_specific',    'language', 9, 12,
 'Gọi "mama" và "baba" có chủ đích',
 'Bé dùng "mama" để gọi mẹ và "baba" để gọi bố, không phải chỉ nói chung chung.'),

('lang.first_word',            'language', 10, 14,
 'Từ đầu tiên',
 'Bé nói từ đầu tiên có nghĩa rõ ràng ngoài "mama" và "baba".'),

('lang.words_10',              'language', 14, 20,
 '10 từ trở lên',
 'Bé có vốn từ khoảng 10 từ đơn và sử dụng chúng trong các tình huống phù hợp.'),

('lang.two_word_phrases',      'language', 18, 24,
 'Câu hai từ',
 'Bé kết hợp hai từ thành cụm ngắn như "bế con", "uống sữa", "đi chơi".'),

('lang.words_50',              'language', 21, 30,
 '50 từ trở lên',
 'Bé có vốn từ phong phú trên 50 từ và bắt đầu hỏi tên đồ vật.'),

-- ============ COGNITIVE (Nhận thức) ============

('cog.track_object',           'cognitive', 1, 3,
 'Dõi theo đồ vật',
 'Bé có thể dõi theo đồ vật chuyển động bằng mắt, đặc biệt là mặt người.'),

('cog.recognize_face',         'cognitive', 2, 4,
 'Nhận ra khuôn mặt quen',
 'Bé nhận ra và phản ứng khác biệt khi nhìn thấy mặt mẹ hoặc người chăm sóc thường xuyên.'),

('cog.object_permanence',      'cognitive', 6, 10,
 'Khái niệm đồ vật tồn tại',
 'Bé hiểu rằng đồ vật vẫn tồn tại khi bị che khuất — bé sẽ tìm đồ vật bị giấu.'),

('cog.imitate_actions',        'cognitive', 9, 12,
 'Bắt chước hành động',
 'Bé bắt chước các hành động đơn giản như vỗ tay, vẫy tay chào, lắc đầu.'),

('cog.pretend_play',           'cognitive', 18, 24,
 'Chơi giả vờ',
 'Bé bắt đầu chơi giả vờ, ví dụ cho búp bê "ăn" hoặc nói chuyện qua điện thoại đồ chơi.'),

-- ============ SOCIAL (Xã hội) ============

('social.social_smile',        'social', 1, 3,
 'Nụ cười xã hội',
 'Bé mỉm cười đáp lại khi được cười hoặc nói chuyện, không phải chỉ do phản xạ.'),

('social.stranger_anxiety',    'social', 6, 12,
 'Sợ người lạ',
 'Bé bắt đầu nhận ra sự khác biệt giữa người quen và người lạ, có thể khóc khi gặp người lạ.'),

('social.wave_bye',            'social', 8, 12,
 'Vẫy tay tạm biệt',
 'Bé hiểu và thực hiện hành động vẫy tay khi ai đó chào tạm biệt.'),

('social.parallel_play',       'social', 18, 30,
 'Chơi song song',
 'Bé chơi cạnh trẻ khác nhưng chưa chơi cùng nhau, mỗi bé theo đuổi hoạt động riêng.');

-- ---------------------------------------------------------------------------
-- articles — starter articles in Vietnamese
-- ---------------------------------------------------------------------------

insert into articles (slug, title_vi, body_md_vi, tags, age_min_months, age_max_months, published_at) values

(
  'dinh-duong-cho-me-bau-3-thang-dau',
  'Dinh dưỡng cho mẹ bầu trong 3 tháng đầu thai kỳ',
  E'## Tại sao 3 tháng đầu rất quan trọng?\n\nBa tháng đầu thai kỳ (tam cá nguyệt đầu tiên) là giai đoạn hình thành các cơ quan quan trọng của thai nhi. Dinh dưỡng đúng cách trong giai đoạn này ảnh hưởng trực tiếp đến sức khỏe của cả mẹ và bé.\n\n## Các dưỡng chất thiết yếu\n\n### Axit folic (Vitamin B9)\n- **Liều khuyến nghị:** 400–600 mcg/ngày\n- **Tại sao cần:** Ngăn ngừa dị tật ống thần kinh (não và tủy sống)\n- **Nguồn thực phẩm:** Rau xanh đậm (rau muống, cải bó xôi), đậu, ngũ cốc tăng cường, cam\n\n### Sắt\n- **Liều khuyến nghị:** 27 mg/ngày\n- **Tại sao cần:** Hỗ trợ sản xuất hồng cầu, ngăn ngừa thiếu máu\n- **Nguồn thực phẩm:** Thịt đỏ, gan, đậu lăng, rau cải xanh\n- **Mẹo:** Ăn cùng thực phẩm giàu Vitamin C để hấp thu sắt tốt hơn\n\n### Canxi\n- **Liều khuyến nghị:** 1000 mg/ngày\n- **Tại sao cần:** Phát triển xương và răng của thai nhi\n- **Nguồn thực phẩm:** Sữa, phô mai, sữa chua, đậu phụ, cá nhỏ ăn nguyên xương\n\n### Iốt\n- **Liều khuyến nghị:** 220 mcg/ngày\n- **Tại sao cần:** Phát triển não bộ và tuyến giáp của thai nhi\n- **Nguồn thực phẩm:** Hải sản, muối iốt, sữa\n\n## Thực phẩm cần tránh\n\n- Cá có hàm lượng thủy ngân cao (cá mập, cá kiếm, cá ngừ mắt to)\n- Thịt và hải sản sống hoặc chưa chín\n- Pho mát mềm chưa tiệt trùng\n- Rượu bia và thuốc lá\n- Caffeine quá 200mg/ngày (khoảng 1 tách cà phê)\n\n## Mẹo ứng phó với ốm nghén\n\n- Ăn nhiều bữa nhỏ trong ngày thay vì 3 bữa lớn\n- Ăn bánh quy giòn hoặc bánh mì nướng vào buổi sáng trước khi ra khỏi giường\n- Tránh thức ăn có mùi mạnh\n- Uống đủ nước, có thể thêm gừng vào nước\n\n> **Lưu ý quan trọng:** Bài viết này chỉ mang tính tham khảo. Hãy tham khảo ý kiến bác sĩ sản khoa hoặc chuyên gia dinh dưỡng để có kế hoạch dinh dưỡng phù hợp với tình trạng sức khỏe của bạn.',
  array['mang thai', 'dinh dưỡng', 'tam cá nguyệt 1', 'sức khỏe mẹ'],
  null, null,
  now()
),

(
  'cho-con-bu-dung-cach',
  'Hướng dẫn cho con bú đúng cách cho mẹ lần đầu',
  E'## Lợi ích của sữa mẹ\n\nSữa mẹ là nguồn dinh dưỡng tốt nhất cho trẻ sơ sinh và trẻ nhỏ. WHO khuyến nghị cho bé bú mẹ hoàn toàn trong 6 tháng đầu và tiếp tục bú mẹ kết hợp ăn dặm đến ít nhất 2 tuổi.\n\n**Lợi ích với bé:**\n- Cung cấp kháng thể bảo vệ bé khỏi bệnh tật\n- Giảm nguy cơ viêm tai giữa, tiêu chảy, nhiễm trùng đường hô hấp\n- Hỗ trợ phát triển não bộ\n- Giảm nguy cơ béo phì và tiểu đường sau này\n\n**Lợi ích với mẹ:**\n- Giúp tử cung co lại nhanh hơn sau sinh\n- Giảm nguy cơ ung thư vú và ung thư buồng trứng\n- Hỗ trợ giảm cân sau sinh\n- Tiết kiệm chi phí\n\n## Tư thế cho bú\n\n### Tư thế bồng ngang (Cradle hold)\nĐây là tư thế phổ biến nhất. Giữ bé nằm ngang trước ngực, đầu tựa vào khuỷu tay, bụng bé áp vào bụng mẹ.\n\n### Tư thế bóng football (Football hold)\nPhù hợp cho mẹ sinh mổ hoặc có ngực lớn. Kẹp bé dưới cánh tay như cầm quả bóng football, đầu bé hướng ra phía trước.\n\n### Tư thế nằm nghiêng\nLý tưởng cho cữ bú ban đêm. Mẹ và bé đều nằm nghiêng, mặt đối mặt.\n\n## Dấu hiệu bé ngậm ti đúng cách\n\n- Miệng bé mở rộng, ngậm hầu hết quầng vú (không chỉ đầu ti)\n- Môi dưới bé bẹt ra ngoài\n- Mũi bé không bị chèn ép bởi ngực mẹ\n- Bé bú nhịp nhàng, nuốt nghe thấy tiếng\n- Mẹ không bị đau (có thể hơi khó chịu lúc đầu nhưng không đau nhói)\n\n## Bé bú đủ khi nào?\n\n- Bé có ít nhất 6 tã ướt mỗi ngày (sau ngày thứ 4)\n- Bé tăng cân đều đặn (sau khi phục hồi cân nặng sơ sinh trong 2 tuần đầu)\n- Bé tỉnh táo và vui vẻ sau khi bú\n- Ngực mẹ mềm hơn sau khi bú\n\n## Khi nào cần gặp chuyên gia?\n\n- Đau ti kéo dài hơn 1 tuần đầu\n- Bé không tăng cân hoặc sụt cân\n- Ngực mẹ sưng đỏ, nóng, đau (có thể là viêm tuyến vú)\n- Bé bú kém hơn 8 lần/ngày trong tháng đầu\n\n> **Lưu ý:** Nếu bạn gặp khó khăn khi cho bú, hãy liên hệ với tư vấn viên cho con bú (IBCLC) hoặc bác sĩ nhi khoa để được hỗ trợ.',
  array['sơ sinh', 'bú mẹ', 'dinh dưỡng', 'chăm sóc bé', '0-6 tháng'],
  0, 6,
  now()
),

(
  'giac-ngu-tre-so-sinh',
  'Giấc ngủ của trẻ sơ sinh: Những điều mẹ cần biết',
  E'## Trẻ sơ sinh ngủ bao nhiêu là đủ?\n\nTrẻ sơ sinh cần rất nhiều giấc ngủ để phát triển. Dưới đây là thời gian ngủ khuyến nghị theo độ tuổi:\n\n| Độ tuổi | Tổng giờ ngủ/ngày |\n|---------|-------------------|\n| 0–3 tháng | 14–17 giờ |\n| 4–11 tháng | 12–15 giờ |\n| 1–2 tuổi | 11–14 giờ |\n| 3–5 tuổi | 10–13 giờ |\n\n## Chu kỳ ngủ của trẻ\n\nKhác với người lớn, chu kỳ ngủ của trẻ sơ sinh chỉ khoảng **45–60 phút** (người lớn là 90 phút). Trẻ thường thức dậy giữa các chu kỳ và cần được giúp đỡ để ngủ lại.\n\n## Tạo thói quen ngủ tốt\n\n### Nhận biết dấu hiệu buồn ngủ\n- Dụi mắt hoặc tai\n- Ngáp\n- Nhìn xa xăm, mắt đỏ\n- Quấy khóc hoặc bứt rứt\n- Vận động ít lại\n\n### Routine trước khi ngủ\nMột routine nhất quán giúp bé hiểu rằng đã đến giờ ngủ:\n1. Tắm ấm (tùy chọn)\n2. Mặc đồ ngủ\n3. Cho bú hoặc ăn nhẹ\n4. Đọc sách / hát ru\n5. Tắt đèn, giảm tiếng ồn\n6. Đặt bé vào nôi/cũi\n\n### Phân biệt ngày và đêm\nTrẻ sơ sinh chưa có đồng hồ sinh học. Giúp bé phân biệt ngày/đêm bằng cách:\n- Ban ngày: ánh sáng tự nhiên, tiếng động bình thường, chơi đùa tích cực\n- Ban đêm: ánh sáng mờ, yên tĩnh, cữ bú nhanh và ít giao tiếp\n\n## An toàn khi ngủ (Hướng dẫn ABC)\n\n- **A (Alone):** Bé ngủ một mình trong cũi/nôi của bé\n- **B (Back):** Luôn đặt bé nằm ngửa khi ngủ\n- **C (Crib):** Ngủ trong cũi/nôi đạt chuẩn an toàn, không có chăn gối mềm\n\n> **Quan trọng:** Không để bé ngủ trên ghế sofa, ghế ô tô, hoặc trong giường của người lớn vì nguy cơ đột tử ở trẻ sơ sinh (SIDS).\n\n## Sleep Regression là gì?\n\nSleep regression là giai đoạn bé đang ngủ tốt đột nhiên khó ngủ hơn, thường xảy ra vào:\n- 4 tháng (thay đổi chu kỳ ngủ)\n- 8–10 tháng (lo lắng chia ly)\n- 12 tháng\n- 18 tháng\n- 2 tuổi\n\nĐây là hiện tượng bình thường liên quan đến các bước phát triển của não bộ. Hãy kiên nhẫn và nhất quán với routine ngủ của bé.\n\n> **Lưu ý:** Nếu bạn lo ngại về giấc ngủ của bé, hãy tham khảo ý kiến bác sĩ nhi khoa.',
  array['giấc ngủ', 'sơ sinh', 'phát triển', 'chăm sóc bé'],
  0, 24,
  now()
),

(
  'theo-doi-thai-may',
  'Theo dõi thai máy: Khi nào cần lo lắng?',
  E'## Thai máy là gì?\n\nThai máy (fetal movement) là những cử động của thai nhi mà mẹ có thể cảm nhận được. Đây là dấu hiệu quan trọng cho thấy thai nhi khỏe mạnh và phát triển bình thường.\n\n## Khi nào mẹ bắt đầu cảm nhận thai máy?\n\n- **Mẹ mang thai lần đầu:** thường từ tuần 18–25\n- **Mẹ đã có con:** thường sớm hơn, từ tuần 16–18\n- **Vị trí nhau thai:** nhau bám mặt trước có thể làm mẹ cảm nhận thai máy muộn hơn\n\n## Đếm thai máy\n\nTừ tuần 28, bác sĩ thường khuyến nghị mẹ đếm thai máy hàng ngày.\n\n### Phương pháp đếm thai máy Cardiff\n1. Chọn thời điểm bé thường hoạt động (sau ăn, buổi tối)\n2. Nằm nghiêng trái, đặt tay lên bụng\n3. Đếm cho đến khi cảm nhận được **10 cử động**\n4. Ghi lại thời gian cần để đạt 10 cử động\n\n**Bình thường:** 10 cử động trong vòng 2 giờ\n\n## Thai máy giảm — Khi nào cần gặp bác sĩ?\n\nHãy liên hệ bác sĩ **ngay lập tức** nếu:\n- Không cảm nhận được 10 cử động trong 2 giờ đếm\n- Thai máy giảm đột ngột so với ngày hôm trước\n- Không cảm nhận thai máy trong hơn 12 giờ\n- Thai nhi ngừng cử động sau khi đã hoạt động bình thường\n\n> **Đừng chờ đến sáng hôm sau** — nếu lo lắng, hãy gọi cho bác sĩ hoặc đến phòng cấp cứu sản khoa ngay.\n\n## Những điều ảnh hưởng đến thai máy\n\n### Thai máy ít hơn bình thường có thể do:\n- Thai nhi đang ngủ (chu kỳ ngủ 20–40 phút)\n- Mẹ đang bận và không chú ý\n- Mẹ vừa ăn no (một số bé ngủ sau khi mẹ ăn)\n\n### Thai máy nhiều hơn bình thường:\n- Thường là bình thường và tốt\n- Có thể bé đang phản ứng với âm thanh hoặc cử động của mẹ\n\n## Ghi nhật ký thai máy\n\nSử dụng ứng dụng FollowYourBaby để ghi lại thai máy hàng ngày. Dữ liệu này giúp bạn và bác sĩ nhận ra nhanh hơn khi có thay đổi bất thường.\n\n> **Lưu ý:** Thông tin trong bài viết này chỉ mang tính tham khảo và không thay thế tư vấn y tế trực tiếp. Luôn tham khảo bác sĩ sản khoa của bạn.',
  array['thai kỳ', 'thai máy', 'an toàn thai kỳ', 'tuần 28+'],
  null, null,
  now()
),

(
  'an-dam-cho-be-6-thang',
  'Hướng dẫn bắt đầu ăn dặm cho bé 6 tháng tuổi',
  E'## Bé đã sẵn sàng ăn dặm chưa?\n\nWHO khuyến nghị bắt đầu ăn dặm khi bé tròn 6 tháng tuổi (không trước 4 tháng). Dưới đây là các dấu hiệu bé đã sẵn sàng:\n\n- Bé có thể ngồi với ít hỗ trợ và giữ đầu thẳng\n- Bé thể hiện sự quan tâm đến thức ăn (nhìn theo thức ăn, với tay)\n- Phản xạ đẩy lưỡi đã giảm (bé không đẩy thức ăn ra khỏi miệng ngay)\n- Bé tăng gấp đôi cân nặng sơ sinh\n\n## Nguyên tắc ăn dặm an toàn\n\n### Quy tắc 3 ngày\nKhi giới thiệu thực phẩm mới, hãy cho bé ăn trong 3–5 ngày trước khi thêm món khác. Điều này giúp phát hiện dị ứng thực phẩm.\n\n### Bắt đầu với thực phẩm nghiền mịn\n- Cháo bột gạo loãng\n- Khoai lang nghiền\n- Bí đỏ nghiền\n- Táo hấp nghiền\n- Lê hấp nghiền\n- Chuối nghiền\n\n### Dần dần tăng độ thô\n- 6–8 tháng: nghiền mịn, dạng bột/nhuyễn\n- 8–10 tháng: nghiền thô, dạng cháo đặc\n- 10–12 tháng: cắt nhỏ mềm, bé tự bốc\n\n## Thực phẩm KHÔNG nên cho bé dưới 1 tuổi ăn\n\n- **Mật ong:** nguy cơ ngộ độc botulinum\n- **Muối:** thận bé chưa xử lý được\n- **Đường:** hình thành thói quen ăn ngọt\n- **Sữa bò tươi:** (có thể dùng trong nấu ăn, không dùng làm đồ uống chính)\n- **Hạt nguyên:** nguy cơ nghẹn\n- **Thức ăn cứng, tròn nhỏ:** nguy cơ nghẹn (nho, xúc xích cắt tròn)\n\n## Dị ứng thực phẩm phổ biến\n\n8 nhóm dị ứng phổ biến nhất:\n1. Sữa bò\n2. Trứng\n3. Đậu phộng\n4. Hạt tree nut\n5. Cá\n6. Hải sản có vỏ\n7. Lúa mì\n8. Đậu nành\n\nHãy giới thiệu từng loại riêng lẻ và theo dõi phản ứng của bé.\n\n## Dấu hiệu dị ứng cần chú ý\n\n- Phát ban, nổi mẩn\n- Sưng môi, lưỡi hoặc mặt\n- Nôn mửa hoặc tiêu chảy\n- Khó thở (gọi cấp cứu ngay)\n\n## Lưu lượng ăn dặm gợi ý\n\n- 6 tháng: 1–2 muỗng canh, 1–2 lần/ngày\n- 7–8 tháng: 3–5 muỗng canh, 2–3 lần/ngày\n- 9–12 tháng: 1/2–3/4 chén, 3 lần/ngày\n\nSữa mẹ hoặc sữa công thức vẫn là nguồn dinh dưỡng chính trong năm đầu đời.\n\n> **Lưu ý:** Mỗi bé phát triển theo tốc độ riêng. Tham khảo bác sĩ nhi khoa nếu bạn có thắc mắc về ăn dặm của bé.',
  array['ăn dặm', 'dinh dưỡng', '6 tháng', 'thức ăn bé'],
  6, 12,
  now()
);
