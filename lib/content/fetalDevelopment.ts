export interface FetalDayEntry {
  key: string;
  week: number;
  dayInWeek: number;
  content: string;
}

export interface FetalWeekData {
  week: number;
  emoji: string;
  title: string;
  days: FetalDayEntry[];
}

export const FETAL_DEVELOPMENT: Record<number, FetalWeekData> = {
  0: {
    week: 0, emoji: '🌱', title: 'Tuần 0 — Trước Thụ Thai',
    days: [
      { key: '0w0d', week: 0, dayInWeek: 0, content: 'Con chưa tồn tại — tinh trùng và trứng đang chờ gặp nhau trong cơ thể bố và mẹ.' },
      { key: '0w1d', week: 0, dayInWeek: 1, content: 'Trứng đã ở trong cơ thể mẹ từ khi mẹ sinh ra — tuổi trứng bằng tuổi mẹ.' },
      { key: '0w2d', week: 0, dayInWeek: 2, content: 'Các nang trứng bắt đầu phát triển. Trong cả cuộc đời mẹ có ~2 triệu nang, nhưng chỉ ~500 trứng rụng.' },
      { key: '0w3d', week: 0, dayInWeek: 3, content: 'Chu kỳ rụng trứng 28 ngày, mỗi tháng chỉ 1 trứng trưởng thành — rất quý giá!' },
      { key: '0w4d', week: 0, dayInWeek: 4, content: 'Trứng là tế bào lớn nhất cơ thể phụ nữ, đường kính ~0,1mm, sống lâu hơn các tế bào khác.' },
      { key: '0w5d', week: 0, dayInWeek: 5, content: 'Nang trứng chính phát triển khác nhau mỗi ngày, đến ngày 14 đạt kích thước lớn nhất rồi rụng.' },
    ],
  },
  1: {
    week: 1, emoji: '🥚', title: 'Tuần 1 — Rụng Trứng',
    days: [
      { key: '1w0d', week: 1, dayInWeek: 0, content: 'Trứng đang phát triển, sắp kết hợp với 1 trong hàng vạn tinh trùng.' },
      { key: '1w1d', week: 1, dayInWeek: 1, content: 'Bố có thể xuất ~200 triệu tinh trùng/lần, khoảng 1 triệu sẽ tranh giành 1 trứng.' },
      { key: '1w2d', week: 1, dayInWeek: 2, content: 'Trứng chín → rụng ra ngoài → vào vòi trứng chờ tinh trùng.' },
      { key: '1w3d', week: 1, dayInWeek: 3, content: 'Progesterone làm cổ tử cung giãn nở, tạo điều kiện cho tinh trùng đi vào.' },
      { key: '1w4d', week: 1, dayInWeek: 4, content: '100–300 triệu tinh trùng bơi ngược dòng trong cơ thể mẹ.' },
      { key: '1w5d', week: 1, dayInWeek: 5, content: 'Trứng chỉ sống được 12–36 giờ. Nếu không thụ tinh kịp phải chờ tháng sau.' },
      { key: '1w6d', week: 1, dayInWeek: 6, content: 'Lông mao quét trứng vào vòi trứng — đây sẽ là "nhà" của con 10 tháng tới!' },
    ],
  },
  2: {
    week: 2, emoji: '💫', title: 'Tuần 2 — Thụ Tinh',
    days: [
      { key: '2w0d', week: 2, dayInWeek: 0, content: 'Tinh trùng di chuyển qua ống cổ tử cung, vào vòi trứng chờ gặp trứng.' },
      { key: '2w1d', week: 2, dayInWeek: 1, content: 'Cuộc đua khốc liệt: tinh trùng xâm nhập, trứng chọn 1 bạn đồng hành.' },
      { key: '2w2d', week: 2, dayInWeek: 2, content: 'Tinh trùng đi từ âm đạo đến vòi trứng trong 1–1,5 giờ (nhanh nhất vài phút).' },
      { key: '2w3d', week: 2, dayInWeek: 3, content: 'Chỉ tinh trùng nhanh nhất, mạnh nhất mới gặp được trứng — quyết định trí thông minh của con.' },
      { key: '2w4d', week: 2, dayInWeek: 4, content: 'Tinh trùng phải phá vỡ vòng tế bào cumulus bao quanh trứng mới tiếp cận được.' },
      { key: '2w5d', week: 2, dayInWeek: 5, content: 'Đầu tinh trùng vào trứng trước, trứng kéo vào, đuôi ở ngoài. Bề mặt trứng tạo màng ngăn tinh trùng khác.' },
      { key: '2w6d', week: 2, dayInWeek: 6, content: 'Tinh trùng + trứng = trứng được thụ tinh! Vòi trứng cung cấp dinh dưỡng và vận chuyển vào tử cung.' },
    ],
  },
  3: {
    week: 3, emoji: '🔬', title: 'Tuần 3 — Làm Tổ',
    days: [
      { key: '3w0d', week: 3, dayInWeek: 0, content: 'Trứng thụ tinh phân chia 3–4 lần: từ 2 → 16 tế bào, hình thành khối cầu nhỏ chắc chắn.' },
      { key: '3w1d', week: 3, dayInWeek: 1, content: 'Phôi nang bám vào tử cung — mẹ có thể ra một ít máu nhạt, đó là dấu hiệu con đã vào bụng mẹ!' },
      { key: '3w2d', week: 3, dayInWeek: 2, content: 'Phôi nang cấy vào tử cung, bắt đầu tạo môi trường độc lập để phát triển.' },
      { key: '3w3d', week: 3, dayInWeek: 3, content: 'Túi ối xuất hiện: màng trong (chứa con + nước ối) và màng ngoài (màng đệm, một phần nhau thai).' },
      { key: '3w4d', week: 3, dayInWeek: 4, content: 'Nhau thai đang hình thành — vẫn cần máu mẹ vận chuyển dinh dưỡng đến.' },
      { key: '3w5d', week: 3, dayInWeek: 5, content: 'Con là khối bầu dục nhỏ, có lớp lông tơ truyền dinh dưỡng/oxy và thải chất thải.' },
      { key: '3w6d', week: 3, dayInWeek: 6, content: 'Mô nhau thai tiết hormone và protein. Hệ tuần hoàn máu của con bước đầu hình thành.' },
    ],
  },
  4: {
    week: 4, emoji: '🌿', title: 'Tuần 4 — Phôi Thai',
    days: [
      { key: '4w0d', week: 4, dayInWeek: 0, content: 'Tế bào nhau thai vận chuyển máu. Nước ối bảo vệ con. Túi noãn hoàng tạo hồng cầu.' },
      { key: '4w1d', week: 4, dayInWeek: 1, content: 'Con bước vào thời kỳ phôi thai: nội bì, trung bì, ngoại bì — ba lớp sẽ thành các cơ quan khác nhau.' },
      { key: '4w2d', week: 4, dayInWeek: 2, content: 'Con có đuôi dài như cá ngựa nhỏ. Hệ thần kinh (não, tủy sống) và thận bắt đầu phát triển.' },
      { key: '4w3d', week: 4, dayInWeek: 3, content: 'Con kết nối với mẹ qua dây rốn (1 tĩnh mạch + 2 động mạch). Đã phân biệt được đầu và đuôi.' },
      { key: '4w4d', week: 4, dayInWeek: 4, content: 'Hệ thần kinh trung ương phát triển. Tế bào "dây sống" hình thành — sau này là tủy sống.' },
      { key: '4w5d', week: 4, dayInWeek: 5, content: 'Cơ thể dần duỗi ra. Thận phát triển nhưng chưa hoạt động — vẫn nhờ nhau thai trao đổi chất.' },
      { key: '4w6d', week: 4, dayInWeek: 6, content: 'Nhau thai thực sự bắt đầu hình thành. Tế bào não tạo ra nhanh chóng. Con sắp có ý thức!' },
    ],
  },
  5: {
    week: 5, emoji: '💓', title: 'Tuần 5 — Tim Bắt Đầu Đập',
    days: [
      { key: '5w0d', week: 5, dayInWeek: 0, content: 'Đầu con rất to, 4 ngăn tim đang phát triển. Lồng ngực và khoang bụng bắt đầu hình thành.' },
      { key: '5w1d', week: 5, dayInWeek: 1, content: 'Con lớn bằng hạt hướng dương. Mạch máu hình thành, máu tuần hoàn. Hai chấm đen nhỏ = mắt của con!' },
      { key: '5w2d', week: 5, dayInWeek: 2, content: 'Nhau thai vất vả truyền dinh dưỡng. Cánh tay và đùi bắt đầu phát triển.' },
      { key: '5w3d', week: 5, dayInWeek: 3, content: '🎉 Động mạch chủ hình thành, tim bắt đầu vận chuyển máu và dinh dưỡng đến các cơ quan!' },
      { key: '5w4d', week: 5, dayInWeek: 4, content: 'Lồng ngực và khoang bụng tách nhau. Phổi, ruột, tuyến tụy, dạ dày bắt đầu phát triển.' },
      { key: '5w5d', week: 5, dayInWeek: 5, content: 'Gan cơ bản hình thành, tuyến giáp phát triển. Hai cánh tay trông như vây cá — rất dễ thương!' },
      { key: '5w6d', week: 5, dayInWeek: 6, content: 'Tim bắt đầu đập — vận chuyển máu tươi và dinh dưỡng đến các cơ quan.' },
    ],
  },
  6: {
    week: 6, emoji: '👁️', title: 'Tuần 6 — Hình Dáng Người',
    days: [
      { key: '6w0d', week: 6, dayInWeek: 0, content: 'Con lớn gấp 1000 lần ban đầu, trông như quả nho khô. Con thích cuộn chữ C trong nước ối.' },
      { key: '6w1d', week: 6, dayInWeek: 1, content: 'Các lớp da hình thành. Đường nét miệng, mí mắt, lỗ mũi mờ dần hiện ra.' },
      { key: '6w2d', week: 6, dayInWeek: 2, content: 'Não tiến hóa thành 3 phần: não trước, não giữa, não sau. Môi bắt đầu xuất hiện.' },
      { key: '6w3d', week: 6, dayInWeek: 3, content: 'Tim hình thành các ngăn. Loa tai, mí mắt, núm vú và môi trên thành hình.' },
      { key: '6w4d', week: 6, dayInWeek: 4, content: 'Da phát triển, phân biệt được mặt/miệng/mắt/tai. Ngón tay, ngón chân bắt đầu xuất hiện. Con sắp có xúc giác!' },
      { key: '6w5d', week: 6, dayInWeek: 5, content: 'Cơ và sụn phát triển. Ruột, gan, tuyến tụy đã có hình dạng.' },
      { key: '6w6d', week: 6, dayInWeek: 6, content: 'Hàm trên/dưới xuất hiện. Mô tuyến vú phát triển. Con bắt đầu chuyển động trong tử cung — có thể thấy qua siêu âm!' },
    ],
  },
  7: {
    week: 7, emoji: '🫐', title: 'Tuần 7 — Bằng Quả Việt Quất',
    days: [
      { key: '7w0d', week: 7, dayInWeek: 0, content: 'Con lớn bằng quả việt quất. Đuôi sắp biến mất. Ngón tay/chân như màng chân vịt nhỏ.' },
      { key: '7w1d', week: 7, dayInWeek: 1, content: 'Khung xương và hệ thống thính giác bước đầu hình thành — nhưng chưa nghe được giọng mẹ.' },
      { key: '7w2d', week: 7, dayInWeek: 2, content: 'Tế bào não phát triển nhanh, nhạy cảm với thông tin từ cơ thể mẹ. Đầu vẫn chiếm nửa cơ thể.' },
      { key: '7w3d', week: 7, dayInWeek: 3, content: 'Vòm miệng phát triển, răng/hàm/cơ mặt bắt đầu hình thành. Xương cứng dần.' },
      { key: '7w4d', week: 7, dayInWeek: 4, content: 'Con bắt đầu thành hình người. Tim/não/gan/phổi/thận phát triển nhanh. Nhịp tim bình thường hơn.' },
      { key: '7w5d', week: 7, dayInWeek: 5, content: 'Con bắt đầu "đi tiểu". Cơ quan sinh sản ngoài bắt đầu phát triển. Dây rốn hình thành!' },
      { key: '7w6d', week: 7, dayInWeek: 6, content: 'Tay chân lớn nhanh. Bắt đầu mọc mầm răng sữa. Nụ vị giác phát triển!' },
    ],
  },
  8: {
    week: 8, emoji: '🫧', title: 'Tuần 8 — Bằng Quả Mâm Xôi',
    days: [
      { key: '8w0d', week: 8, dayInWeek: 0, content: 'Con lớn bằng quả mâm xôi. Ngũ quan đầy đủ, đầu to tròn, tim và khoang bụng cơ bản hình thành.' },
      { key: '8w1d', week: 8, dayInWeek: 1, content: 'Xúc giác phát triển sớm, thính giác nhạy cảm. Con cần thêm thời gian để học chớp mắt.' },
      { key: '8w2d', week: 8, dayInWeek: 2, content: 'Lỗ mũi và chóp mũi mọc ra. Ngón chân vẫn dính nhau. Con sắp nghe được giọng mẹ!' },
      { key: '8w3d', week: 8, dayInWeek: 3, content: 'Bề mặt não trơn phẳng, ít nếp nhăn. Hệ nội tiết phát triển. Có thể nghe tim thai qua siêu âm!' },
      { key: '8w4d', week: 8, dayInWeek: 4, content: 'Mũi và miệng phát triển, vòm miệng đầu hình thành. Con thử uốn cong khuỷu tay và cổ tay.' },
      { key: '8w5d', week: 8, dayInWeek: 5, content: '"Đuôi nhỏ" biến mất. Tay chân dài hơn. Xương, cơ, khớp mọc ra.' },
      { key: '8w6d', week: 8, dayInWeek: 6, content: 'Da mỏng và trong suốt, có khả năng xúc giác cơ bản. Hệ thần kinh trung ương phát triển nhanh.' },
    ],
  },
  9: {
    week: 9, emoji: '🧠', title: 'Tuần 9 — Có Phản Xạ Thần Kinh',
    days: [
      { key: '9w0d', week: 9, dayInWeek: 0, content: '"Đuôi nhỏ" biến mất. Ngón tay/chân phân biệt rõ. Con đã có phản xạ thần kinh, thích vận động.' },
      { key: '9w1d', week: 9, dayInWeek: 1, content: 'Con là búp bê đầu to nhưng đang cố gắng cao lên. Các cơ quan đã có hình dạng sơ khai.' },
      { key: '9w2d', week: 9, dayInWeek: 2, content: 'Tim đập mạnh. Xúc giác phát triển nhanh để sớm tương tác với mẹ.' },
      { key: '9w3d', week: 9, dayInWeek: 3, content: 'Khuỷu tay và đầu gối thử uốn cong. Con luyện tập vươn người và ngáp.' },
      { key: '9w4d', week: 9, dayInWeek: 4, content: 'Hệ thần kinh phản ứng với kích thích bên ngoài. Răng sữa bắt đầu mọc (dưới lợi).' },
      { key: '9w5d', week: 9, dayInWeek: 5, content: 'Ngũ quan trên khuôn mặt thành hình. Con giống bố hay mẹ hơn?' },
      { key: '9w6d', week: 9, dayInWeek: 6, content: 'Khuôn mặt lập thể hơn. Mắt di chuyển vào giữa. Cẳng tay/khuỷu/ngón tay phân biệt được.' },
    ],
  },
  10: {
    week: 10, emoji: '🦴', title: 'Tuần 10',
    days: [
      { key: '10w0d', week: 10, dayInWeek: 0, content: 'Xương hộp sọ phát triển và cứng lại. Nhiều cơ quan bắt đầu hoạt động.' },
      { key: '10w1d', week: 10, dayInWeek: 1, content: 'Da dày dần. Con thích vươn vai, tập thể dục trong "căn nhà nhỏ".' },
      { key: '10w2d', week: 10, dayInWeek: 2, content: 'Tim đập mạnh mẽ. Hệ tiêu hóa phát triển nhanh. Con có thể hấp thu glucose!' },
      { key: '10w3d', week: 10, dayInWeek: 3, content: 'Cổ cứng cáp hơn, sắp nâng đỡ được đầu. Ngũ quan rõ nét hơn.' },
      { key: '10w4d', week: 10, dayInWeek: 4, content: 'Dây rốn bắt đầu quấn theo sự di chuyển của con — nhưng con biết cách tháo ra.' },
      { key: '10w5d', week: 10, dayInWeek: 5, content: 'Đại não phát triển còn nhanh hơn cả xương và cơ.' },
      { key: '10w6d', week: 10, dayInWeek: 6, content: 'Mọc lông mày và lông khắp người. Lỗ mũi hình thành. Con đang thở qua dây rốn — không bị sặc nước ối.' },
    ],
  },
  11: {
    week: 11, emoji: '👂', title: 'Tuần 11',
    days: [
      { key: '11w0d', week: 11, dayInWeek: 0, content: 'Mắt và tai rất rõ nét. Con biết lộn nhào, vươn vai.' },
      { key: '11w1d', week: 11, dayInWeek: 1, content: 'Khuôn mặt phát triển — con và mẹ bắt đầu có điểm giống nhau. Mắt di chuyển về giữa, tai vào vị trí.' },
      { key: '11w2d', week: 11, dayInWeek: 2, content: 'Khả năng tiêu hóa sẵn sàng để mút và bú sữa ngay sau khi sinh. Mí mắt vẫn nhắm.' },
      { key: '11w3d', week: 11, dayInWeek: 3, content: 'Tủy xương tạo máu. Nhiều tế bào bạch cầu được phân chia để bảo vệ cơ thể.' },
      { key: '11w4d', week: 11, dayInWeek: 4, content: 'Con bắt đầu đi tiểu vào nước ối — nhưng nước tiểu rất sạch. Phản xạ có điều kiện tốt hơn.' },
      { key: '11w5d', week: 11, dayInWeek: 5, content: 'Nhịp tim rõ ràng — mẹ có nghe thấy khi khám thai không? Nhau thai hình thành, dây rốn truyền dinh dưỡng.' },
      { key: '11w6d', week: 11, dayInWeek: 6, content: 'Móng tay, tóc, lợi răng sữa tăng nhanh. Mẹ có thấy con qua siêu âm chưa?' },
    ],
  },
  12: {
    week: 12, emoji: '✋', title: 'Tuần 12',
    days: [
      { key: '12w0d', week: 12, dayInWeek: 0, content: 'Con luôn cuộn tròn cho an toàn. Biết mở miệng, ngáp, nuốt.' },
      { key: '12w1d', week: 12, dayInWeek: 1, content: 'Tất cả khớp hình thành. Cổ nâng được đầu. Bàn tay nắm chặt được, ngón chân uốn cong.' },
      { key: '12w2d', week: 12, dayInWeek: 2, content: 'Tạo máu linh hoạt, ngũ quan rõ nét. Dấu vân tay bắt đầu phát triển. Dây thanh âm hình thành.' },
      { key: '12w3d', week: 12, dayInWeek: 3, content: 'Ngón chân tách ra. Mắt cá chân hoàn thiện. Tai dựng lên. Mặt mũi ngày càng xinh.' },
      { key: '12w4d', week: 12, dayInWeek: 4, content: 'Đại não tiếp tục phát triển. Nhãn cầu bắt đầu nhạy cảm với ánh sáng.' },
      { key: '12w5d', week: 12, dayInWeek: 5, content: 'Mặt mọc lông mịn. 20 chiếc răng sữa hình thành trong lợi. Gan tiết mật, tuyến tụy sản sinh insulin.' },
      { key: '12w6d', week: 12, dayInWeek: 6, content: 'Da hồng hào, trơn bóng. Dấu vân tay gần hoàn chỉnh — chứng minh thư độc nhất vô nhị của con!' },
    ],
  },
  13: {
    week: 13, emoji: '🌸', title: 'Tuần 13',
    days: [
      { key: '13w0d', week: 13, dayInWeek: 0, content: 'Tỷ lệ thân hình cân đối hơn. Môi khép mở. Cổ đỡ được đầu. Con thường xuyên lật người.' },
      { key: '13w1d', week: 13, dayInWeek: 1, content: 'Gan/thận/lá lách tiếp tục phát triển. Có lớp lông tơ mỏng bảo vệ da — sẽ biến mất sau khi sinh.' },
      { key: '13w2d', week: 13, dayInWeek: 2, content: 'Tuyến nước bọt phát huy tác dụng. Nếu mẹ ấn nhẹ vào bụng, con sẽ cảm nhận được!' },
      { key: '13w3d', week: 13, dayInWeek: 3, content: 'Con đã có vài chiếc răng nhỏ trong lợi. Biết cau mày, mút ngón tay.' },
      { key: '13w4d', week: 13, dayInWeek: 4, content: 'Cơ quan tiêu hóa và tiết niệu bắt đầu hoạt động. Con đang tập thở trong tử cung.' },
      { key: '13w5d', week: 13, dayInWeek: 5, content: 'Nhau thai phát triển hoàn thiện. Mẹ và con kết nối qua dây rốn — mẹ phải ăn đầy đủ nhé!' },
      { key: '13w6d', week: 13, dayInWeek: 6, content: 'Cổ họng hình thành, ruột già tích phân. Con hoàn toàn nhận dinh dưỡng từ nhau thai.' },
    ],
  },
  14: {
    week: 14, emoji: '🤲', title: 'Tuần 14 — Ý Thức Đầu Tiên',
    days: [
      { key: '14w0d', week: 14, dayInWeek: 0, content: 'Con gần bằng bàn tay mẹ. Lá lách tạo máu linh hoạt. Phổi xuất hiện sợi đàn hồi.' },
      { key: '14w1d', week: 14, dayInWeek: 1, content: 'Tay chân hoàn thiện. Con tự do chơi trong nước ối — vươn tay, đá chân (mẹ chưa cảm nhận được).' },
      { key: '14w2d', week: 14, dayInWeek: 2, content: 'Đại não đã sinh ra ý thức ban đầu. Đầu dựng thẳng. Lợi có hình dạng sơ khai.' },
      { key: '14w3d', week: 14, dayInWeek: 3, content: 'Cánh tay/cẳng chân vươn dài. Trán nhô về trước. Mẹ có thể cảm nhận nấc của con trong bụng!' },
      { key: '14w4d', week: 14, dayInWeek: 4, content: 'Con bơi trong nước ối như kiện tướng. Ngón tay/cổ tay rất linh hoạt.' },
      { key: '14w5d', week: 14, dayInWeek: 5, content: 'Hệ hô hấp hoàn thiện. Khí quản và lông mao khí quản hình thành.' },
      { key: '14w6d', week: 14, dayInWeek: 6, content: 'Ý thức đại não ngày càng rõ ràng. Con luyện tập cơ nhỏ để khỏe mạnh hơn.' },
    ],
  },
  15: {
    week: 15, emoji: '🏊', title: 'Tuần 15',
    days: [
      { key: '15w0d', week: 15, dayInWeek: 0, content: 'Xương cơ rất phát triển. Con xoay mình, mút, tập thở, khua tay múa chân thường xuyên.' },
      { key: '15w1d', week: 15, dayInWeek: 1, content: 'Ngũ quan lập thể hơn, đẹp hơn. Tay chân linh hoạt đặc biệt.' },
      { key: '15w2d', week: 15, dayInWeek: 2, content: 'Con biết quay đầu, xoay tay và nửa thân trên. Thể hiện yêu/ghét bằng lắc người và đá chân.' },
      { key: '15w3d', week: 15, dayInWeek: 3, content: 'Con đang hít/thở nước ối để phát triển túi khí trong phổi — chuẩn bị cho hơi thở đầu tiên.' },
      { key: '15w4d', week: 15, dayInWeek: 4, content: 'Tập động tác uống nước ối. Mắt vẫn nhắm nhưng đã cảm nhận được ánh sáng.' },
      { key: '15w5d', week: 15, dayInWeek: 5, content: 'Con rất nhạy cảm với ánh sáng. Thích nơi sáng nhưng ngủ thích chỗ tối — đừng chiếu đèn pin quá lâu!' },
      { key: '15w6d', week: 15, dayInWeek: 6, content: 'Con bơi trong nước ối với các động tác lặp đi lặp lại. Vật cứng nhất trong cơ thể con là men răng.' },
    ],
  },
  16: {
    week: 16, emoji: '🎵', title: 'Tuần 16 — Nghe Được Giọng Bố Mẹ',
    days: [
      { key: '16w0d', week: 16, dayInWeek: 0, content: 'Chức năng thính giác phát triển rất tốt. Con thích nhất giọng bố mẹ và nhạc nhẹ nhàng.' },
      { key: '16w1d', week: 16, dayInWeek: 1, content: 'Đầu tròn trịa hơn. Cơ thể linh hoạt hơn nhiều. Tự do quay đầu và cánh tay.' },
      { key: '16w2d', week: 16, dayInWeek: 2, content: 'Tay vận động nhiều: nắm lại, cử động ngón cái, vặn cổ tay, kéo dây rốn nghịch ngợm.' },
      { key: '16w3d', week: 16, dayInWeek: 3, content: 'Sụn biến thành xương. Cơ lưng cứng cáp hơn.' },
      { key: '16w4d', week: 16, dayInWeek: 4, content: 'Khi mẹ ấn nhẹ vào bụng, con lập tức đưa tay hoặc chân ra đáp lại!' },
      { key: '16w5d', week: 16, dayInWeek: 5, content: 'Nụ vị giác trên lưỡi hoàn toàn phát triển. Con phân biệt được vị nước ối — dù hơi mặn nhưng con rất thích!' },
      { key: '16w6d', week: 16, dayInWeek: 6, content: 'Con hiếu động, mẹ cảm nhận rõ cử động thai. Dùng ống nghe có thể nghe tiếng tim đập mạnh.' },
    ],
  },
  17: {
    week: 17, emoji: '🦶', title: 'Tuần 17',
    days: [
      { key: '17w0d', week: 17, dayInWeek: 0, content: 'Con bận rộn duỗi tay và đá chân! Mẹ ngày càng cảm nhận rõ hơn.' },
      { key: '17w1d', week: 17, dayInWeek: 1, content: 'Thính giác dần hình thành. Tiếng nói và tiếng hát của mẹ khiến con cảm nhận tình yêu ấm áp.' },
      { key: '17w2d', week: 17, dayInWeek: 2, content: 'Tất cả cơ quan đã phát triển thành hình. Tỷ lệ cơ thể (đầu/thân/chân) cân đối hơn.' },
      { key: '17w3d', week: 17, dayInWeek: 3, content: 'Toàn thân mọc lông mịn, lông mày đầy đủ, móng tay mọc ra. Hầu hết lông tơ sẽ biến mất sau khi sinh.' },
      { key: '17w4d', week: 17, dayInWeek: 4, content: 'Dạ dày có tế bào tạo chất nhầy. Nếp nhăn não tăng lên. 1–2 giờ sau khi mẹ ăn, con bắt đầu hấp thu!' },
      { key: '17w5d', week: 17, dayInWeek: 5, content: 'Mạch máu dưới da nhìn thấy được. Da dày hơn để bảo vệ. Tai vào vị trí bình thường.' },
      { key: '17w6d', week: 17, dayInWeek: 6, content: 'Đầu hơi cao, đã có cổ với ranh giới rõ. Đầu và cổ phát triển thành đường thẳng.' },
    ],
  },
  18: {
    week: 18, emoji: '🍅', title: 'Tuần 18 — Các Giác Quan Bùng Nổ',
    days: [
      { key: '18w0d', week: 18, dayInWeek: 0, content: 'Con trông như quả cà chua. Thường xuyên vươn tay đá chân.' },
      { key: '18w1d', week: 18, dayInWeek: 1, content: 'Khi mẹ vui, hormone thay đổi → thúc đẩy não giữa tạo thông tin → truyền cho con qua máu. Mẹ phải vui vẻ nhé!' },
      { key: '18w2d', week: 18, dayInWeek: 2, content: 'Cấu trúc cơ thể gần hoàn thiện. Trung khu hô hấp hoạt động. Cơ quan tiêu hóa bắt đầu hoạt động.' },
      { key: '18w3d', week: 18, dayInWeek: 3, content: 'Đại não phân chia thành các khu khứu giác, vị giác, thính giác, xúc giác chuyên biệt.' },
      { key: '18w4d', week: 18, dayInWeek: 4, content: 'Da màu đỏ đậm. Tuyến bã nhờn bài tiết. Chất gây hình thành bao phủ bề mặt da.' },
      { key: '18w5d', week: 18, dayInWeek: 5, content: 'Con nấc thưa hơn nhưng kéo dài hơn — thường nấc nửa tiếng mới dừng. Mẹ đừng lo!' },
      { key: '18w6d', week: 18, dayInWeek: 6, content: 'Con nghe và phân biệt được giọng mẹ với người khác — giảm nhịp tim, thư giãn khi nghe giọng mẹ.' },
    ],
  },
  19: {
    week: 19, emoji: '🍎', title: 'Tuần 19',
    days: [
      { key: '19w0d', week: 19, dayInWeek: 0, content: 'Con nặng gần bằng quả táo. Tay chân cân xứng. Thận sản sinh nước tiểu. Tóc mọc ra.' },
      { key: '19w1d', week: 19, dayInWeek: 1, content: 'Con nuốt thường xuyên hơn — hấp thu dinh dưỡng trong nước ối bên cạnh nhau thai.' },
      { key: '19w2d', week: 19, dayInWeek: 2, content: 'Con phân biệt được sáng/chiều/tối. Lúc con vận động nhiều là cơ hội tốt để mẹ thủ thỉ!' },
      { key: '19w3d', week: 19, dayInWeek: 3, content: 'Con nhận ra giọng mẹ ngày càng rõ. Bố cũng nên nói chuyện để con làm quen giọng bố!' },
      { key: '19w4d', week: 19, dayInWeek: 4, content: 'Con có lịch ngủ/thức như em bé sơ sinh. Tư thế ngủ rất độc đáo.' },
      { key: '19w5d', week: 19, dayInWeek: 5, content: 'Nước tiểu thải vào nước ối — nhưng nước ối được thay hoàn toàn mỗi 3–4 giờ.' },
      { key: '19w6d', week: 19, dayInWeek: 6, content: 'Con đang sản xuất phân su — dính, màu đen, sẽ là "thành quả" đầu tiên trên tã sau khi sinh!' },
    ],
  },
  20: {
    week: 20, emoji: '🍊', title: 'Tuần 20 — Nửa Chặng Đường',
    days: [
      { key: '20w0d', week: 20, dayInWeek: 0, content: 'Con nặng bằng quả cam. Rất hiếu động, cử động thai thường xuyên ngày lẫn đêm.' },
      { key: '20w1d', week: 20, dayInWeek: 1, content: 'Lông mày hình thành. Tóc nhỏ xíu mọc trên đầu. Nếu là bé gái, tử cung đã hình thành hoàn toàn!' },
      { key: '20w2d', week: 20, dayInWeek: 2, content: 'Tim ngày càng khỏe. Máu tuần hoàn qua dây rốn chỉ mất 30 giây một vòng.' },
      { key: '20w3d', week: 20, dayInWeek: 3, content: 'Thận tiếp quản sản xuất nước ối — hỗ trợ tiêu hóa, bài tiết và lọc chất thải.' },
      { key: '20w4d', week: 20, dayInWeek: 4, content: 'Nhịp tim mạnh mẽ. Nếu sinh đôi, nhịp tim hai bé có thể chênh nhau trên 10 lần/phút.' },
      { key: '20w5d', week: 20, dayInWeek: 5, content: 'Cơ phát triển nhanh. Dù ngủ con cũng có thể máy rất mạnh. Mẹ đừng giật mình!' },
      { key: '20w6d', week: 20, dayInWeek: 6, content: 'Nếu là bé trai, tinh hoàn bắt đầu di chuyển từ xương chậu xuống bìu. Nếu là bé gái, buồng trứng ở nguyên vị trí.' },
    ],
  },
  21: {
    week: 21, emoji: '🧅', title: 'Tuần 21',
    days: [
      { key: '21w0d', week: 21, dayInWeek: 0, content: 'Con gần bằng củ hành tây. Lông mày và mí mắt đầy đủ. Ý thức đang phát triển, có thể trao đổi cơ bản với mẹ.' },
      { key: '21w1d', week: 21, dayInWeek: 1, content: 'Da vẫn mỏng trong suốt — có thể thấy xương, cơ quan và mạch máu.' },
      { key: '21w2d', week: 21, dayInWeek: 2, content: 'Thời gian thức lâu hơn. Mẹ có thể kể chuyện, hát — con sẽ tích cực đáp lại!' },
      { key: '21w3d', week: 21, dayInWeek: 3, content: 'Cơ phát triển nhanh, diện mạo rõ nét, xương khỏe mạnh. Con thường xuyên thay đổi động tác.' },
      { key: '21w4d', week: 21, dayInWeek: 4, content: 'Môi rõ ràng hơn. Mầm răng trong lợi. Răng thật xuất hiện 4–7 tháng sau khi sinh.' },
      { key: '21w5d', week: 21, dayInWeek: 5, content: 'Thính giác phát triển hoàn toàn — con nhận biết và phản ứng với các loại âm thanh.' },
      { key: '21w6d', week: 21, dayInWeek: 6, content: 'Lông mày mọc ra, mũi cao hơn, cổ dài hơn. Khi ngủ: tay khoanh trước ngực, đầu gối gập vào bụng.' },
    ],
  },
  22: {
    week: 22, emoji: '🐟', title: 'Tuần 22',
    days: [
      { key: '22w0d', week: 22, dayInWeek: 0, content: 'Con linh hoạt như cá chép nhỏ, tự do bơi trong nước ối.' },
      { key: '22w1d', week: 22, dayInWeek: 1, content: 'Xương tai giữa cứng lại, thính giác nhạy bén hơn. Tín hiệu âm thanh đến được đại não.' },
      { key: '22w2d', week: 22, dayInWeek: 2, content: 'Con có cảm xúc! Vui thì đá nhẹ, không vui thì đá mạnh.' },
      { key: '22w3d', week: 22, dayInWeek: 3, content: 'Không gian tử cung chật chội hơn. Mẹ cảm nhận rõ sự va đập — rất thú vị!' },
      { key: '22w4d', week: 22, dayInWeek: 4, content: 'Da vẫn đỏ nhăn — mạch máu lộ dưới da là nguyên nhân. Sẽ chuyển hồng khi chào đời.' },
      { key: '22w5d', week: 22, dayInWeek: 5, content: 'Hệ hô hấp vẫn non nớt — phổi cần thêm nhiều thời gian phát triển.' },
      { key: '22w6d', week: 22, dayInWeek: 6, content: 'Mắt hình thành nhưng mống mắt chưa có màu. Tuyến tụy sản xuất hormone đang phát triển ổn định.' },
    ],
  },
  23: {
    week: 23, emoji: '👶', title: 'Tuần 23 — Giống Em Bé Sơ Sinh',
    days: [
      { key: '23w0d', week: 23, dayInWeek: 0, content: 'Con giống em bé sơ sinh phiên bản thu nhỏ. Xương cơ đang phát triển.' },
      { key: '23w1d', week: 23, dayInWeek: 1, content: 'Nụ vị giác phát huy tác dụng — con đã yêu thích vị của nước ối!' },
      { key: '23w2d', week: 23, dayInWeek: 2, content: 'Tay chân linh hoạt, có thể nắm lấy bàn chân nhỏ và gặm thích thú.' },
      { key: '23w3d', week: 23, dayInWeek: 3, content: 'Tế bào bạch cầu hình thành để chống bệnh. Hệ miễn dịch bắt đầu phát triển độc lập.' },
      { key: '23w4d', week: 23, dayInWeek: 4, content: 'Phổi là cơ quan hoàn thiện cuối cùng — đang phát triển mô và mạch máu.' },
      { key: '23w5d', week: 23, dayInWeek: 5, content: 'Áp tai vào bụng mẹ có thể nghe thấy tim thai! Dùng ống nghe càng rõ hơn.' },
      { key: '23w6d', week: 23, dayInWeek: 6, content: 'Mặt và cơ thể rất giống trẻ sơ sinh. Mắt đã hình thành.' },
    ],
  },
  24: {
    week: 24, emoji: '🍈', title: 'Tuần 24',
    days: [
      { key: '24w0d', week: 24, dayInWeek: 0, content: 'Con lớn bằng quả thanh long. Trông hơi gầy nhưng rất khỏe mạnh.' },
      { key: '24w1d', week: 24, dayInWeek: 1, content: 'Màu và chất tóc bắt đầu thay đổi (sẽ tiếp tục sau khi sinh). Con đang dự trữ nhiều dinh dưỡng hơn.' },
      { key: '24w2d', week: 24, dayInWeek: 2, content: 'Lỗ mũi mở ra. Dây thần kinh gần miệng nhạy cảm hơn — chuẩn bị để con tìm núm vú mẹ sau khi sinh!' },
      { key: '24w3d', week: 24, dayInWeek: 3, content: 'Dây rốn to hơn, hấp thu dinh dưỡng tốt hơn. Vật chất dạng keo trên dây rốn giữ cho không bị thắt.' },
      { key: '24w4d', week: 24, dayInWeek: 4, content: 'Mầm răng ẩn trong lợi — phải chờ đến 6 tuổi khi răng sữa rụng mới thấy.' },
      { key: '24w5d', week: 24, dayInWeek: 5, content: 'Thính giác ngày càng tốt. Bây giờ là thời điểm tuyệt vời để mẹ giao tiếp với con!' },
      { key: '24w6d', week: 24, dayInWeek: 6, content: 'Hệ thần kinh hoàn thiện. Con biết cảm thấy đau, cảm thấy ngứa. Con thích được lắc — mẹ cùng chơi nhé!' },
    ],
  },
  25: {
    week: 25, emoji: '🥭', title: 'Tuần 25',
    days: [
      { key: '25w0d', week: 25, dayInWeek: 0, content: 'Con gần bằng quả xoài. Thích ánh nắng và không khí trong lành.' },
      { key: '25w1d', week: 25, dayInWeek: 1, content: 'Con nghịch ngợm hơn, không ngừng tìm tư thế thoải mái. Thường xuyên thay đổi vị trí.' },
      { key: '25w2d', week: 25, dayInWeek: 2, content: 'Tai nhạy hơn. Ngày ngày nghe thấy tim đập mẹ, tiếng trò chuyện, tiếng thở, tiếng ruột/dạ dày.' },
      { key: '25w3d', week: 25, dayInWeek: 3, content: 'Con bắt đầu có ký ức nhỏ — đặc biệt quen thuộc với âm thanh lặp lại nhiều lần.' },
      { key: '25w4d', week: 25, dayInWeek: 4, content: 'Đại não giúp con thông minh hơn. Con không chỉ khua tay chân mà còn biết xoay người!' },
      { key: '25w5d', week: 25, dayInWeek: 5, content: 'Cột sống khỏe hơn. Con đã học được cách chắp tay và nắm tay.' },
      { key: '25w6d', week: 25, dayInWeek: 6, content: 'Con mũm mĩm hơn, mỡ tăng lên — da nhăn nheo trở nên mịn màng hơn!' },
    ],
  },
  26: {
    week: 26, emoji: '🍇', title: 'Tuần 26',
    days: [
      { key: '26w0d', week: 26, dayInWeek: 0, content: 'Con nặng như quả bưởi chùm. Thích hoạt động trong bụng mẹ.' },
      { key: '26w1d', week: 26, dayInWeek: 1, content: 'Con thích âm thanh hơn. Mẹ nhớ kể chuyện, nói giọng dịu êm — sẽ khiến con vui!' },
      { key: '26w2d', week: 26, dayInWeek: 2, content: 'Con lớn hơn chèn vào cơ hoành — đó là lý do mẹ cảm thấy khó thở gần đây.' },
      { key: '26w3d', week: 26, dayInWeek: 3, content: 'Đại não phát triển. Sóng não của con đã rất giống sóng não em bé sinh đủ tháng.' },
      { key: '26w4d', week: 26, dayInWeek: 4, content: 'Mí mắt mở lại, ống tai ngoài mở, võng mạc hoàn thiện hơn. Con đã có thị giác ở mức độ nhẹ!' },
      { key: '26w5d', week: 26, dayInWeek: 5, content: 'Con đã biết chớp mắt! Giấc ngủ có giờ giấc — mẹ nắm nếp ngủ để thai giáo hiệu quả hơn.' },
      { key: '26w6d', week: 26, dayInWeek: 6, content: 'Con thích mút ngón cái — giúp cơ má và hàm dưới ngày càng phát triển.' },
    ],
  },
  27: {
    week: 27, emoji: '🐱', title: 'Tuần 27',
    days: [
      { key: '27w0d', week: 27, dayInWeek: 0, content: 'Con cuộn tròn trong tử cung như mèo con. Tóc đã mọc ra rồi!' },
      { key: '27w1d', week: 27, dayInWeek: 1, content: 'Tính cách con ngày càng rõ. Thai ít vận động thì trầm tính, vận động nhiều thì nghịch ngợm.' },
      { key: '27w2d', week: 27, dayInWeek: 2, content: 'Con đã có khứu giác — nhưng vì trong nước ối nên vẫn chưa ngửi được mùi.' },
      { key: '27w3d', week: 27, dayInWeek: 3, content: 'Nếu là bé gái, môi nhỏ đã hình thành.' },
      { key: '27w4d', week: 27, dayInWeek: 4, content: 'Chất hoạt động bề mặt phế nang bắt đầu bài tiết — con có thể hô hấp được nhưng chưa thích nghi môi trường ngoài.' },
      { key: '27w5d', week: 27, dayInWeek: 5, content: 'Võng mạc hoàn toàn phát triển. Con có thể chớp mắt được rồi.' },
      { key: '27w6d', week: 27, dayInWeek: 6, content: 'Hệ thần kinh thính giác hoàn thiện. Con phản ứng rõ với âm thanh. Nhạc nhẹ nhàng khiến con cảm nhận sâu sắc.' },
    ],
  },
  28: {
    week: 28, emoji: '🧠', title: 'Tuần 28 — Não Có Nếp Nhăn',
    days: [
      { key: '28w0d', week: 28, dayInWeek: 0, content: 'Mỡ dưới da tích tụ — con mũm mĩm hơn. Thời gian hoạt động hàng ngày dài hơn.' },
      { key: '28w1d', week: 28, dayInWeek: 1, content: 'Con sắp lấp đầy tử cung. Bề mặt đại não xuất hiện khe rãnh — phản ứng nhạy bén hơn.' },
      { key: '28w2d', week: 28, dayInWeek: 2, content: 'Hệ hô hấp chưa hoàn thiện — cần thêm thời gian để hô hấp như mẹ.' },
      { key: '28w3d', week: 28, dayInWeek: 3, content: '⚠️ Đừng gây kích động mạnh cho con! Nhạc quá nhanh, âm thanh quá to sẽ ảnh hưởng đến sự phát triển.' },
      { key: '28w4d', week: 28, dayInWeek: 4, content: 'Con thích luyện phản xạ. Môi và miệng rất nhạy cảm — nếu tay xuất hiện gần miệng, con sẽ mút ngay!' },
      { key: '28w5d', week: 28, dayInWeek: 5, content: 'Da bắt đầu trơn láng, hồng hào. Lông tơ dần rụng.' },
      { key: '28w6d', week: 28, dayInWeek: 6, content: 'Mắt mở/nhắm được. Chu kỳ ngủ riêng đã hình thành. Con phân biệt được ánh sáng mặt trời và bóng tối.' },
    ],
  },
  29: {
    week: 29, emoji: '🌙', title: 'Tuần 29',
    days: [
      { key: '29w0d', week: 29, dayInWeek: 0, content: 'Con ít lộn nhào hơn nhưng thỉnh thoảng đá liên tục — thậm chí làm mẹ không ngủ được!' },
      { key: '29w1d', week: 29, dayInWeek: 1, content: 'Cơ và phổi hoàn thiện hơn. Đầu lớn hơn để chứa hàng tỷ tế bào thần kinh.' },
      { key: '29w2d', week: 29, dayInWeek: 2, content: 'Con thay đổi tư thế liên tục. Cuối cùng đầu sẽ hướng xuống vì phần đầu nặng hơn.' },
      { key: '29w3d', week: 29, dayInWeek: 3, content: 'Móng tay nhìn thấy rõ hơn. Mẹ có thể cảm nhận co thắt tử cung không đều — bình thường!' },
      { key: '29w4d', week: 29, dayInWeek: 4, content: 'Cơ quan giác quan bắt đầu thử hoạt động. Khứu giác sẽ phát huy sau khi sinh.' },
      { key: '29w5d', week: 29, dayInWeek: 5, content: 'Tóc dày hơn. Khi sinh, đầu có thể đầy tóc hoặc chỉ vài sợi — do di truyền từ bố mẹ.' },
      { key: '29w6d', week: 29, dayInWeek: 6, content: 'Thị lực vẫn rất yếu, chỉ nhận biết vật vài cm. Sẽ phát triển nhanh sau khi sinh.' },
    ],
  },
  30: {
    week: 30, emoji: '💪', title: 'Tuần 30',
    days: [
      { key: '30w0d', week: 30, dayInWeek: 0, content: 'Con cần dinh dưỡng dồi dào. Người con đã dài bằng cẳng tay mẹ!' },
      { key: '30w1d', week: 30, dayInWeek: 1, content: 'Tay chân, cơ thể và đầu phát triển hài hòa — tỷ lệ cân đối hơn.' },
      { key: '30w2d', week: 30, dayInWeek: 2, content: 'Không gian hẹp đi — con không thể duỗi tự do nữa. Mẹ đừng lo, con vẫn đang lớn!' },
      { key: '30w3d', week: 30, dayInWeek: 3, content: 'Khi thức, con tập mở/nhắm mắt. Có ánh sáng, con quay lại và dùng tay chạm vào.' },
      { key: '30w4d', week: 30, dayInWeek: 4, content: 'Vỏ não nhiều nếp nhăn hơn. Con sẽ là em bé thông minh!' },
      { key: '30w5d', week: 30, dayInWeek: 5, content: 'Các cơ quan chính hoàn thiện. Phổi và tiêu hóa gần xong. Móng chân bắt đầu mọc.' },
      { key: '30w6d', week: 30, dayInWeek: 6, content: 'Con đã nghe thấy giọng nói của mẹ — hãy nói chuyện và hát cho con nghe nhé!' },
    ],
  },
  31: {
    week: 31, emoji: '🌟', title: 'Tuần 31',
    days: [
      { key: '31w0d', week: 31, dayInWeek: 0, content: 'Con nuốt nước ối rồi bài tiết qua bàng quang — đang luyện chức năng tiểu tiện.' },
      { key: '31w1d', week: 31, dayInWeek: 1, content: 'Cánh tay và đùi đầy đặn. Nếp nhăn da giảm bớt — con ngày càng xinh hơn!' },
      { key: '31w2d', week: 31, dayInWeek: 2, content: 'Con ngủ 90–95% thời gian. Khi thức dậy, chăm chỉ luyện tập mở mắt, uống nước ối.' },
      { key: '31w3d', week: 31, dayInWeek: 3, content: 'Con mở mắt nhìn thấy "ngôi nhà nhỏ". Cả 5 giác quan đều bắt đầu hoạt động.' },
      { key: '31w4d', week: 31, dayInWeek: 4, content: 'Nước ối còn ~850ml, con không di chuyển qua lại được nữa — chỉ lắc lư để đáp lại mẹ.' },
      { key: '31w5d', week: 31, dayInWeek: 5, content: 'Tinh hoàn bé trai hạ xuống bìu. Môi lớn bé gái bắt đầu lớn lên.' },
      { key: '31w6d', week: 31, dayInWeek: 6, content: 'Con thường xuyên quay đầu qua lại. Mẹ chú ý để tránh dây rốn quấn cổ!' },
    ],
  },
  32: {
    week: 32, emoji: '🥦', title: 'Tuần 32',
    days: [
      { key: '32w0d', week: 32, dayInWeek: 0, content: 'Cử động thai ít đi — con thích máy nhiều vào buổi tối. Vẫn có quy luật, mẹ đếm kỹ nhé.' },
      { key: '32w1d', week: 32, dayInWeek: 1, content: 'Con nặng như cái súp lơ. Thân hình gần giống khi chào đời. Ngày gặp mẹ gần hơn!' },
      { key: '32w2d', week: 32, dayInWeek: 2, content: 'Hầu hết xương cứng lại. Hộp sọ vẫn mềm và chưa khép — để con đi qua ống sinh thuận lợi.' },
      { key: '32w3d', week: 32, dayInWeek: 3, content: 'Đầu con nên hướng xuống dưới — tư thế thuận lợi nhất để sinh thường.' },
      { key: '32w4d', week: 32, dayInWeek: 4, content: 'Thính giác hoàn thiện. Con phản ứng bằng cử động và nét mặt để thể hiện thích/ghét.' },
      { key: '32w5d', week: 32, dayInWeek: 5, content: 'Con thở theo nhịp giống mẹ. Phổi vẫn chưa hoàn thiện — tiếp tục nuốt và nhả nước ối để tập.' },
      { key: '32w6d', week: 32, dayInWeek: 6, content: 'Không gian chật hẹp nhưng con vẫn kiên trì vận động. Mẹ tiếp tục ghi lại cử động thai nhé.' },
    ],
  },
  33: {
    week: 33, emoji: '🌡️', title: 'Tuần 33',
    days: [
      { key: '33w0d', week: 33, dayInWeek: 0, content: 'Hệ hô hấp và tiêu hóa gần hoàn thiện. Hệ thống điều chỉnh nhiệt độ cơ thể bắt đầu hoạt động.' },
      { key: '33w1d', week: 33, dayInWeek: 1, content: 'Da chuyển hồng, không còn nhăn nheo, mỡ tiếp tục tích tụ.' },
      { key: '33w2d', week: 33, dayInWeek: 2, content: 'Con bắt đầu làm quen với tiếng ồn bên ngoài và thế giới nước ối. Mẹ đưa con đến nơi dễ chịu nhiều hơn nhé.' },
      { key: '33w3d', week: 33, dayInWeek: 3, content: 'Xương đầu vẫn rất mềm — hai khe hở ở thóp trước và sau, sẽ đóng lại sau khi sinh.' },
      { key: '33w4d', week: 33, dayInWeek: 4, content: 'Một số thai nhi đã đầy tóc, số khác chỉ có lông tơ mỏng. Mẹ đoán con thuộc loại nào? 😄' },
      { key: '33w5d', week: 33, dayInWeek: 5, content: 'Bác sĩ bắt đầu chú ý ngôi thai — ảnh hưởng trực tiếp đến cách mẹ sinh con.' },
      { key: '33w6d', week: 33, dayInWeek: 6, content: 'Phổi và dạ dày-ruột gần hoàn thiện. Nếu sinh lúc này, con đã có thể thích nghi cuộc sống ngoài tử cung.' },
    ],
  },
  34: {
    week: 34, emoji: '🌈', title: 'Tuần 34',
    days: [
      { key: '34w0d', week: 34, dayInWeek: 0, content: 'Hệ miễn dịch phát triển nhanh — giúp con chống bệnh truyền nhiễm hiệu quả sau khi sinh.' },
      { key: '34w1d', week: 34, dayInWeek: 1, content: 'Không gian chật, con hoạt động chậm hơn — thậm chí chỉ nằm ngoan ngoãn ngược đầu.' },
      { key: '34w2d', week: 34, dayInWeek: 2, content: 'Hàm lượng mỡ ~12%. Tay chân tròn trịa. Con đáng yêu hơn bao giờ hết!' },
      { key: '34w3d', week: 34, dayInWeek: 3, content: 'Khuôn mặt phúng phính, da không còn nhăn — trông mũm mĩm như em bé thật sự!' },
      { key: '34w4d', week: 34, dayInWeek: 4, content: 'Khi con vươn vai/đá chân, mẹ có thấy bụng lồi lên không?' },
      { key: '34w5d', week: 34, dayInWeek: 5, content: 'Móng ngón tay nhỏ xíu đã nhìn thấy rõ — không vượt quá đầu ngón tay.' },
      { key: '34w6d', week: 34, dayInWeek: 6, content: 'Đường nét cơ thể con lằn trên da bụng mẹ — con đang muốn mẹ nhìn thấy mình!' },
    ],
  },
  35: {
    week: 35, emoji: '⭐', title: 'Tuần 35',
    days: [
      { key: '35w0d', week: 35, dayInWeek: 0, content: 'Hệ thần kinh trung ương hoàn thiện. Con dễ thức dậy hơn — mẹ nhẹ nhàng ban đêm nhé!' },
      { key: '35w1d', week: 35, dayInWeek: 1, content: 'Con không trôi nổi trong nước ối được nữa nhưng niềm đam mê vận động không giảm!' },
      { key: '35w2d', week: 35, dayInWeek: 2, content: 'Hai quả thận cơ bản phát triển xong, gan chuyển hóa được chất cặn bã.' },
      { key: '35w3d', week: 35, dayInWeek: 3, content: 'Ánh sáng chiếu vào bụng → con vươn vai thức dậy. Đêm khuya → con cùng mẹ nghỉ ngơi.' },
      { key: '35w4d', week: 35, dayInWeek: 4, content: 'Thính giác phát triển đầy đủ. Âm thanh thanh và cao thu hút con hơn — mẹ kể chuyện nhé!' },
      { key: '35w5d', week: 35, dayInWeek: 5, content: 'Con mũm mĩm, mỡ dưới da sắp hình thành — giúp điều chỉnh nhiệt độ sau khi sinh.' },
      { key: '35w6d', week: 35, dayInWeek: 6, content: 'Thành tử cung và thành bụng mỏng dần — mẹ có thể thấy bàn tay, chân và khuỷu tay lồi trên bụng.' },
    ],
  },
  36: {
    week: 36, emoji: '🍼', title: 'Tuần 36 — Gần Ngày Sinh',
    days: [
      { key: '36w0d', week: 36, dayInWeek: 0, content: 'Thận phát triển hoàn toàn. Sau khi sinh, nước tiểu sẽ được sản sinh qua thận.' },
      { key: '36w1d', week: 36, dayInWeek: 1, content: 'Con chuyển sang tư thế đầu hướng xuống dưới — tư thế thuận lợi nhất để sinh thường.' },
      { key: '36w2d', week: 36, dayInWeek: 2, content: 'Móng tay dài quá đầu ngón tay. Tóc đã được 1–2cm!' },
      { key: '36w3d', week: 36, dayInWeek: 3, content: 'Con chiếm thể tích ngày càng nhiều. Cân nặng mẹ + con đạt mức cao nhất (~11,5–12,5kg).' },
      { key: '36w4d', week: 36, dayInWeek: 4, content: 'Thận hoàn toàn. Gan vẫn xử lý chất thải. Lá lách hoàn thiện và có thể tạo ra máu.' },
      { key: '36w5d', week: 36, dayInWeek: 5, content: 'Lông tơ và chất gây bắt đầu rụng. Da hồng hào, trơn bóng, vô cùng đáng yêu.' },
      { key: '36w6d', week: 36, dayInWeek: 6, content: 'Ruột tích tụ phân su — đây sẽ là lượng phân đầu tiên sau khi sinh.' },
    ],
  },
  37: {
    week: 37, emoji: '🎉', title: 'Tuần 37 — Sẵn Sàng Chào Đời',
    days: [
      { key: '37w0d', week: 37, dayInWeek: 0, content: 'Chiều cao ~49cm, cân nặng ~3kg. Tốc độ phát triển chậm dần. Con có thể gặp mẹ bất cứ lúc nào!' },
      { key: '37w1d', week: 37, dayInWeek: 1, content: 'Đầu di chuyển vào khoang xương chậu — được bảo vệ bởi khung xương chậu, rất an toàn.' },
      { key: '37w2d', week: 37, dayInWeek: 2, content: 'Phổi và cơ quan hô hấp hoàn thiện. Nếu sinh ra lúc này con có thể tự sống được! Mỡ tăng ~38g/ngày.' },
      { key: '37w3d', week: 37, dayInWeek: 3, content: 'Con đang tập thở. Vì chật hẹp, con đã im lặng hơn — chờ chào đời mới tiếp tục vui chơi.' },
      { key: '37w4d', week: 37, dayInWeek: 4, content: 'Tóc mỏng/thưa không đáng lo — sau khi sinh vẫn có thể dày và bóng mượt.' },
      { key: '37w5d', week: 37, dayInWeek: 5, content: 'Con phát triển chậm hơn, động tác mạnh ít hơn. Mẹ tiếp tục theo dõi nhịp tim và cử động thai.' },
      { key: '37w6d', week: 37, dayInWeek: 6, content: 'Ngôi thai gần như xác định. Nếu ngôi không thuận, bác sĩ sẽ tư vấn sinh mổ.' },
    ],
  },
  38: {
    week: 38, emoji: '🌺', title: 'Tuần 38',
    days: [
      { key: '38w0d', week: 38, dayInWeek: 0, content: 'Con vẫn hấp thu dinh dưỡng từ mẹ và nước ối để tăng cường miễn dịch trước khi vào đường sinh.' },
      { key: '38w1d', week: 38, dayInWeek: 1, content: 'Tất cả cơ quan phát triển hoàn toàn. Tim, phổi, gan, hệ hô hấp, tiêu hóa đầy đủ. Con có thể sinh tồn độc lập!' },
      { key: '38w2d', week: 38, dayInWeek: 2, content: 'Phổi và não có thể phát huy chức năng. Con hô hấp độc lập và não có ý thức đơn giản.' },
      { key: '38w3d', week: 38, dayInWeek: 3, content: 'Lông tơ về cơ bản biến mất — một số còn sót ở vai, trán, cổ.' },
      { key: '38w4d', week: 38, dayInWeek: 4, content: 'Đặc trưng trẻ sơ sinh ngày càng rõ. Con đã có thể khóc to — nhưng lần đầu thường không có nước mắt.' },
      { key: '38w5d', week: 38, dayInWeek: 5, content: 'Chiều dài dây rốn: 30–100cm, đường kính 0,8–2,0cm. Con vẫn hấp thu dinh dưỡng qua dây rốn.' },
      { key: '38w6d', week: 38, dayInWeek: 6, content: 'Mỡ tăng, da không còn trong suốt. Da chuyển từ đỏ/hồng sang màu trắng.' },
    ],
  },
  39: {
    week: 39, emoji: '🕊️', title: 'Tuần 39',
    days: [
      { key: '39w0d', week: 39, dayInWeek: 0, content: 'Con tiếp tục tăng mỡ và dự trữ năng lượng. Phổi là cơ quan cuối cùng hoàn thiện.' },
      { key: '39w1d', week: 39, dayInWeek: 1, content: 'Xương sọ vẫn chưa cố định — gồm 5 mảnh riêng biệt, sẽ ép vào nhau khi chào đời.' },
      { key: '39w2d', week: 39, dayInWeek: 2, content: 'Các cơ quan phát triển xong. Vài giờ sau khi sinh, phổi mới thiết lập hô hấp bình thường.' },
      { key: '39w3d', week: 39, dayInWeek: 3, content: 'Nước ối hơi đục, màu trắng sữa — do lông tơ và chất gây bong ra.' },
      { key: '39w4d', week: 39, dayInWeek: 4, content: 'Ngực con nhô lên vì gan to lên trong quá trình sản xuất hồng cầu.' },
      { key: '39w5d', week: 39, dayInWeek: 5, content: 'Hầu hết chức năng nhau thai bắt đầu thoái hóa — vôi hóa và cục máu. Khi con sinh ra, nhau thai "hết nhiệm vụ".' },
      { key: '39w6d', week: 39, dayInWeek: 6, content: 'Cơ quan hoàn thiện, nhạy bén. Tay chân chắc khỏe. Khoảnh khắc gặp mẹ sắp đến rồi!' },
    ],
  },
  40: {
    week: 40, emoji: '🎊', title: 'Tuần 40 — Ngày Dự Sinh',
    days: [
      { key: '40w0d', week: 40, dayInWeek: 0, content: 'Con bước vào ngày dự sinh! Xác suất sinh đúng ngày không cao — mẹ chuẩn bị tinh thần nhé.' },
      { key: '40w1d', week: 40, dayInWeek: 1, content: 'Chưa có dấu hiệu sinh? Bình thường — con muốn nằm thêm vài ngày nữa! Chậm 2 tuần là bình thường.' },
      { key: '40w2d', week: 40, dayInWeek: 2, content: 'Con tiếp tục hấp thu dinh dưỡng mỗi ngày — rất có ích cho điều hòa thân nhiệt sau khi sinh.' },
      { key: '40w3d', week: 40, dayInWeek: 3, content: 'Con nuốt lông tơ, chất gây, chất bài tiết — giữ trong ruột và thải ra 1–2 ngày sau khi sinh.' },
      { key: '40w4d', week: 40, dayInWeek: 4, content: 'Xương trên đầu vẫn chưa nối liền — giúp đầu chui qua ống sinh dễ dàng hơn.' },
      { key: '40w5d', week: 40, dayInWeek: 5, content: 'Đầy tóc hay ít tóc cũng bình thường — sau khi sinh con sẽ rất xinh đẹp!' },
      { key: '40w6d', week: 40, dayInWeek: 6, content: 'Lớp da ngoài đang bong ra, thay bằng lớp da mới bên dưới. Mẹ có mong chờ gặp con không?' },
    ],
  },
  41: {
    week: 41, emoji: '⏳', title: 'Tuần 41',
    days: [
      { key: '41w0d', week: 41, dayInWeek: 0, content: 'Con đã chuẩn bị xong, có thể ra gặp mẹ bất cứ lúc nào!' },
      { key: '41w1d', week: 41, dayInWeek: 1, content: 'Da con có thể khô như giấy da, cơ thể hơi thừa cân. Mẹ có thể hỏi ý kiến bác sĩ.' },
      { key: '41w2d', week: 41, dayInWeek: 2, content: 'Lượng nước ối giảm xuống. Mẹ kiểm tra định kỳ — nước ối quá ít sẽ làm chậm ngày gặp nhau!' },
      { key: '41w3d', week: 41, dayInWeek: 3, content: 'Con "chuẩn bị kỹ lưỡng, sẵn sàng lên đường" — chỉ còn chờ thời cơ.' },
      { key: '41w4d', week: 41, dayInWeek: 4, content: 'Da khô nhăn hơn, móng tay dài ra — trông như "cụ già tí hon"! Mẹ ăn nhiều protein và năng lượng nhé.' },
      { key: '41w5d', week: 41, dayInWeek: 5, content: 'Con phát triển hoàn thiện, nhu cầu oxy tăng lên. Mẹ nhớ bổ sung oxy kịp thời.' },
      { key: '41w6d', week: 41, dayInWeek: 6, content: 'Con rất cứng cáp rồi — nhưng hơi lười ra! Nhờ các bác sĩ "giúp" con nhé! 😄' },
    ],
  },
  42: {
    week: 42, emoji: '🌸', title: 'Tuần 42',
    days: [
      { key: '42w0d', week: 42, dayInWeek: 0, content: 'Con lúc nào cũng muốn ra ngoài gặp mẹ. Mẹ càng mong chờ thì kết quả sẽ càng tốt đẹp! ❤️' },
    ],
  },
};

export function getFetalDayEntry(week: number, dayInWeek: number): FetalDayEntry | undefined {
  return FETAL_DEVELOPMENT[week]?.days.find((d) => d.dayInWeek === dayInWeek);
}
