export interface MotherDayEntry {
  key: string;
  week: number;
  dayInWeek: number;
  content: string;
}

export interface MotherWeekData {
  week: number;
  emoji: string;
  title: string;
  days: MotherDayEntry[];
}

export const MOTHER_CHANGES: Record<number, MotherWeekData> = {
  0: {
    week: 0,
    emoji: '🌱',
    title: 'Tuần 0',
    days: [
      {
        key: '0w1d',
        week: 0,
        dayInWeek: 1,
        content:
          'Theo quy định y tế, việc tính số tuần mang thai bắt đầu từ ngày thứ nhất của kỳ kinh cuối. Nói cách khác, bạn có thể chưa mang thai trong tuần đầu tiên của thai kỳ!',
      },
      {
        key: '0w2d',
        week: 0,
        dayInWeek: 2,
        content:
          'Bạn nên ưu tiên chế độ ăn cân bằng, vệ sinh thực phẩm tốt và hạn chế thực phẩm gây khó chịu cho đường tiêu hóa. Nếu bạn dễ đau bụng hoặc nhạy cảm với đồ lạnh, hãy điều chỉnh theo tình trạng cơ thể của mình.',
      },
      {
        key: '0w3d',
        week: 0,
        dayInWeek: 3,
        content:
          'Lúc này, nội mạc tử cung của bạn đang mỏng dần. Khi kết thúc chu kỳ kinh nguyệt là lúc mỏng nhất.',
      },
      {
        key: '0w4d',
        week: 0,
        dayInWeek: 4,
        content:
          'Khi thời kỳ rụng trứng đến gần, nội mạc tử cung của bạn lại từ từ dày nên, để tạo không gian cho trứng đến.',
      },
      {
        key: '0w5d',
        week: 0,
        dayInWeek: 5,
        content:
          'Từ bây giờ, bạn phải chú ý đến mọi chi tiết trong công việc và cuộc sống. Chế độ ăn hàng ngày phải đảm bảo ngon miệng và bổ dưỡng. Lúc nào bạn cũng phải giữ cho mình tâm trạng vui vẻ.',
      },
      {
        key: '0w6d',
        week: 0,
        dayInWeek: 6,
        content:
          'Bạn phải bắt đầu chuẩn bị cho thuyết ưu sinh, đọc thêm sách, bài viết về thuyết ưu sinh, nghe nhiều những bản nhạc khiến tâm trạng vui vẻ hơn.',
      },
    ],
  },
  1: {
    week: 1,
    emoji: '🥚',
    title: 'Tuần 1 — Thời Kỳ Rụng Trứng',
    days: [
      {
        key: '1w0d',
        week: 1,
        dayInWeek: 0,
        content:
          'Bây giờ bạn cần biết rằng, từ ngày đầu tiên của chu kỳ kinh nguyệt tiếp theo dự kiến, đếm ngược trở lại 14 ngày thì ngày đó chính là ngày rụng trứng. Sau đó cộng trừ 3 ngày thì đó là thời kỳ rụng trứng, hay còn gọi là thời kỳ dễ thụ thai.',
      },
      {
        key: '1w1d',
        week: 1,
        dayInWeek: 1,
        content:
          'Bạn có thể bắt đầu bổ sung axit folic theo hướng dẫn của bác sĩ có lợi cho sức khỏe của thai nhi. Thời điểm tốt nhất để bổ sung axit folic là trong 3 tháng trước khi mang thai và 3 tháng sau khi mang thai.',
      },
      {
        key: '1w2d',
        week: 1,
        dayInWeek: 2,
        content:
          'Khả năng thụ thai cao nhất thường nằm trong "cửa sổ thụ thai" — khoảng 5 ngày trước rụng trứng và ngày rụng trứng.',
      },
      {
        key: '1w3d',
        week: 1,
        dayInWeek: 3,
        content:
          'Bạn phải lưu ý thời gian sống của trứng rất ngắn, phải quan hệ trước và sau khi trứng rụng mới có thể thành công.',
      },
      {
        key: '1w4d',
        week: 1,
        dayInWeek: 4,
        content:
          'Tinh trùng sẽ mang nhiễm sắc thể giới tính. Nếu là nhiễm sắc thể X thì sẽ sinh con gái. Nếu là nhiễm sắc thể Y thì sẽ sinh con trai. Vì thế, việc sinh con trai hay con gái không phải do bạn quyết định.',
      },
      {
        key: '1w5d',
        week: 1,
        dayInWeek: 5,
        content:
          'Tinh trùng khỏe mạnh sẽ sinh trưởng và phát triển trong cơ thể chồng bạn. Trứng trong cơ thể bạn cũng trưởng thành từ từ. Hai vợ chồng cùng giữ tâm lý thoải mái, có lợi cho sức khỏe của em bé.',
      },
      {
        key: '1w6d',
        week: 1,
        dayInWeek: 6,
        content:
          'Các loại thuốc như hormone, thuốc kháng sinh v.v... Một số loại thuốc có thể ảnh hưởng tới thai kỳ hoặc quá trình chuẩn bị mang thai. Trước khi dùng thuốc, kể cả thuốc không kê đơn, hãy hỏi ý kiến bác sĩ.',
      },
    ],
  },
  2: {
    week: 2,
    emoji: '💫',
    title: 'Tuần 2 — Thụ Tinh',
    days: [
      {
        key: '2w0d',
        week: 2,
        dayInWeek: 0,
        content:
          'Hôm nay có lẽ là đang trong thời kỳ rụng trứng. Khi bạn quan hệ tình dục, bạn phải tràn đầy đam mê. Vì nghiên cứu đã chỉ ra rằng quan hệ tình dục thoải mái, tinh thần thư giãn có thể giúp trải nghiệm thụ thai tích cực hơn.',
      },
      {
        key: '2w1d',
        week: 2,
        dayInWeek: 1,
        content:
          'Quan hệ trong hai ngày này xác suất thành công rất lớn. Xin nói cho bạn biết một bí mật nhỏ: tư thế đàn ông nằm trên, phụ nữ nằm dưới có xác suất thụ thai cao hơn.',
      },
      {
        key: '2w2d',
        week: 2,
        dayInWeek: 2,
        content:
          'Sau khi trứng rụng, trứng chỉ có thể sống 1~2 ngày. Do đó, tinh trùng phải nằm bắt cơ hội trong 1~2 ngày này để kết hợp thành công với trứng thì mới có thể có thai được.',
      },
      {
        key: '2w3d',
        week: 2,
        dayInWeek: 3,
        content:
          'Trong giai đoạn này, cùng với việc bổ sung axit folic, bạn cũng nên bổ sung nhiều loại nguyên tố vi lượng. Do các nguyên tố vi lượng kẽm, đồng v.v... cũng tham gia vào sự phát triển hệ thần kinh trung ương của bé.',
      },
      {
        key: '2w4d',
        week: 2,
        dayInWeek: 4,
        content:
          'Bây giờ là thời kỳ quan trọng để thụ tinh. Phải tránh xa tia phóng xạ, hóa chất v.v... Những nguồn bức xạ này có thể gây tác hại vô cùng lớn cho bạn và quá trình thụ tinh.',
      },
      {
        key: '2w5d',
        week: 2,
        dayInWeek: 5,
        content:
          'Bất giác, các tinh trùng đã đến thời điểm cạnh tranh cuối cùng. Lúc này, phải nhớ giữ tinh thần lạc quan, ăn uống lành mạnh.',
      },
      {
        key: '2w6d',
        week: 2,
        dayInWeek: 6,
        content:
          'Hôm nay, tinh trùng và trứng chính thức kết hợp trở thành trứng được thụ tinh. Có thể bạn sẽ ra một ít máu màu đỏ, hồng hoặc nâu. Đừng lo lắng, đó là chảy máu do hiện tượng làm tổ của phôi thai.',
      },
    ],
  },
  3: {
    week: 3,
    emoji: '🔬',
    title: 'Tuần 3 — Làm Tổ',
    days: [
      {
        key: '3w0d',
        week: 3,
        dayInWeek: 0,
        content:
          'Lúc này bạn mệt mỏi hơn bình thường, bắt đầu cảm thấy buồn ngủ, hãy nhớ nghỉ ngơi nhiều nhé.',
      },
      {
        key: '3w1d',
        week: 3,
        dayInWeek: 1,
        content:
          'Ngay từ khi trứng được thụ tinh hình thành, môi trường đã có tác động đến sự sống mới. Bạn phải luôn theo dõi chế độ dinh dưỡng, tình trạng bệnh tật, sự thay đổi cảm xúc v.v... của mình.',
      },
      {
        key: '3w2d',
        week: 3,
        dayInWeek: 2,
        content:
          'Trứng được thụ tinh vẫn đang âm thầm thay đổi. Bạn có thể mua que thử thai sớm. Sau khi thử nước tiểu vào buổi sáng, bạn sẽ vô cùng ngạc nhiên khi phát hiện thấy que thử thai có hai vạch màu đỏ.',
      },
      {
        key: '3w3d',
        week: 3,
        dayInWeek: 3,
        content:
          'Chúc mừng bạn đã trở thành bà mẹ tương lai, bạn đã chuẩn bị sẵn sàng chưa? Vì sức khỏe của bạn và sự phát triển khỏe mạnh của phôi thai, bạn phải nghiên cứu thêm kiến thức về thời kỳ mang thai.',
      },
      {
        key: '3w4d',
        week: 3,
        dayInWeek: 4,
        content:
          'Tử cung của bạn hơi to lên một chút, từ hình dẹt trở thành hình tròn, kích thước giống như quả trứng vịt. Nhưng bạn vẫn chưa thể thực sự cảm nhận được sự thay đổi nhỏ như thế.',
      },
      {
        key: '3w5d',
        week: 3,
        dayInWeek: 5,
        content:
          'Nếu bạn cảm thấy bụng dưới đau dữ dội, kèm theo buồn nôn, nôn, thậm chí ngất xỉu hoặc chảy máu âm đạo, phải suy nghĩ đến việc có phải là mang thai ngoài tử cung không. Hãy đến bệnh viện kiểm tra ngay lập tức.',
      },
      {
        key: '3w6d',
        week: 3,
        dayInWeek: 6,
        content:
          'Phôi thai tinh nghịch bắt đầu gửi tín hiệu cho bạn. Bạn sẽ cảm thấy bụng dưới hơi căng và đau. Núm vú cũng bắt đầu hơi có cảm giác đau tức.',
      },
    ],
  },
  4: {
    week: 4,
    emoji: '🌿',
    title: 'Tuần 4 — Phôi Thai Làm Tổ',
    days: [
      {
        key: '4w0d',
        week: 4,
        dayInWeek: 0,
        content:
          'Phôi thai đã làm tổ trong tử cung của bạn. Bạn phải tạo cho em bé một môi trường ấm áp, thoải mái. Phải nhớ bổ sung đầy đủ axit folic đúng giờ.',
      },
      {
        key: '4w1d',
        week: 4,
        dayInWeek: 1,
        content:
          'Bây giờ bạn sẽ cảm thấy dịch tiết âm đạo của bạn tăng lên, hãy chú ý giữ âm đạo sạch sẽ. Có thể rửa âm đạo bằng nước sạch, nhưng không được xả rửa trực tiếp bên trong.',
      },
      {
        key: '4w2d',
        week: 4,
        dayInWeek: 2,
        content:
          'Thời kỳ phôi thai là thời kỳ các cơ quan phân hóa và phát triển. Lúc này bạn cần tránh xa tia X và các tia khác, nếu không sẽ có nguy cơ phôi thai bị dị tật.',
      },
      {
        key: '4w3d',
        week: 4,
        dayInWeek: 3,
        content:
          'Canxi là nguyên tố dễ thiếu nhất ở phôi thai. Thông thường, chỉ có thể hấp thụ được 40%~60% canxi trong bữa ăn hàng ngày, vì thế bạn nên cố gắng ăn những thực phẩm giàu canxi.',
      },
      {
        key: '4w4d',
        week: 4,
        dayInWeek: 4,
        content:
          'Khi xuất hiện hiện tượng ốm nghén, bạn bắt đầu có hiện tượng ăn gì thì sẽ nôn thứ đó. Bạn hãy thử ăn ít và chia thành nhiều bữa, cố gắng đảm bảo đủ chất dinh dưỡng, có thể sẽ mang lại hiệu quả bất ngờ.',
      },
      {
        key: '4w5d',
        week: 4,
        dayInWeek: 5,
        content:
          'Dưới tác dụng của estrogen và progesterone, dấu hiệu mang thai của bạn trở nên rõ ràng hơn. Bắt đầu xuất hiện các triệu chứng như căng đau ngực, bầu ngực to và mềm, nổi nốt sần nhỏ ở quầng vú.',
      },
      {
        key: '4w6d',
        week: 4,
        dayInWeek: 6,
        content:
          'Bạn bắt đầu thường xuyên cảm thấy mệt mỏi, buồn ngủ và đi tiểu thường xuyên. Tình trạng ốm nghén cũng tiếp diễn. Lúc này, việc duy trì tâm trạng thoải mái, bình tĩnh là điều vô cùng quan trọng.',
      },
    ],
  },
  5: {
    week: 5,
    emoji: '💓',
    title: 'Tuần 5 — Ốm Nghén Bắt Đầu',
    days: [
      {
        key: '5w0d',
        week: 5,
        dayInWeek: 0,
        content:
          'Thói quen sinh hoạt của phôi thai và của bạn đồng bộ với nhau. Vì thế bạn phải tập thói quen sinh hoạt tốt, tránh xa rượu bia và thuốc lá, đi ngủ sớm và dậy sớm, có chế độ sinh hoạt điều độ mới là điều đúng đắn.',
      },
      {
        key: '5w1d',
        week: 5,
        dayInWeek: 1,
        content:
          'Phôi thai phát triển nhanh chóng trong tử cung của bạn. Cái đầu nhỏ bắt đầu thành hình. Tim đập có quy luật và bắt đầu cung cấp máu. Nhưng nhìn từ bên ngoài vẫn rất khó để có thể nhận ra bạn đã có thai.',
      },
      {
        key: '5w2d',
        week: 5,
        dayInWeek: 2,
        content:
          'Phản ứng ốm nghén vẫn tiếp tục. Mức độ ốm nghén của mỗi người liên quan đến thể trạng, trạng thái tinh thần và các yếu tố xã hội. Nếu nôn nhiều, phải kịp thời đến bệnh viện để được bác sĩ trợ giúp.',
      },
      {
        key: '5w3d',
        week: 5,
        dayInWeek: 3,
        content:
          'Lúc này, bạn có thể cảm thấy đau đầu ở các mức độ khác nhau. Môi trường yên tĩnh, thoải mái và tâm trạng bình yên sẽ giúp nâng cao chất lượng giấc ngủ của bạn.',
      },
      {
        key: '5w4d',
        week: 5,
        dayInWeek: 4,
        content:
          'Bạn có thể nhận thấy cảm giác đau tức bầu ngực của mình mạnh hơn một chút. Hàng ngày, bạn có thể massage nhẹ nhàng bằng tay hoặc chườm nóng lên bầu ngực để làm giảm cảm giác khó chịu.',
      },
      {
        key: '5w5d',
        week: 5,
        dayInWeek: 5,
        content:
          'Quá trình sinh trưởng và phát triển nhanh chóng của phôi cần một lượng protein lớn, vì vậy bạn cần đảm bảo hấp thụ 85~100g protein mỗi ngày.',
      },
      {
        key: '5w6d',
        week: 5,
        dayInWeek: 6,
        content:
          'Phôi thai còn rất mỏng manh, bạn phải đặc biệt cẩn thận khi lựa chọn thực phẩm. Hình thành thói quen xem thành phần thực phẩm, cẩn thận xem thành phần trong đó có ảnh hưởng đến phôi thai không.',
      },
    ],
  },
  6: {
    week: 6,
    emoji: '👁️',
    title: 'Tuần 6 — Siêu Âm Lần Đầu',
    days: [
      {
        key: '6w0d',
        week: 6,
        dayInWeek: 0,
        content:
          'Bạn vẫn chưa kiểm tra thai sớm? Đã đến lúc phải đến bệnh viện rồi. Kiểm tra bằng phương pháp siêu âm, nhìn thấy phôi thai nằm yên bình trong bụng. Cảm giác đó chắc hẳn rất tuyệt vời.',
      },
      {
        key: '6w1d',
        week: 6,
        dayInWeek: 1,
        content:
          'Dường như tình trạng ốm nghén của bạn càng nghiêm trọng hơn. Bạn không muốn ăn nhưng lại dễ đói. Vì sức khỏe của phôi thai, mỗi ngày bạn phải cố gắng ăn nhiều hơn một chút.',
      },
      {
        key: '6w2d',
        week: 6,
        dayInWeek: 2,
        content:
          'Có phải gần đây bạn rất hay nổi giận không? Tâm trạng bất an của bạn sẽ ảnh hưởng trực tiếp đến sự phát triển của nhau thai, vì vậy phải cố gắng giữ cho mình một tâm trạng thoải mái.',
      },
      {
        key: '6w3d',
        week: 6,
        dayInWeek: 3,
        content:
          'Triệu chứng buồn ngủ rõ ràng hơn. Mới thức dậy vào buổi sáng mà bạn đã bắt đầu cảm thấy mệt mỏi, uể oải. Không sao, hãy cứ để thuận theo tự nhiên. Đến tam cá nguyệt thứ hai, những triệu chứng này sẽ giảm đi rất nhiều.',
      },
      {
        key: '6w4d',
        week: 6,
        dayInWeek: 4,
        content:
          'Sự thay đổi hormone làm tăng lưu lượng máu. Cảm giác đau tức bầu ngực của bạn nghiêm trọng hơn, kèm theo đó là đau mỏi, tê, ngực trở nên to hơn. Hãy nhớ kiên trì massage, mặc áo ngực lớn hơn một cỡ.',
      },
      {
        key: '6w5d',
        week: 6,
        dayInWeek: 5,
        content:
          'Ngồi lâu ở một tư thế cố định không tốt cho sức khỏe của bạn và phôi thai. Hãy nhớ cứ cách một hoặc hai giờ phải đứng lên vận động một chút.',
      },
      {
        key: '6w6d',
        week: 6,
        dayInWeek: 6,
        content:
          'Hiện tại bất kỳ bệnh nào cũng có thể ảnh hưởng đến phôi thai, vì thế bạn hãy nhớ chăm sóc bản thân thật tốt nhé. Nếu không may bị ốm, bạn phải điều trị theo sự hướng dẫn của bác sĩ, tuyệt đối không được tự ý sử dụng thuốc.',
      },
    ],
  },
  7: {
    week: 7,
    emoji: '🫐',
    title: 'Tuần 7',
    days: [
      {
        key: '7w0d',
        week: 7,
        dayInWeek: 0,
        content:
          'Hiện tại phôi thai làm tổ chưa ổn định, xác suất sảy thai vẫn rất cao. Bạn phải tránh vận động mạnh và sinh hoạt tình dục để đảm bảo cho phôi thai phát triển khỏe mạnh trong bụng.',
      },
      {
        key: '7w1d',
        week: 7,
        dayInWeek: 1,
        content:
          'Bây giờ đại não nguyên thủy nhất của phôi thai đã được hình thành. Ăn nhiều thực phẩm giàu vitamin, nguyên tố vi lượng kẽm và protein có lợi hơn cho sức khỏe của phôi thai.',
      },
      {
        key: '7w2d',
        week: 7,
        dayInWeek: 2,
        content:
          'Niêm mạc âm đạo của bạn bị sung huyết và có màu sẫm. Tử cung bắt đầu lớn lên. Gần đây, có thể theo dõi tim thai và cử động thai bằng phương pháp siêu âm.',
      },
      {
        key: '7w3d',
        week: 7,
        dayInWeek: 3,
        content:
          'Tử cung ngày càng lớn chèn ép lên bàng quang, hiện tượng đi tiểu nhiều lần của bạn bắt đầu tăng lên. Đi tiểu nhiều là triệu chứng thường gặp. Bạn vẫn cần uống đủ nước, nhưng có thể hạn chế đồ uống chứa caffeine hoặc uống quá nhiều sát giờ ngủ.',
      },
      {
        key: '7w4d',
        week: 7,
        dayInWeek: 4,
        content:
          'Gần đây có thể bạn cảm thấy mệt mỏi hơn trước. Buổi tối tắm nước ấm trước khi đi ngủ sẽ giúp bạn dễ chịu hơn một chút. Trong phòng tắm, bạn có thể sử dụng thảm chống trượt, cẩn thận để tránh bị ngã.',
      },
      {
        key: '7w5d',
        week: 7,
        dayInWeek: 5,
        content:
          'Ở giai đoạn này, bạn có thể cảm thấy tim đập nhanh, chán nản, không muốn ăn. Bạn có thể chọn một số món ăn vặt lành mạnh và ngon miệng để ăn kèm như hạt dẻ, lạc, hạt dưa v.v...',
      },
      {
        key: '7w6d',
        week: 7,
        dayInWeek: 6,
        content:
          'Bụng của bạn thỉnh thoảng sẽ co thắt nhẹ. Chỉ cần không có dịch tiết màu nâu hoặc màu hồng ở phần dưới cơ thể thì không cần phải sợ hãi. Điều đó nghĩa là phôi thai đang phát triển nhanh chóng.',
      },
    ],
  },
  8: {
    week: 8,
    emoji: '🫧',
    title: 'Tuần 8',
    days: [
      {
        key: '8w0d',
        week: 8,
        dayInWeek: 0,
        content:
          'Bây giờ bạn vẫn chưa cần phải bắt đầu tiến hành thai giáo. Vì phôi thai vẫn chưa có bất kỳ thính giác và xúc giác nào. Nhưng bạn có thể chuẩn bị trước những bản nhạc và những câu chuyện mà em bé thích.',
      },
      {
        key: '8w1d',
        week: 8,
        dayInWeek: 1,
        content:
          'Phản ứng của tam cá nguyệt đầu tiên sẽ khiến bạn cảm thấy khó chịu. Bạn sẽ cảm thấy không vừa ý, còn rất hay nổi giận. Vậy thì hãy trút bỏ những điều không vui đi, đừng cố kìm nén.',
      },
      {
        key: '8w2d',
        week: 8,
        dayInWeek: 2,
        content:
          'Tuyến bã nhờn quầng vú bắt đầu xuất hiện trên hai bên quầng vú của bạn. Điều này là do sự mở rộng của tuyến nội tiết tiết dầu gây nên. Nó sẽ làm cho núm vú của bạn mềm và dẻo dai.',
      },
      {
        key: '8w3d',
        week: 8,
        dayInWeek: 3,
        content:
          'Hiện tượng tăng sắc tố da khi mang thai bắt đầu xuất hiện. Trên mặt bạn có thể xuất hiện các vết nám lốm đốm, quầng vú sẫm lại. Hiện tượng này sẽ tiếp tục cho đến khi bạn sinh xong.',
      },
      {
        key: '8w4d',
        week: 8,
        dayInWeek: 4,
        content:
          'Dịch tiết âm đạo tiếp tục tăng lên. Lúc này bạn phải tránh bị nhiễm vi khuẩn. Hàng ngày, bạn có thể dùng nước ấm, sạch để vệ sinh âm hộ, thường xuyên thay giặt quần lót, mặc quần áo rộng rãi.',
      },
      {
        key: '8w5d',
        week: 8,
        dayInWeek: 5,
        content:
          'Cùng với việc lưu lượng máu tăng lên, tĩnh mạch ở đùi, ngực và bụng của bạn trở nên rõ hơn. Vận động nhẹ nhàng, vừa phải có thể cải thiện tuần hoàn máu, ngăn ngừa chứng giãn tĩnh mạch.',
      },
      {
        key: '8w6d',
        week: 8,
        dayInWeek: 6,
        content:
          'Ngực sưng to sẽ khiến bạn cảm thấy khó chịu. Quầng vú và núm vú cũng bắt đầu sậm lại. Quần áo lót trước đây đã không còn phù hợp, cần thay đổi cỡ quần áo lót kịp thời.',
      },
    ],
  },
  9: {
    week: 9,
    emoji: '🧠',
    title: 'Tuần 9',
    days: [
      {
        key: '9w0d',
        week: 9,
        dayInWeek: 0,
        content:
          'Nếu bạn có phản ứng ốm nghén nghiêm trọng, bạn có thể thử một ít món cháo nhạt và một ít thực phẩm dễ tiêu, ăn nhiều lần với số lượng ít, giảm lượng xeton do cơ thể sản sinh ra gây hại cho sự phát triển não bộ của thai nhi.',
      },
      {
        key: '9w1d',
        week: 9,
        dayInWeek: 1,
        content:
          'Có lẽ bạn sẽ trở nên thích một loại thực phẩm có hương vị nào đó. Nếu món ăn đó có thể làm tăng cảm giác thèm ăn của bạn thì bạn có thể ăn với mức độ vừa phải. Nhưng lưu ý tránh xa các loại thực phẩm như thịt nướng, khoai tây chiên, món rán v.v...',
      },
      {
        key: '9w2d',
        week: 9,
        dayInWeek: 2,
        content:
          'Tử cung ngày càng lớn làm chậm tốc độ nhu động ruột. Bạn bắt đầu bị phiền phức bởi chứng táo bón. Bạn nên ăn nhiều rau, quả giàu chất xơ, đi bộ nhiều, không nên ngồi lâu.',
      },
      {
        key: '9w3d',
        week: 9,
        dayInWeek: 3,
        content:
          'Phần eo và phần mông của bạn bắt đầu trở nên to và rộng hơn. Đây là bước chuẩn bị cho quá trình sinh nở. Nếu quần chật, bạn cần kịp thời thay đổi size, cạp quần chật sẽ gây ảnh hưởng xấu đến cơ thể.',
      },
      {
        key: '9w4d',
        week: 9,
        dayInWeek: 4,
        content:
          'Bạn có thể sẽ có triệu chứng buồn ngủ, dễ mệt mỏi. Hãy chú ý thuận theo tự nhiên. Nếu mệt thì phải nghỉ ngơi, không gắng gượng, cũng không được mang vác đồ nặng, vận động phải nhẹ nhàng, không được chạy nhảy.',
      },
      {
        key: '9w5d',
        week: 9,
        dayInWeek: 5,
        content:
          'Bây giờ bạn có thể trông tiều tụy hơn trước rất nhiều. Bạn bắt đầu nổi mụn, xuất hiện các vết ban hình cánh bướm. Đây là những thay đổi nội tiết bình thường. Bạn phải duy trì việc ngủ đủ giấc và chế độ ăn uống lành mạnh.',
      },
      {
        key: '9w6d',
        week: 9,
        dayInWeek: 6,
        content:
          'Môi trường trong nhà cần thường xuyên thoáng gió, ít bật điều hòa và quạt. Mặc quần áo thoải mái khi ra ngoài, tạm thời từ bỏ đôi giày cao gót yêu quý của bạn. Điều này sẽ giúp giữ gìn sức khỏe và an toàn cho bạn và thai nhi.',
      },
    ],
  },
  10: {
    week: 10,
    emoji: '🦴',
    title: 'Tuần 10',
    days: [
      {
        key: '10w0d',
        week: 10,
        dayInWeek: 0,
        content:
          'Bây giờ bạn có thể cảm thấy chóng mặt và cơ thể yếu ớt. Lúc đó bạn hãy thử nằm xuống và nâng chân lên cao hơn so với đầu. Khi cảm thấy dễ chịu hơn rồi thì từ từ đặt chân xuống.',
      },
      {
        key: '10w1d',
        week: 10,
        dayInWeek: 1,
        content:
          'Lúc này tâm trạng của bạn bắt đầu dần dần ổn định. Nếu bạn vẫn bồn chồn, bất an thì phải kịp thời điều chỉnh tâm trạng của mình, nói chuyện, tâm sự nhiều hơn với người thân trong gia đình và bạn bè.',
      },
      {
        key: '10w2d',
        week: 10,
        dayInWeek: 2,
        content:
          'Bụng của bạn có thể bắt đầu từ từ to hơn. Một số loại quần áo rộng rãi là lựa chọn rất tốt, ví dụ như áo phông rộng, váy v.v... Sau đó bạn cũng có thể bắt đầu chuẩn bị trang phục bầu rồi.',
      },
      {
        key: '10w3d',
        week: 10,
        dayInWeek: 3,
        content:
          'Lợi của bạn có thể sẽ dễ bị chảy máu. Lúc này, bạn phải chú ý ăn nhiều rau quả tươi, bổ sung vitamin C, vệ sinh răng miệng sạch sẽ, giảm sự sinh sôi và lây nhiễm của vi khuẩn.',
      },
      {
        key: '10w4d',
        week: 10,
        dayInWeek: 4,
        content:
          'Bàng quang của bạn lúc này dễ bị nhiễm trùng hơn. Thời gian nước tiểu ở trong bàng quang càng lâu thì vi khuẩn càng dễ sinh sôi. Vì thế cho dù bạn đi tiểu nhiều lần thì đi vệ sinh nhiều vẫn tốt hơn là nhịn.',
      },
      {
        key: '10w5d',
        week: 10,
        dayInWeek: 5,
        content:
          'Tăng sắc tố da và da không ngừng sậm màu hơn. Vết bớt, tàn nhang, vết sẹo mới và nốt ruồi sậm màu của bạn bắt đầu xuất hiện và trở nên sẫm màu hơn. Đừng lo lắng, những hiện tượng này đều chỉ xuất hiện tạm thời.',
      },
      {
        key: '10w6d',
        week: 10,
        dayInWeek: 6,
        content:
          'Bụng của bạn vẫn chưa nhô quá cao. Có thể người khác không nhận ra là bạn đang mang thai. Vì thế tốt nhất bạn không nên đến chỗ đông người để tránh những điều ngoài ý muốn do xô đẩy gây nên.',
      },
    ],
  },
  11: {
    week: 11,
    emoji: '👂',
    title: 'Tuần 11',
    days: [
      {
        key: '11w0d',
        week: 11,
        dayInWeek: 0,
        content:
          'Bắt đầu từ hôm nay, bạn nên đi những đôi giày dễ đi lại, không gây khó chịu cho chân. Gót giày phải thấp hơn 2cm. Phải chọn loại có đế chống trượt.',
      },
      {
        key: '11w1d',
        week: 11,
        dayInWeek: 1,
        content:
          'Lúc này bạn rất dễ bị viêm lợi. Chế phẩm hóa học của kem đánh răng chống viêm có thể gây ảnh hưởng đến thai nhi. Bạn chú ý chọn kem đánh răng thông thường và ăn nhiều rau, quả.',
      },
      {
        key: '11w2d',
        week: 11,
        dayInWeek: 2,
        content:
          'Đại não của thai nhi phát triển nhanh chóng. Lúc này bạn nên bổ sung thực phẩm giàu omega-3 và DHA như cá biển ít thủy ngân; các thực phẩm như óc chó, hạt lanh, vừng… cũng cung cấp axit béo có lợi cho thai kỳ.',
      },
      {
        key: '11w3d',
        week: 11,
        dayInWeek: 3,
        content:
          'Màu sắc của vùng xung quanh núm vú trở nên sẫm hơn. Đường kính quầng vú cũng tăng lên. Đây là nguyên nhân tăng sắc tố da khi mang thai. Bạn không cần phải lo lắng.',
      },
      {
        key: '11w4d',
        week: 11,
        dayInWeek: 4,
        content:
          'Bạn có thể thỉnh thoảng gặp hiện tượng thức ăn và axit dạ dày trào ngược lên thực quản. Bạn chú ý ăn chế độ ăn uống nhẹ nhàng, tránh xa thực phẩm nhiều dầu mỡ, kiên trì thực hiện chế độ ăn ít, chia thành nhiều bữa nhỏ. Điều này sẽ giúp giảm dần triệu chứng trên.',
      },
      {
        key: '11w5d',
        week: 11,
        dayInWeek: 5,
        content:
          'Do sự thay đổi của hormone trong thời kỳ mang thai, bạn có thể có rất nhiều lông tơ xuất hiện trên da bụng, đùi. Trên mặt, cánh tay xuất hiện nhiều vết ban nhỏ. Bạn đừng tự ti, những hiện tượng này chỉ xuất hiện tạm thời.',
      },
      {
        key: '11w6d',
        week: 11,
        dayInWeek: 6,
        content:
          'Bạn còn thường xuyên cảm thấy mệt mỏi không? Đó có thể là do thiếu máu nhẹ. Bạn có thể ăn nhiều thực phẩm giàu sắt hơn. Nếu các triệu chứng vẫn tiếp diễn, tốt nhất bạn nên đi khám bác sĩ để được tư vấn.',
      },
    ],
  },
  12: {
    week: 12,
    emoji: '✋',
    title: 'Tuần 12',
    days: [
      {
        key: '12w0d',
        week: 12,
        dayInWeek: 0,
        content:
          'Ngồi thường xuyên sẽ cảm thấy đau xương cụt. Bạn có thể thử chườm nóng vùng xương cụt. Như thế sẽ giúp bạn từ từ giảm bớt các triệu chứng khó chịu. Bạn nhớ đứng lên vận động nhiều hơn nhé.',
      },
      {
        key: '12w1d',
        week: 12,
        dayInWeek: 1,
        content:
          'Rất có thể bạn sẽ phát hiện thấy từ xương mu đến bụng xuất hiện một đường mảnh màu đen. Đây là đường sọc nâu. Bạn đừng lo lắng. Chăm chỉ luyện tập thể dục có thể đẩy nhanh quá trình tiêu biến đường sọc nâu sau sinh.',
      },
      {
        key: '12w2d',
        week: 12,
        dayInWeek: 2,
        content:
          'Thân hình của bạn bắt đầu thay đổi, nhưng phần bụng dưới phình ra vẫn chưa rõ ràng. Người khác vẫn không dễ nhận ra bạn đang mang thai. Vì thế hãy cố gắng tránh những nơi đông người.',
      },
      {
        key: '12w3d',
        week: 12,
        dayInWeek: 3,
        content:
          'Bạn có thể tham gia học về thai giáo, để chồng bạn cùng bạn học những kiến thức có liên quan đến thời kỳ mang thai, thúc đẩy tình cảm vợ chồng và bạn cũng có thể kết bạn với những bà mẹ tương lai, cùng họ giao lưu, trao đổi.',
      },
      {
        key: '12w4d',
        week: 12,
        dayInWeek: 4,
        content:
          'Tình trạng ốm nghén trong giai đoạn sớm về cơ bản đã biến mất. Có thể bạn đã khôi phục sức sống trước đây, cảm giác thèm ăn tăng lên. Nhưng bạn phải kiểm soát tốt cân nặng, cân bằng dinh dưỡng.',
      },
      {
        key: '12w5d',
        week: 12,
        dayInWeek: 5,
        content:
          'Bạn cần thực hiện các bài tập thể dục vừa phải, dùng dầu chống nhăn hoặc dầu oliu để massage, thúc đẩy tuần hoàn máu cục bộ, tăng độ đàn hồi của các sợi đàn hồi dưới da, giảm sự xuất hiện của các vết rạn da.',
      },
      {
        key: '12w6d',
        week: 12,
        dayInWeek: 6,
        content:
          'Dịch tiết âm đạo ngày càng nhiều. Nếu bạn cảm thấy đau vùng kín và dịch tiết không phải là màu trắng, đồng thời có mùi hôi thì hãy mau đi khám bác sĩ.',
      },
    ],
  },
  13: {
    week: 13,
    emoji: '🌸',
    title: 'Tuần 13',
    days: [
      {
        key: '13w0d',
        week: 13,
        dayInWeek: 0,
        content:
          'Vết rạn khi mới xuất hiện có màu đỏ nhạt hoặc xanh nhạt. Nếu bạn phát hiện mình có dấu hiệu rạn da, bạn phải chú ý bổ sung rau quả tươi và thực phẩm giàu protein.',
      },
      {
        key: '13w1d',
        week: 13,
        dayInWeek: 1,
        content:
          'Cân nặng của bạn sẽ tiếp tục tăng lên, cơ thể của bạn sẽ dần đầy đặn lên. Bầu ngực của bạn dần dần to lên. Diện tích của quầng vú cũng bắt đầu tăng lên, màu sắc ngày càng đậm hơn.',
      },
      {
        key: '13w2d',
        week: 13,
        dayInWeek: 2,
        content:
          'Rất nhiều quần áo trước đây không còn vừa. Đừng cố gắng mặc chúng. Ép bụng không tốt cho sức khỏe của bạn và sự phát triển của thai nhi. Hãy mau đi mua quần áo thôi!',
      },
      {
        key: '13w3d',
        week: 13,
        dayInWeek: 3,
        content:
          'Bạn nên chọn loại trang phục bầu có chất liệu mềm mại, kiểu dáng rộng rãi, phù hợp với tiêu chuẩn sản xuất. Nếu không, các chất độc hại còn sót lại trên quần áo trong quá trình sản xuất sẽ dễ gây dị ứng cho mẹ bầu, gây hại cho sức khỏe.',
      },
      {
        key: '13w4d',
        week: 13,
        dayInWeek: 4,
        content:
          'Lúc này núm vú của bạn có thể tiết ra một ít sữa. Chú ý không được nặn, vì sẽ rất dễ làm núm vú bị tổn thương, dẫn tới nhiễm trùng. Bạn cần chú ý vệ sinh hàng ngày, thường xuyên thay quần lót.',
      },
      {
        key: '13w5d',
        week: 13,
        dayInWeek: 5,
        content:
          'Tóc của bạn ngày càng đen bóng, rất ít có gàu và vảy mốc. Lúc này không nên gội nhiều, sấy khô. Bạn có thể dùng lược gỗ để chải đầu, cải thiện tuần hoàn máu ở phần đầu.',
      },
      {
        key: '13w6d',
        week: 13,
        dayInWeek: 6,
        content:
          'Da của bạn có thể bị ngứa trong thai kỳ. Bạn đừng gãi quá mạnh và cũng không nên dùng các sản phẩm tẩy rửa quá nhiều. Bạn cần vệ sinh đúng giờ, thay quần lót thường xuyên. Nếu nghiêm trọng, bạn có thể hỏi ý kiến tư vấn của bác sĩ.',
      },
    ],
  },
  14: {
    week: 14,
    emoji: '🤲',
    title: 'Tuần 14',
    days: [
      {
        key: '14w0d',
        week: 14,
        dayInWeek: 0,
        content:
          'Lúc này thai nhi sẽ có "cảm giác" yêu, giận, buồn, vui. Bạn hãy cố gắng tạo cho thai nhi một môi trường hài hòa, yên tĩnh. Bạn cần duy trì tâm lý vui vẻ thì em bé sẽ rất vui.',
      },
      {
        key: '14w1d',
        week: 14,
        dayInWeek: 1,
        content:
          'Thân nhiệt của bạn sẽ cao hơn người bình thường một chút, điều này sẽ khiến bạn dễ đổ mồ hôi. Bạn nên chú ý bổ sung nước, ăn rau, quả tươi, chống mất nước.',
      },
      {
        key: '14w2d',
        week: 14,
        dayInWeek: 2,
        content:
          'Mông của bạn bắt đầu to hơn. Cơ ở eo, đùi và mông nhiều hơn, và rắn chắc hơn. Mỡ cũng tăng lên. Đó là để chuẩn bị cho sự ra đời của em bé.',
      },
      {
        key: '14w3d',
        week: 14,
        dayInWeek: 3,
        content:
          'Lợi của bạn có thể có hiện tượng sung huyết hoặc chảy máu. Hàng ngày bạn phải chú ý vệ sinh răng miệng, ăn ít đồ ngọt, giảm bớt sự sản sinh vi khuẩn và mảng bám răng. Chọn bàn chải đánh răng lông mềm.',
      },
      {
        key: '14w4d',
        week: 14,
        dayInWeek: 4,
        content:
          'Tải đối với chức năng tim phổi của bạn tăng lên, nhịp tim tăng nhanh, thở gấp, sẽ khiến tâm trạng của bạn đôi lúc trở nên nhạy cảm, dễ nổi giận. Bạn nên trao đổi với người thân trong gia đình nhiều hơn về các phản ứng sinh lý và suy nghĩ của bạn.',
      },
      {
        key: '14w5d',
        week: 14,
        dayInWeek: 5,
        content:
          'Có phải bạn bị rạn da nhiều hơn và có nhiều vết nám lốm đốm hơn không? Bạn phải bổ sung lượng vitamin, khoáng chất phong phú và thực phẩm giàu protein. Tập luyện thể dục đúng giờ, tăng độ đàn hồi cho da.',
      },
      {
        key: '14w6d',
        week: 14,
        dayInWeek: 6,
        content:
          'Xác suất đi tiểu nhiều lần của bạn ngày càng cao. Nhưng bạn chú ý không được nhịn uống nước để ít đi vệ sinh. Điều đó không có lợi cho sức khỏe của chính bạn và thai nhi.',
      },
    ],
  },
  15: {
    week: 15,
    emoji: '🏊',
    title: 'Tuần 15',
    days: [
      {
        key: '15w0d',
        week: 15,
        dayInWeek: 0,
        content:
          'Có rất nhiều mồ hôi và bã nhờn trên da của bạn. Bạn thường xuyên đổ mồ hôi. Lúc này, bạn nên thường xuyên tắm rửa, thường xuyên thay quần áo để tránh bị nhiễm lạnh. Khi tắm phải dùng vòi hoa, bớt sử dụng bồn tắm.',
      },
      {
        key: '15w1d',
        week: 15,
        dayInWeek: 1,
        content:
          'Thể tích máu trong cơ thể bạn đang tăng lên. Mũi của bạn dễ bị sung huyết và xuất huyết. Bình thường bạn hãy uống nhiều nước hơn, ăn nhiều hoa quả và rau xanh, không được tùy ý ngoáy mũi.',
      },
      {
        key: '15w2d',
        week: 15,
        dayInWeek: 2,
        content:
          'Bạn có thể thường xuyên đi bộ trong công viên ngoài trời, rừng cây hoặc ven biển, hít thở không khí trong lành, thư giãn cơ thể và tinh thần. Như thế bạn có thể nâng cao khả năng cung cấp oxy cho thai nhi.',
      },
      {
        key: '15w3d',
        week: 15,
        dayInWeek: 3,
        content:
          'Sự phát triển của thai nhi sẽ hấp thụ nguyên tố sắt trong cơ thể bạn, vì thế bạn sẽ dễ bị thiếu máu do thiếu sắt. Thông thường bạn cần bổ sung nhiều thịt đỏ và huyết động vật với một lượng thích hợp.',
      },
      {
        key: '15w4d',
        week: 15,
        dayInWeek: 4,
        content:
          'Bây giờ bạn có thể mơ hồ cảm thấy cử động thai, ùng ục giống như nhu động ruột. Có phải là bạn cảm thấy kinh ngạc không? Nhưng tần suất xuất hiện của hiện tượng này không nhiều.',
      },
      {
        key: '15w5d',
        week: 15,
        dayInWeek: 5,
        content:
          'Lúc này bạn có thể theo dõi tim thai, tìm hiểu về tình hình của thai nhi bất cứ lúc nào. Tim thai thường được theo dõi bằng Doppler hoặc siêu âm tại cơ sở y tế. Nhịp tim thai bình thường thường dao động khoảng 110–160 lần/phút.',
      },
      {
        key: '15w6d',
        week: 15,
        dayInWeek: 6,
        content:
          'Cùng với việc thai nhi ngày càng lớn hơn, tư thế ngủ nằm ngửa không còn phù hợp với bạn nữa. Bạn nên bắt đầu thử tư thế ngủ nằm nghiêng về bên trái để giảm áp lực đối với tử cung.',
      },
    ],
  },
  16: {
    week: 16,
    emoji: '🎵',
    title: 'Tuần 16 — Bắt Đầu Thai Giáo',
    days: [
      {
        key: '16w0d',
        week: 16,
        dayInWeek: 0,
        content:
          'Thính giác của bé đã hình thành. Bé giống như một "kẻ nghe trộm" bé nhỏ. Bé thích nhất là nghe giọng hát và tiếng hát dịu dàng của bạn. Dự án lớn về thai giáo có thể bắt đầu ngay bây giờ rồi.',
      },
      {
        key: '16w1d',
        week: 16,
        dayInWeek: 1,
        content:
          'Bụng bạn ngày càng lớn, có phải giấc ngủ của bạn cũng bị ảnh hưởng không? Từ bây giờ trở đi, bạn phải học cách chọn một tư thế ngủ thoải mái và khỏe mạnh.',
      },
      {
        key: '16w2d',
        week: 16,
        dayInWeek: 2,
        content:
          'Để có thể cho con bú tốt hơn sau khi sinh, bạn cần massage bầu ngực nhẹ nhàng hàng ngày để bầu ngực, núm vú to và dài ra. Mỗi lần 5 phút là được.',
      },
      {
        key: '16w3d',
        week: 16,
        dayInWeek: 3,
        content:
          'Bạn lại "mập" lên rất nhiều rồi? Đúng là ra dáng mẹ bầu rồi. Hãy mau thay toàn bộ trang phục trên người thành trang phục bầu lớn hơn một cỡ đi thôi. Quần áo lót, quần áo, giày dép đều thay đồ mới đi nào!',
      },
      {
        key: '16w4d',
        week: 16,
        dayInWeek: 4,
        content:
          'Đôi khi bạn sẽ cảm thấy một bên bụng hơi đau một chút. Đó là vì dây chằng ở cả hai bên tử cung và xương chậu thay đổi. Nếu đau liên tục, phải hỏi ý kiến tư vấn của bác sĩ.',
      },
      {
        key: '16w5d',
        week: 16,
        dayInWeek: 5,
        content:
          'Có thể bạn sẽ bị ngạt mũi, niêm mạc mũi xung huyết và xuất huyết. Lúc này không nên lạm dụng thuốc nhỏ mũi và thuốc chống dị ứng. Hiện tượng này sẽ tự thuyên giảm cho tới khi biến mất.',
      },
      {
        key: '16w6d',
        week: 16,
        dayInWeek: 6,
        content:
          'Lúc này bạn cần tăng lượng thức ăn phù hợp để đáp ứng nhu cầu năng lượng và dinh dưỡng của thai nhi. Mỗi ngày uống một lượng phù hợp sữa bột dành cho bà bầu sẽ giúp cân bằng hợp lý chế độ ăn uống.',
      },
    ],
  },
  17: {
    week: 17,
    emoji: '🦶',
    title: 'Tuần 17',
    days: [
      {
        key: '17w0d',
        week: 17,
        dayInWeek: 0,
        content:
          'Trong khoảng thời gian này, cân nặng của bạn tăng lên khá nhiều. Bụng dưới nhô lên rõ rệt. Đôi lúc bạn sẽ cảm thấy bên bụng dưới khó chịu. Đây là hiện tượng bình thường!',
      },
      {
        key: '17w1d',
        week: 17,
        dayInWeek: 1,
        content:
          'Lúc này bạn rất nhạy cảm và sẽ cảm nhận được cử động thai ngày càng rõ rệt. Tốt nhất bạn nên ghi lại thời gian cử động thai đầu tiên và nói cho bác sĩ biết khi bạn đến bệnh viện khám thai lần tiếp theo.',
      },
      {
        key: '17w2d',
        week: 17,
        dayInWeek: 2,
        content:
          'Tử cung của bạn đang không ngừng to lên, cơ thể bắt đầu chậm chạp. Đã đến lúc bạn nên từ bỏ những đôi giày cao gót. Đi giày đế bằng hoặc giày bệt sẽ mang tới cảm giác thoải mái hơn!',
      },
      {
        key: '17w3d',
        week: 17,
        dayInWeek: 3,
        content:
          'Ở giai đoạn này, tim thai thường có thể được theo dõi tại cơ sở y tế bằng Doppler hoặc siêu âm. Tim thai truyền tải thông tin về cơ thể của em bé. Tim thai đều đặn không có khoảng trống mới là bình thường.',
      },
      {
        key: '17w4d',
        week: 17,
        dayInWeek: 4,
        content:
          'Từ bây giờ, bạn có thể bắt đầu làm quen với thói quen theo dõi cử động thai. Nếu nhận thấy thai máy giảm rõ rệt hoặc khác thường so với bình thường, hãy liên hệ bác sĩ.',
      },
      {
        key: '17w5d',
        week: 17,
        dayInWeek: 5,
        content:
          'Dưới tác dụng của progesterone, thân nhiệt của bạn sẽ hơi cao. Thông thường sẽ cao hơn của người bình thường 0,3~0,5°C. Đây là hiện tượng bình thường, bạn không cần lo lắng.',
      },
      {
        key: '17w6d',
        week: 17,
        dayInWeek: 6,
        content:
          'Bây giờ bạn nhận thấy số lần táo bón của mình tăng lên. Ăn nhiều hoa quả, rau xanh, đồng thời tập thói quen đi đại tiện tốt sẽ giúp cải thiện tình trạng này rất nhiều.',
      },
    ],
  },
  18: {
    week: 18,
    emoji: '🍅',
    title: 'Tuần 18',
    days: [
      {
        key: '18w0d',
        week: 18,
        dayInWeek: 0,
        content:
          'Ô nhiễm chì sẽ ảnh hưởng tới sự phát triển đại não của thai nhi thông qua quá trình tuần hoàn máu của nhau thai, dẫn tới trẻ chậm phát triển, động kinh. Bạn hãy tránh xa ô nhiễm chì nhé.',
      },
      {
        key: '18w1d',
        week: 18,
        dayInWeek: 1,
        content:
          'Chúc mừng bạn đã vượt qua giai đoạn có nguy cơ sảy thai cao. Bạn có thể thở phào nhẹ nhõm được rồi. Nhưng bạn vẫn không thể vận động mạnh, để tránh làm tổn thương tới thai nhi.',
      },
      {
        key: '18w2d',
        week: 18,
        dayInWeek: 2,
        content:
          'Bây giờ, nhu cầu của cơ thể đối với axit folic và các loại vitamin khác nhau tăng lên. Bạn cần chú ý bổ sung vitamin, ăn nhiều hoa quả giàu vitamin và phơi nắng nhiều hơn.',
      },
      {
        key: '18w3d',
        week: 18,
        dayInWeek: 3,
        content:
          'Trong giai đoạn này, bạn cần tăng cường chăm sóc, massage bầu ngực. Nếu bạn nhận thấy núm vú lõm vào thì cần dùng bộ chỉnh sửa núm vú để hỗ trợ nắn chỉnh và kéo núm vú ra.',
      },
      {
        key: '18w4d',
        week: 18,
        dayInWeek: 4,
        content:
          'Bụng của bạn ngày càng to hơn. Bạn bắt đầu cảm thấy đau thắt lưng. Hiện tượng này sẽ tự biến mất sau khi sinh. Bạn có thể đi bộ nhiều hơn, chú ý nghỉ ngơi hợp lý thì có thể giảm bớt được hiện tượng này.',
      },
      {
        key: '18w5d',
        week: 18,
        dayInWeek: 5,
        content:
          'Bây giờ bạn đã thực sự cảm nhận thấy sự tồn tại của sự sống trong bụng mình. Tâm trí bạn lúc nào cũng nghĩ tới sự sống nhỏ bé này, vì thế trông bạn vui vẻ hơn rất nhiều.',
      },
      {
        key: '18w6d',
        week: 18,
        dayInWeek: 6,
        content:
          'Các vết ban hình cánh bướm ngày càng "ngang ngược". Chúng xuất hiện trên môi trên của bạn, phía trên má và xung quanh trán. Bạn đừng chán nản, hãy chống nắng thật tốt. Tin chắc rằng hiện tượng này sẽ giảm đi rất nhiều.',
      },
    ],
  },
  19: {
    week: 19,
    emoji: '🍎',
    title: 'Tuần 19',
    days: [
      {
        key: '19w0d',
        week: 19,
        dayInWeek: 0,
        content:
          'Cánh tay, ngón tay của bạn trở nên to hơn, thô hơn. Bạn phải tháo các đồ trang sức như vòng tay, dây chuyền, nhẫn v.v... càng sớm càng tốt, nếu không sẽ cản trở tuần hoàn máu, gây tổn thương cho da và khớp.',
      },
      {
        key: '19w1d',
        week: 19,
        dayInWeek: 1,
        content:
          'Thai giáo của ông bố tương lai sẽ khiến thai nhi vui vẻ hơn, làm cho bé ngả đầu vào bụng bạn. Hãy nói chuyện với thai nhi bằng giọng nhẹ nhàng tại vị trí cách thành bụng khoảng 3~5cm.',
      },
      {
        key: '19w2d',
        week: 19,
        dayInWeek: 2,
        content:
          'Có thể phán đoán chính xác tình hình tăng trưởng và phát triển của thai nhi thông qua chiều cao của đáy tử cung. Từ hôm nay trở đi, đáy tử cung của bạn trung bình sẽ tăng 1cm mỗi tuần.',
      },
      {
        key: '19w3d',
        week: 19,
        dayInWeek: 3,
        content:
          'Bạn có thể bắt đầu bị táo bón nghiêm trọng. Thậm chí bị trĩ, khiến bạn vô cùng đau đớn. Bạn hãy cố gắng điều chỉnh tình trạng này thông qua chế độ ăn uống, không được tùy ý chữa trị bằng thuốc.',
      },
      {
        key: '19w4d',
        week: 19,
        dayInWeek: 4,
        content:
          'Em bé giống như một vận động viên, không ngừng nhào lộn. Đôi lúc, bé vận động thường xuyên vào ban đêm, làm ảnh hưởng tới việc nghỉ ngơi của bạn. Bạn cũng đừng tức giận, nếu không bé cũng sẽ không vui đâu.',
      },
      {
        key: '19w5d',
        week: 19,
        dayInWeek: 5,
        content:
          'Bây giờ bạn nên tăng cường vận động một cách hợp lý để thích ứng với gánh nặng tăng lên cho tuần hoàn máu và hệ hô hấp. Vận động ngoài trời vừa có thể giúp bạn hít thở không khí trong lành, vừa có thể giúp bạn được phơi mình dưới ánh nắng mặt trời.',
      },
      {
        key: '19w6d',
        week: 19,
        dayInWeek: 6,
        content:
          'Bụng của bạn ngày càng lớn hơn, di chuyển ngày càng bất tiện. Bạn cần di chuyển với tốc độ chậm lại, giảm mức độ của động tác hoặc để ông bố tương lai thực hiện thay bạn, tránh làm cơ thể khó chịu.',
      },
    ],
  },
  20: {
    week: 20,
    emoji: '🍊',
    title: 'Tuần 20 — Nửa Chặng Đường',
    days: [
      {
        key: '20w0d',
        week: 20,
        dayInWeek: 0,
        content:
          'Cân nặng của bạn đã tăng lên khoảng 3,5kg. Trong giai đoạn thai nhi tăng trưởng và phát triển, bạn vẫn phải tiếp tục hấp thụ đủ chất dinh dưỡng. Bạn không được kén ăn và cũng không được ăn quá nhiều.',
      },
      {
        key: '20w1d',
        week: 20,
        dayInWeek: 1,
        content:
          'Lúc này, tử cung của bạn chèn ép lên dạ dày. Thể tích dạ dày giảm, vì thế nên ăn ít và chia thành nhiều bữa, chủ yếu là ăn các loại thực phẩm có thể tích nhỏ, giàu chất dinh dưỡng.',
      },
      {
        key: '20w2d',
        week: 20,
        dayInWeek: 2,
        content:
          'Bây giờ, có thể sẽ xuất hiện "cơn co tử cung giả". Bạn đừng sợ hãi, chỉ cần không đau thì đó là hiện tượng bình thường. Bạn cần chú ý ăn uống và nghỉ ngơi, bổ sung sắt, bổ sung canxi là điều quan trọng nhất.',
      },
      {
        key: '20w3d',
        week: 20,
        dayInWeek: 3,
        content:
          'Lưu lượng máu không ngừng tăng lên và tử cung to lên sẽ khiến bạn dễ bị giãn tĩnh mạch chi dưới. Bình thường phải cố tránh không đứng trong thời gian dài. Khi nằm trên giường nên kê cao chân lên một chút.',
      },
      {
        key: '20w4d',
        week: 20,
        dayInWeek: 4,
        content:
          'Nằm nghiêng trái khi ngủ sẽ làm tăng lượng máu và chất dinh dưỡng chuyển đến thai nhi, rất có lợi cho sự phát triển của thai nhi. Ngay từ bây giờ, bạn hãy tập cho mình tư thế ngủ nghiêng trái.',
      },
      {
        key: '20w5d',
        week: 20,
        dayInWeek: 5,
        content:
          'Lúc này, thai nhi vô cùng hiếu động. Bạn đừng ngồi quá lâu ở một tư thế có thể khiến bạn khó chịu hoặc mỏi cơ. Nếu nghiêm trọng, thậm chí sẽ dẫn tới trường hợp bé bị thiếu oxy. Hãy thay đổi tư thế và vận động nhẹ nhàng thường xuyên.',
      },
      {
        key: '20w6d',
        week: 20,
        dayInWeek: 6,
        content:
          'Tử cung to lên bắt đầu chèn ép phổi của bạn. Hơi thở của bạn trở nên gấp gáp hơn. Bạn sẽ thở dốc khi lên xuống cầu thang. Đây là điều bình thường, bạn có thể thử đi bộ chậm, vận động cơ thể.',
      },
    ],
  },
  21: {
    week: 21,
    emoji: '🧅',
    title: 'Tuần 21',
    days: [
      { key: '21w0d', week: 21, dayInWeek: 0, content: 'Bây giờ cân nặng của bạn tăng lên với mức 0,35kg mỗi tuần. Đây là dấu hiệu cho thấy thai nhi phát triển, bạn đừng lo lắng. Đây cũng là một niềm hạnh phúc rất khác biệt.' },
      { key: '21w1d', week: 21, dayInWeek: 1, content: 'Chức năng nghe của thai nhi đã hoàn thiện. Bây giờ có thể chính thức bắt đầu thai giáo bằng âm nhạc. Có thể lựa chọn thực hiện vào buổi sáng khi thức dậy và 5~10 phút vào buổi tối trước khi đi ngủ.' },
      { key: '21w2d', week: 21, dayInWeek: 2, content: 'Có thể bạn sẽ cảm thấy ngứa da, nổi mẩn đỏ nhỏ trên cơ thể. Đó là vì quá trình chuyển hóa bã nhờn diễn ra mạnh mẽ. Kiên trì tắm bằng nước ấm hằng ngày sẽ làm giảm bớt triệu chứng ngứa da.' },
      { key: '21w3d', week: 21, dayInWeek: 3, content: 'Khi đánh răng vào buổi sáng, nếu bạn thấy lợi bị chảy máu hoặc sưng tấy, bạn có thể chọn loại bàn chải trẻ em có lông mềm để giảm tổn thương do bàn chải gây ra cho lợi.' },
      { key: '21w4d', week: 21, dayInWeek: 4, content: 'Progesterone có tác dụng ở khắp các bộ phận. Ngón tay, ngón chân và dây chằng, khớp trên toàn bộ cơ thể bạn trở nên lỏng lẻo hơn. Hãy chuyển hướng sự chú ý và làm một số việc khiến bạn vui vẻ.' },
      { key: '21w5d', week: 21, dayInWeek: 5, content: 'Chóng mặt là hiện tượng thường gặp trong thời kỳ mang thai, thường xuyên chóng mặt có thể là do đường máu quá thấp. Bạn đừng tự ý uống thuốc, hãy kịp thời hỏi ý kiến bác sĩ, bác sĩ sẽ giúp bạn.' },
      { key: '21w6d', week: 21, dayInWeek: 6, content: 'Thai nhi đã lớn lên khá nhiều, luôn thích hoạt động không ngừng. Cử động thai đều đặn sẽ khiến bạn cảm nhận được thực sự sự tồn tại của bé. Niềm hạnh phúc được làm mẹ sẽ ngày càng mạnh mẽ hơn!' },
    ],
  },
  22: {
    week: 22,
    emoji: '🐟',
    title: 'Tuần 22',
    days: [
      { key: '22w0d', week: 22, dayInWeek: 0, content: 'Nếu hiện tại cân nặng của bạn mỗi tuần tăng ít hơn 0,2kg, bạn hãy tăng lượng chất dinh dưỡng hấp thụ vào cơ thể. Bạn hãy nhớ phải cân bằng chế độ ăn uống, đảm bảo sức khỏe dinh dưỡng cho bản thân bạn và thai nhi.' },
      { key: '22w1d', week: 22, dayInWeek: 1, content: 'Nếu da trở nên khô và thô ráp, bạn có thể sử dụng sữa dưỡng và kem dưỡng da mặt để dưỡng da. Bạn cố gắng không trang điểm đậm nhé.' },
      { key: '22w2d', week: 22, dayInWeek: 2, content: 'Bây giờ dưới sự hỗ trợ của máy nghe tim thai, bạn có thể nghe thấy tiếng nhịp tim thai rất mạnh mẽ. Có phải lần nghe tim thai này mang lại cho bạn một cảm giác rất diệu kỳ không?' },
      { key: '22w3d', week: 22, dayInWeek: 3, content: 'Khi thai nhi nhô lên tạo thành một khối nhỏ trên bụng bạn, bạn có thể vừa nói chuyện với bé, vừa đẩy nhẹ bé. Tin chắc rằng bé sẽ chơi đùa với bạn rất nhiệt tình.' },
      { key: '22w4d', week: 22, dayInWeek: 4, content: 'Ăn cá có rất nhiều công dụng. Cá giàu protein và axit béo, có thể giúp não khỏe mạnh, thúc đẩy sự phát triển đại não của thai nhi, đồng thời cũng giúp tăng cường trí nhớ.' },
      { key: '22w5d', week: 22, dayInWeek: 5, content: 'Vitamin A rất quan trọng cho sự phát triển của thai nhi. Bạn nên ưu tiên nguồn vitamin A từ rau củ màu xanh đậm, đỏ vàng; tránh bổ sung vitamin A liều cao nếu không có chỉ định bác sĩ.' },
      { key: '22w6d', week: 22, dayInWeek: 6, content: 'Đi dạo ngoài trời vào buổi sáng sớm hoặc tối không những có thể hít thở không khí trong lành mà còn ngăn ngừa được bệnh giãn tĩnh mạch và bệnh trĩ. Điều đó rất tốt đúng không nào!' },
    ],
  },
  23: {
    week: 23,
    emoji: '👶',
    title: 'Tuần 23',
    days: [
      { key: '23w0d', week: 23, dayInWeek: 0, content: 'Lúc này, chứng trầm cảm trước khi sinh có thể sẽ tới tìm bạn. Bạn phải duy trì tinh thần thoải mái, thư giãn, trò chuyện, trao đổi với người thân trong gia đình nhiều hơn để làm giảm chứng bệnh này.' },
      { key: '23w1d', week: 23, dayInWeek: 1, content: 'Nếu lúc này bạn thường xuyên bị chóng mặt, thậm chí là ngất xỉu, hoặc ngủ trưa trên 2 tiếng thì phải kịp thời báo cho bác sĩ. Triệu chứng này rất có khả năng là dấu hiệu của bệnh thiếu máu.' },
      { key: '23w2d', week: 23, dayInWeek: 2, content: 'Bây giờ chiều cao tử cung của bạn là 18~20cm. Vết lồi vô cùng rõ rệt. Mức độ đau lưng của bạn cũng từ từ tăng lên. Bạn phải chú ý nghỉ ngơi, tránh đứng lâu.' },
      { key: '23w3d', week: 23, dayInWeek: 3, content: 'Hai đùi của bạn có thể đã xuất hiện "sợi chỉ xanh". Đó chính là nguyên nhân của chứng giãn tĩnh mạch. Hãy chuẩn bị một đôi tất co giãn. Hãy đi đôi tất này vào mỗi buổi sáng sau khi thức dậy, bạn sẽ cảm thấy dễ chịu hơn nhiều.' },
      { key: '23w4d', week: 23, dayInWeek: 4, content: 'Bụng của bạn trở nên to hơn, giống như một quả dưa hấu. Trọng tâm của bạn sẽ hơi hướng về phía trước một chút. Bạn rất dễ bị ngã, đặc biệt là khi lên xuống cầu thang. Bạn phải đặc biệt cẩn thận nhé.' },
      { key: '23w5d', week: 23, dayInWeek: 5, content: 'Bạn sẽ nhận thấy rốn vốn lõm vào trong thì bây giờ bắt đầu nhô ra ngoài. Không sao đâu, đây là điều bình thường. Sau khi bạn sinh xong, rốn sẽ tự nhiên khôi phục lại trạng thái ban đầu.' },
      { key: '23w6d', week: 23, dayInWeek: 6, content: 'Thai nhi càng lúc càng nặng, bạn có thể chuẩn bị một sợi đai đỡ bụng. Nó có thể giảm bớt gánh nặng cho phần lưng của bạn.' },
    ],
  },
  24: {
    week: 24,
    emoji: '🍈',
    title: 'Tuần 24',
    days: [
      { key: '24w0d', week: 24, dayInWeek: 0, content: 'Tử cung của bạn đã vượt qua vị trí rốn rất xa. Ngay đến cả phần bụng trên cũng to lên. Bụng phình về phía trước với tốc độ nhanh. Nếu bạn cảm thấy cơ thể nặng nề hãy nghỉ ngơi nhiều một chút nhé!' },
      { key: '24w1d', week: 24, dayInWeek: 1, content: 'Nếu toàn bộ kết quả kiểm tra tuần trước đạt yêu cầu thì xin chúc mừng bạn, bạn hãy an tâm dưỡng thai nhé! Bạn phải làm theo lời khuyên của bác sĩ, giảm thiểu tối đa rủi ro cho bản thân và thai nhi.' },
      { key: '24w2d', week: 24, dayInWeek: 2, content: 'Bây giờ tử cung của bạn đã to gần bằng quả bóng rồi. Sự phát triển của thai nhi bước vào thời kỳ cao trào. Bạn cần ăn nhiều các loại thực phẩm tốt cho trí não như hạt óc chó, vừng, lạc v.v...' },
      { key: '24w3d', week: 24, dayInWeek: 3, content: 'Thai giáo vào thời điểm này có thể phong phú, đặc sắc hơn một chút. Bạn có thể kể cho thai nhi nghe về những điều bạn nhìn thấy, những sự việc thú vị mà bạn nghe thấy, bồi dưỡng khả năng cảm nhận và năng lực tư duy của thai nhi.' },
      { key: '24w4d', week: 24, dayInWeek: 4, content: 'Tử cung to lên chèn ép lên tĩnh mạch của khoang chậu, làm cho tình trạng giãn tĩnh mạch chi dưới ngày càng nghiêm trọng, bạn càng dễ bị táo bón và mắc bệnh trĩ. Bạn hãy ăn nhiều trái cây và rau xanh, đi đại tiện đúng giờ!' },
      { key: '24w5d', week: 24, dayInWeek: 5, content: 'Có thể bạn đã yêu thích việc được nằm nghỉ ngơi trên giường. Nhưng nếu thiếu vận động cần thiết trong giai đoạn này thì eo, bụng và cơ khoang chậu của bạn sẽ trở nên lỏng lẻo, yếu ớt. Bạn đừng lười biếng nhé!' },
      { key: '24w6d', week: 24, dayInWeek: 6, content: 'Do cơ sàn chậu căng liên tục, bây giờ bạn không dám cười to hay ho mạnh. Điều đó có thể khiến bạn bị tiểu són. Vậy thì bạn phải cố gắng dịu dàng hơn nhé!' },
    ],
  },
  25: {
    week: 25,
    emoji: '🥭',
    title: 'Tuần 25',
    days: [
      { key: '25w0d', week: 25, dayInWeek: 0, content: 'Cân nặng của bạn có lẽ đã tăng lên 5,9kg rồi. Tử cung cao khoảng 26cm. Do áp lực tâm lý quá lớn, có thể bạn sẽ mơ một vài giấc mơ kỳ lạ, bạn hãy cố gắng thả lỏng mình nhé!' },
      { key: '25w1d', week: 25, dayInWeek: 1, content: 'Bây giờ đùi của bạn trở nên thô, chân cũng trở nên to hơn. Đó không phải là vì bạn béo lên, rất có thể đó là chứng phù nề khi mang thai. Đi bộ với tốc độ vừa phải, massage đùi có thể làm giảm phù nề.' },
      { key: '25w2d', week: 25, dayInWeek: 2, content: 'Lúc này cơ thể bạn nặng nề hơn. Khi đi bộ bạn phải giữ cho lưng thẳng, hai mắt nhìn thẳng phía trước. Tư thế đi bộ đúng cách này có thể giúp giảm chứng đau lưng rất tốt.' },
      { key: '25w3d', week: 25, dayInWeek: 3, content: 'Ngoài phù nề, tay của bạn có thể cảm thấy đau nhức và tê. Bạn có thể nâng cao cánh tay để máu lưu thông trở lại, massage nhiều hơn cũng có hiệu quả.' },
      { key: '25w4d', week: 25, dayInWeek: 4, content: 'Bây giờ bạn có thể bắt tay chuẩn bị gói đồ đi sinh được rồi. Trong gói đồ đi sinh cần chuẩn bị đồ cho sản phụ và đồ dùng cần thiết cho trẻ sơ sinh. Bạn hãy liệt kê danh sách cẩn thận và chuẩn bị sớm nhé.' },
      { key: '25w5d', week: 25, dayInWeek: 5, content: 'Có phải bạn cảm thấy rất dễ bị khó thở không? Bạn đừng sợ, hãy ra ngoài đi bộ nhiều hơn, thả lỏng tâm lý căng thẳng, bạn sẽ dần thích nghi với nhịp thở hiện tại.' },
      { key: '25w6d', week: 25, dayInWeek: 6, content: 'Bây giờ cơ thể bạn vô cùng nặng nề. Khi tắm rửa cũng rất bất tiện. Lúc này đừng chọn cách tắm bồn, vì rất có thể nước bẩn sẽ đi vào âm đạo gây ra viêm nhiễm.' },
    ],
  },
  26: {
    week: 26,
    emoji: '🍇',
    title: 'Tuần 26',
    days: [
      { key: '26w0d', week: 26, dayInWeek: 0, content: 'Bây giờ bụng bạn đã to, bạn sẽ thường xuyên có cảm giác bị chuột rút ở bắp chân sau khi ngồi lâu hoặc khi đang ngủ. Điều này có thể do thiếu canxi. Bạn hãy nhớ bổ sung canxi kịp thời.' },
      { key: '26w1d', week: 26, dayInWeek: 1, content: 'Bạn có thể quan hệ tình dục vừa phải. Nhưng cần chú ý cường độ, vị trí và tần suất. Tuy nhiên, một số trường hợp như chảy máu, nhau tiền đạo, dọa sinh non hoặc bác sĩ khuyến cáo hạn chế cần thận trọng.' },
      { key: '26w2d', week: 26, dayInWeek: 2, content: 'Bây giờ bạn phải ăn nhiều loại ngũ cốc và các loại đậu một chút, vì thai nhi cần bổ sung protein và vitamin. Hơn nữa những loại thực phẩm này còn có thể ngăn ngừa táo bón.' },
      { key: '26w3d', week: 26, dayInWeek: 3, content: 'Bây giờ đã càng gần tới ngày sinh nở, bạn có thể đọc một số sách hoặc xem video về kiến thức sinh con, tìm hiểu thêm về quá trình sinh con, giảm căng thẳng và sợ hãi về việc sinh nở.' },
      { key: '26w4d', week: 26, dayInWeek: 4, content: 'Tư thế nằm ngủ nghiêng trái có thể giảm áp lực lên mạch máu lớn, có lợi cho việc hồi lưu ở tĩnh mạch đùi, cải thiện tuần hoàn máu, từ đó giảm phù nề!' },
      { key: '26w5d', week: 26, dayInWeek: 5, content: 'Cử động thai càng thường xuyên hơn. Có lúc bụng của bạn sẽ cuộn lên như sóng. Bạn đừng ngạc nhiên, bây giờ là thời kỳ đỉnh điểm của cử động thai.' },
      { key: '26w6d', week: 26, dayInWeek: 6, content: 'Cân nặng của bạn ngày càng tăng. Đôi chân đáng thương của bạn phải chịu áp lực rất lớn theo mỗi bước đi. Hãy dùng nước nóng để ngâm chân trước khi ngủ, nhân tiện massage chân cũng là một lựa chọn không tồi.' },
    ],
  },
  27: {
    week: 27,
    emoji: '🐱',
    title: 'Tuần 27',
    days: [
      { key: '27w0d', week: 27, dayInWeek: 0, content: 'Bụng của bạn đã lớn hơn. Bạn đã không thể nhìn thấy ngón chân của chính mình. Việc đi giày, thắt dây giày đã trở thành một vấn đề khó. Để đảm bảo an toàn, bạn hãy để ông bố tương lai làm thay bạn nhé.' },
      { key: '27w1d', week: 27, dayInWeek: 1, content: 'Bây giờ bạn có thể tiến hành thai giáo. Bạn có thể lựa chọn những bản nhạc nhẹ nhàng mà bản thân cảm thấy thư giãn. Điều quan trọng nhất là giúp mẹ cảm thấy thoải mái.' },
      { key: '27w2d', week: 27, dayInWeek: 2, content: 'Từ hôm nay, chúc mừng bạn đã bước vào "khoảng thời gian sinh". Trong khoảng thời gian này, bạn nhất định phải cẩn thận. Nếu phát sinh bất kỳ trường hợp bất thường nào đều phải tới bệnh viện để điều trị.' },
      { key: '27w3d', week: 27, dayInWeek: 3, content: 'Lúc này, bạn nên bổ sung omega-3 (đặc biệt DHA) và các axit béo thiết yếu để hỗ trợ sự phát triển não bộ và thị giác của bé. Cá biển sâu ít thủy ngân, quả óc chó, dầu vừng… là những lựa chọn phù hợp.' },
      { key: '27w4d', week: 27, dayInWeek: 4, content: 'Lúc này bạn cần chú ý hơn tới việc chăm sóc sức khỏe bầu ngực và chăm sóc núm vú, tạo nền tảng cho việc nuôi con bằng sữa mẹ sau sinh. Bạn hãy chọn áo ngực phù hợp, bảo vệ mô bầu ngực đang tăng lên.' },
      { key: '27w5d', week: 27, dayInWeek: 5, content: 'Bây giờ, thông thường cân nặng có tăng 500g mỗi tuần. Nếu bạn quá cân hoặc không tăng cân thì đều là hiện tượng bất thường. Bạn nên tới bệnh viện kiểm tra.' },
      { key: '27w6d', week: 27, dayInWeek: 6, content: 'Để ngăn ngừa hiện tượng chuột rút ở bắp chân, bạn nên loại bỏ hoàn toàn giày cao gót. Khi đi ngủ, hai đùi đừng duỗi quá thẳng. Tư thế "ngủ hình vòng cung" là tốt nhất.' },
    ],
  },
  28: {
    week: 28,
    emoji: '🧠',
    title: 'Tuần 28',
    days: [
      { key: '28w0d', week: 28, dayInWeek: 0, content: 'Bây giờ tử cung của bạn cao khoảng 28cm, sẽ chèn ép tim và dạ dày về phía sau. Bạn sẽ có cảm giác chướng bụng. Không sao, bạn hãy ăn ít và ăn thành nhiều bữa là được rồi.' },
      { key: '28w1d', week: 28, dayInWeek: 1, content: 'Cùng với sự phát triển ngày càng mạnh mẽ của thai nhi, gánh nặng đối với tim của bạn đang ngày càng lớn dần. Huyết áp bắt đầu tăng cao. Bạn phải nhớ đo huyết áp của mình định kỳ.' },
      { key: '28w2d', week: 28, dayInWeek: 2, content: 'Nước ối quá nhiều, quá ít đều ảnh hưởng xấu tới sự phát triển của thai nhi. Nếu nước ối quá nhiều ở mức độ nhẹ thì không cần điều trị đặc biệt. Nếu tăng cực nhanh thì phải lập tức đi khám bác sĩ.' },
      { key: '28w3d', week: 28, dayInWeek: 3, content: 'Thai nhi bắt đầu có khả năng học nhất định. Thai giáo bằng ngôn ngữ và âm nhạc là điều không thể thiếu. Hãy để ông bố tương lai cùng tham gia, thai nhi sẽ càng thích hơn.' },
      { key: '28w4d', week: 28, dayInWeek: 4, content: 'Do các loại hormone do hệ nội tiết bài tiết ra kích thích niêm mạc mũi. Bạn sẽ có hiện tượng lỗ mũi thông kém hoặc chảy máu mũi v.v... Trường hợp này sẽ tự nhiên biến mất sau khi sinh.' },
      { key: '28w5d', week: 28, dayInWeek: 5, content: 'Thai nhi không ngừng thay đổi tư thế trong bụng bạn. Bạn đừng quá lo lắng về vị trí thai. Nếu cần điều chỉnh, trước khi sinh, bác sĩ đã hướng dẫn bạn một cách phù hợp.' },
      { key: '28w6d', week: 28, dayInWeek: 6, content: 'Vận động phù hợp trong thời gian này sẽ giúp quá trình sinh diễn ra thuận lợi. Bạn có thể ngồi trên đệm, gập và duỗi hai chân, nằm ngửa ra, vặn nhẹ xương chậu. Nhưng cần lưu ý mức độ thực hiện phải nhẹ nhàng.' },
    ],
  },
  29: {
    week: 29,
    emoji: '🌙',
    title: 'Tuần 29',
    days: [
      { key: '29w0d', week: 29, dayInWeek: 0, content: 'Lúc này chiều cao tử cung của bạn khoảng 29cm, dễ xuất hiện trường hợp phù nề. Bạn cần duy trì thói quen vận động phù hợp, tránh đứng hoặc ngồi lâu.' },
      { key: '29w1d', week: 29, dayInWeek: 1, content: 'Sự diệu kỳ của những câu chuyện thần thoại có thể nuôi dưỡng trí tưởng tượng và khả năng sáng tạo cho bé rất tốt. Bạn hãy kiên trì kể cho thai nhi nghe một câu chuyện thần thoại mà bạn đã chuẩn bị rất tâm huyết nhé!' },
      { key: '29w2d', week: 29, dayInWeek: 2, content: 'Lúc này, bạn có thể cảm thấy bụng căng, cứng lên từng hồi, không có quy luật, cũng không có cảm giác đau. Đây là quá trình luyện tập của cơ tử cung. Bạn không cần phải lo lắng.' },
      { key: '29w3d', week: 29, dayInWeek: 3, content: 'Bạn sẽ nhận thấy tình trạng huyết trắng của mình càng ngày càng nhiều. Hãy chú ý chăm sóc và bảo vệ. Nếu cảm thấy ngứa âm hộ, màu sắc huyết trắng thay đổi, có mùi hôi thì bạn phải đến bệnh viện để kiểm tra kịp thời.' },
      { key: '29w4d', week: 29, dayInWeek: 4, content: 'Bạn cần hấp thụ nhiều protein, vitamin C, sắt và canxi, đảm bảo hấp thụ mỗi ngày 1000mg canxi. Điều này rất quan trọng cho sự phát triển xương của thai nhi.' },
      { key: '29w5d', week: 29, dayInWeek: 5, content: 'Thời khắc khó khăn và hạnh phúc bắt đầu đến rồi. Bụng bạn to và không nhìn thấy chân, cơ thể ngày càng nặng nề, khó thở. Bạn cần chú ý nghỉ ngơi nhiều hơn. Tốt nhất bạn nên ngủ trưa mỗi ngày.' },
      { key: '29w6d', week: 29, dayInWeek: 6, content: 'Tên của bé là món quà đầu tiên bạn mang đến cho cuộc đời bé. Ngày nào bé cũng lật qua, lật lại, chắc chắn là bé cũng đang thấy chán, vì sao mình là không có tên nhỉ? Hãy mau đặt tên cho bé nào.' },
    ],
  },
  30: {
    week: 30,
    emoji: '💪',
    title: 'Tuần 30',
    days: [
      { key: '30w0d', week: 30, dayInWeek: 0, content: 'Cân nặng của bạn tăng rất nhiều. Bụng của bạn nhô ra nhiều hơn. Trong vài tuần tới, bụng của bạn còn tiếp tục nặng hơn. Bạn hãy chú ý đừng để bản thân trở thành mẹ mập nhé.' },
      { key: '30w1d', week: 30, dayInWeek: 1, content: 'Bạn nhận thấy cử động thai giảm đi. Bạn đừng lo lắng, điều này là do không gian hoạt động của thai nhi đã trở nên hẹp hơn. Chỉ cần bạn cảm thấy thai nhi thỉnh thoảng cử động trong bụng bạn, điều đó có nghĩa là bé vẫn rất ổn.' },
      { key: '30w2d', week: 30, dayInWeek: 2, content: 'Bạn luôn cảm thấy khó thở, thở không ra hơi, sau khi ăn xong luôn cảm thấy dạ dày khó chịu? Điều này là do tử cung nâng lên đến đầu trên cùng của bụng. Phải mất khoảng 3 tuần hiện tượng này mới được cải thiện.' },
      { key: '30w3d', week: 30, dayInWeek: 3, content: 'Bây giờ bạn lại bắt đầu đi ra, đi vào nhà vệ sinh thường xuyên như trong tam cá nguyệt đầu tiên. Điều này là do tử cung trở nên to hơn, chèn ép lên bàng quang, bạn chỉ cần lưu ý không nhịn tiểu.' },
      { key: '30w4d', week: 30, dayInWeek: 4, content: 'Làn da của một số bà mẹ tương lai trở nên nhạy cảm, ngứa gần thắt lưng, mô dưới da dày lên. Nếu bạn cũng gặp hiện tượng này thì hãy cố gắng tránh gãi. Nếu thực sự không thể chịu đựng được thì hãy tới bệnh viện khám.' },
      { key: '30w5d', week: 30, dayInWeek: 5, content: 'Màu da quanh rốn, bụng dưới và âm hộ của bạn có phải càng lúc càng sẫm màu hơn phải không? Vết rạn da trên cơ thể và các vết nám lốm đốm trên mặt đã rõ ràng hơn phải không? Bạn đừng sợ. Đó là điều bình thường. Tình trạng này sẽ được cải thiện hơn sau khi sinh.' },
      { key: '30w6d', week: 30, dayInWeek: 6, content: 'Những ngày này, có thể bạn nhận thấy bầu ngực mình to ra. Đó là cơ thể bạn đang chuẩn bị cho việc nuôi con bằng sữa mẹ sau sinh. Thay áo ngực cho con bú cỡ lớn hơn sẽ giúp bạn thấy thoải mái hơn một chút.' },
    ],
  },
  31: {
    week: 31,
    emoji: '⭐',
    title: 'Tuần 31',
    days: [
      { key: '31w0d', week: 31, dayInWeek: 0, content: 'Mức tăng cân tốt của bạn trong tuần này phải trong khoảng 0,3~0,5kg. Cân nặng của bạn sẽ tiếp tục tăng trong vài tuần tới. Do đó hãy kiên trì đo cân nặng. Bạn cố gắng lên nhé!' },
      { key: '31w1d', week: 31, dayInWeek: 1, content: 'Việc khám thai tuần này chủ yếu là chú ý đến sự phát triển của thai nhi, theo dõi xem các cơ quan của thai nhi đã đạt chuẩn chưa. Bạn phải nghe kỹ lời khuyên của bác sĩ nhé.' },
      { key: '31w2d', week: 31, dayInWeek: 2, content: 'Bụng phình ra sẽ làm trọng tâm của bạn di chuyển về phía trước hơn nữa, khiến cử động của bạn trở nên nặng nề. Bạn phải đặc biệt chú ý đến an toàn. Không đi bộ hoặc tập thể dục quá sức.' },
      { key: '31w3d', week: 31, dayInWeek: 3, content: 'Lúc này thai nhi dễ có nguy cơ bị dây rốn quấn cổ. Bạn có thể phán đoán tình hình bằng cách đo cử động thai. Nếu cử động thai trong 2 giờ dưới 6 lần thì bạn cần đi khám kịp thời.' },
      { key: '31w4d', week: 31, dayInWeek: 4, content: 'Tử cung to ra, chèn ép lên dạ dày. Thức ăn trong dạ dày trào ngược, do đó bạn có thể bị ợ nóng. Triệu chứng này sẽ kéo dài liên tục một tuần. Ăn ít và chia thành nhiều bữa có lẽ sẽ giúp bạn cải thiện triệu chứng này.' },
      { key: '31w5d', week: 31, dayInWeek: 5, content: 'Thai nhi bắt đầu tụt xuống vùng xương chậu, bạn sẽ cảm thấy vô cùng đau ở xương chậu và phần gốc của đùi. Số lần đi vệ sinh tăng lên. Vì con yêu, bạn hãy cố gắng lên nhé!' },
      { key: '31w6d', week: 31, dayInWeek: 6, content: 'Các khớp bị sưng tấy, dây chằng lỏng lẻo. Giai đoạn này bạn sẽ cảm thấy rất khó chịu. Để giảm sưng đau khớp ngón tay và khớp ngón chân, bạn có thể nhờ ông bố tương lai massage thật nhiều.' },
    ],
  },
  32: {
    week: 32,
    emoji: '🥦',
    title: 'Tuần 32',
    days: [
      { key: '32w0d', week: 32, dayInWeek: 0, content: 'Tuần này, cân nặng tăng khoảng 0,5kg so với tuần trước. Bụng nặng khiến bạn không muốn vận động và cảm thấy mệt mỏi. Hãy kiên trì nào! Vận động một chút sẽ giúp sinh nở thuận lợi.' },
      { key: '32w1d', week: 32, dayInWeek: 1, content: 'Bạn sẽ nhận thấy dịch tiết âm đạo trở nên nhiều hơn. Đau thắt lưng rõ rệt hơn. Đây là điều bình thường. Bạn có thể phân tán sự chú ý của mình một cách hợp lý. Hãy tưởng tượng ra em bé dễ thương trong bụng bạn nào.' },
      { key: '32w2d', week: 32, dayInWeek: 2, content: 'Gần đây, tình trạng phù nề chi dưới của bạn ngày càng nghiêm trọng. Dùng ngón tay ấn vào phía trước bắp chân, phải mất một lúc vết lõm mới đàn hồi trở lại. Nhưng nếu có hiện tượng sưng tấy phía trên đùi thì bạn phải đi khám kịp thời.' },
      { key: '32w3d', week: 32, dayInWeek: 3, content: 'Giai đoạn này tình cảm giữa mẹ và con là thân thiết nhất. Bạn có thể kể chuyện, thủ thỉ những câu chuyện gia đình, hoặc hát cho thai nhi nghe để tăng thêm tình cảm thân thiết giữa bạn và bé.' },
      { key: '32w4d', week: 32, dayInWeek: 4, content: 'Khi có thời gian, bạn có thể vận động một chút để giúp quá trình sinh nở của mình diễn ra thuận lợi. Nhưng không nên tham gia vận động mạnh. Đi bộ, tập thái cực quyền sẽ là lựa chọn đúng đắn cho bạn.' },
      { key: '32w5d', week: 32, dayInWeek: 5, content: 'Thai nhi bắt đầu dần dần di chuyển xuống khoang chậu. Dạ dày của bạn sẽ dễ chịu hơn rất nhiều. Lúc này bạn nên ăn nhiều thực phẩm chứa protein động vật có giá trị dinh dưỡng cao, bổ sung đầy đủ canxi, photpho và sắt.' },
      { key: '32w6d', week: 32, dayInWeek: 6, content: 'Lúc này bầu ngực bạn có thể tiết sữa non. Đừng lo lắng, bạn có thể đặt miếng lót thấm sữa để tránh những tình huống khó xử trong cuộc sống hàng ngày.' },
    ],
  },
  33: {
    week: 33,
    emoji: '🌡️',
    title: 'Tuần 33',
    days: [
      { key: '33w0d', week: 33, dayInWeek: 0, content: 'Bây giờ, các cơn co thắt tử cung giả của bạn sẽ tăng lên, liên tục khoảng một phút, mỗi ngày khoảng bảy, tám lần, nhưng sẽ không có cảm giác đau rõ rệt. Nếu quá 4 lần mỗi giờ thì bạn phải đi khám.' },
      { key: '33w1d', week: 33, dayInWeek: 1, content: 'Lúc này, chức năng tiêu hóa của bạn suy giảm, cộng thêm với sự chèn ép của tử cung sẽ dễ gây táo bón. Bạn có thể lựa chọn ăn nhiều thực phẩm giàu chất xơ như ngũ cốc, rau xanh v.v...' },
      { key: '33w2d', week: 33, dayInWeek: 2, content: 'Lúc này phần lớn đầu của bé đã lọt vào khung xương chậu. Nếu thai nhi chưa quay đầu thì bạn phải áp dụng biện pháp chỉnh lại dưới sự hướng dẫn của bác sĩ.' },
      { key: '33w3d', week: 33, dayInWeek: 3, content: 'Bạn có thể cảm thấy có cảm giác chèn ép ở các vị trí như khoang chậu, bàng quang, thậm chí là cảm giác "như kim châm". Đi được vài bước là bạn đã cảm thấy mệt mỏi. Vì thế đừng để bản thân quá mệt.' },
      { key: '33w4d', week: 33, dayInWeek: 4, content: 'Có phải bạn thỉnh thoảng nhìn thấy thai nhi đang chuyển động từ bên ngoài bụng mình không? Lúc này, bạn hãy nằm nghiêng bên trái. Điều này sẽ giúp giảm áp lực lên xương chậu, các dây thần kinh, mạch máu quanh xương chậu.' },
      { key: '33w5d', week: 33, dayInWeek: 5, content: 'Cơ thể ngày càng nặng nề và cách ngày dự sinh càng ngày càng gần khiến tâm trạng của bạn khó tránh khỏi cảm giác sốt ruột, không yên. Bạn có thể nói chuyện nhiều hơn với ông bố tương lai để giảm bớt tâm trạng căng thẳng.' },
      { key: '33w6d', week: 33, dayInWeek: 6, content: 'Nếu xuất hiện các cơn co tử cung bất ngờ và thường xuyên, khoảng 10 phút một lần, mỗi lần khoảng 30 giây thì bạn nhất định phải đến bệnh viện để khám ngay, không được chậm trễ.' },
    ],
  },
  34: {
    week: 34,
    emoji: '🌈',
    title: 'Tuần 34',
    days: [
      { key: '34w0d', week: 34, dayInWeek: 0, content: 'Tuần này, cơ thể bạn trông nặng nề hơn, rốn nhô ra khỏi da. Cố lên nào, bạn đã gần ngày sinh thêm một bước rồi đấy!' },
      { key: '34w1d', week: 34, dayInWeek: 1, content: 'Ra máu hồng hoặc dịch nhầy lẫn máu có thể là dấu hiệu sắp chuyển dạ. Nếu chảy máu nhiều như kinh nguyệt hoặc nhiều hơn, cần đi khám ngay.' },
      { key: '34w2d', week: 34, dayInWeek: 2, content: 'Thai nhi lọt vào vùng xương chậu sẽ ảnh hưởng đến nhu động ruột của bạn, thường gây ra táo bón và trĩ. Bạn không được tự ý uống thuốc hoặc sử dụng thuốc bôi ngoài da. Bạn cần hỏi ý kiến bác sĩ trước.' },
      { key: '34w3d', week: 34, dayInWeek: 3, content: 'Khi thai nhi lớn lên và sa xuống, bạn sẽ cảm thấy bụng trĩu xuống và đau lưng. Cơ và dây chằng phần sau xương chậu bị trở nên tê, có cảm giác đau như kéo, sẽ hơi khó chịu một chút. Bạn phải cố gắng lên nhé.' },
      { key: '34w4d', week: 34, dayInWeek: 4, content: 'Có thể bạn ngày càng nhạy cảm hơn. Thai nhi cử động nhiều hơn một chút hoặc ít hơn một chút đều ảnh hưởng đến thần kinh của bạn. Quá lo lắng đều không có lợi cho bản thân bạn và thai nhi. Bạn hãy nhớ giữ tâm trạng thoải mái nhé!' },
      { key: '34w5d', week: 34, dayInWeek: 5, content: 'Càng đến gần ngày dự sinh, bạn càng cần duy trì cách ăn uống và thói quen ăn uống điều độ. Ăn một ít thịt, rau và hoa quả, chú ý kết hợp dinh dưỡng.' },
      { key: '34w6d', week: 34, dayInWeek: 6, content: 'Thành tử cung và thành bụng của bạn bây giờ trở nên rất mỏng, thậm chí có thể nhìn thấy tay và bàn chân của thai nhi qua thành bụng. Có phải là thật thần kỳ không?' },
    ],
  },
  35: {
    week: 35,
    emoji: '🌟',
    title: 'Tuần 35',
    days: [
      { key: '35w0d', week: 35, dayInWeek: 0, content: 'Trong thời gian tiếp theo đây, bạn phải khám thai mỗi tuần một lần. Vì bạn có thể bị vỡ ối, đau và sinh em bé bất cứ lúc nào. Bạn nên tránh ra ngoài một mình hoặc đi chơi xa.' },
      { key: '35w1d', week: 35, dayInWeek: 1, content: 'Rốn của bạn vừa to, vừa lồi ra ngoài. Tuần này sẽ phải tiến hành siêu âm chi tiết một lần để đánh giá cân nặng và sự phát triển của thai nhi, đồng thời dự kiến cân nặng khi sinh đủ tháng.' },
      { key: '35w2d', week: 35, dayInWeek: 2, content: 'Các cơn co thắt tử cung giả của bạn trở nên mạnh hơn, vì vậy bạn có thể nhầm là bắt đầu chuyển dạ, nhưng bạn cần học cách phân biệt. Các cơn co thắt tử cung thật sẽ mạnh hơn, thường xuyên hơn và đều đặn hơn.' },
      { key: '35w3d', week: 35, dayInWeek: 3, content: 'Lúc này các hoạt động của thai nhi không mạnh và thường xuyên như trước, nhưng bạn không được lười biếng, phải kiên trì đếm cử động thai. Nếu có bất thường thì phải hỏi ý kiến của bác sĩ kịp thời.' },
      { key: '35w4d', week: 35, dayInWeek: 4, content: 'Gần đến kỳ sinh nở, bạn phải chú ý an toàn. Khi làm việc nhà, bạn phải làm nhẹ nhàng, chậm rãi. Không được thực hiện những động tác nguy hiểm.' },
      { key: '35w5d', week: 35, dayInWeek: 5, content: 'Lúc này bạn sẽ dễ mệt mỏi hơn. Ngoài việc đảm bảo giấc ngủ đêm 8 tiếng mỗi ngày, bạn cũng nên ngủ trưa khoảng 1 tiếng.' },
      { key: '35w6d', week: 35, dayInWeek: 6, content: 'Vị trí đáy tử cung dần dần hạ xuống. Nửa thân trên của bạn trở nên nhẹ nhàng, thở cũng dần dễ chịu hơn. Nếu thai nhi chưa tụt vào vùng xương chậu, bạn cũng phải kiên nhẫn chờ đợi nhé.' },
    ],
  },
  36: {
    week: 36,
    emoji: '🍼',
    title: 'Tuần 36 — Gần Ngày Sinh',
    days: [
      { key: '36w0d', week: 36, dayInWeek: 0, content: 'Cân nặng của bạn đã tăng khoảng 12kg, về cơ bản đã đạt mức đỉnh điểm. Bụng bạn rất to và rất nặng, có thể nhìn thấy rốn nhô ra.' },
      { key: '36w1d', week: 36, dayInWeek: 1, content: 'Nếu bổ sung thiếu sắt, sau sinh em bé dễ bị thiếu máu do thiếu sắt. Bổ sung đủ canxi và sắt rất quan trọng cho sức khỏe của mẹ và sự phát triển của bé!' },
      { key: '36w2d', week: 36, dayInWeek: 2, content: 'Nhẹ nhàng massage bầu ngực mỗi ngày không chỉ có thể làm mềm bầu ngực, làm cho ống dẫn sữa thông suốt, tiết sữa mạnh mà còn kích thích núm vú và quầng vú, thuận tiện cho bé bú. Bạn nhớ kiên trì nhé!' },
      { key: '36w3d', week: 36, dayInWeek: 3, content: 'Khi đầu em bé hạ xuống, kéo cổ tử cung, bạn sẽ cảm thấy như thể em bé sắp rơi ra ngoài. Trên thực tế, vẫn còn cách ngày bé chào đời một chút thời gian nữa. Hãy chuyển hướng sự chú ý của bạn một cách hợp lý nhé.' },
      { key: '36w4d', week: 36, dayInWeek: 4, content: 'Áp lực lên bàng quang ngày càng lớn. Bạn đi vào nhà vệ sinh hết lần này đến lần khác. Nhưng lượng nước cần thiết vẫn rất quan trọng. Bạn đừng cố hạn chế uống nước nhé.' },
      { key: '36w5d', week: 36, dayInWeek: 5, content: 'Bạn đã chuẩn bị sẵn sàng để sinh con rồi chứ? Hãy kiên nhẫn một chút nào. Thai nhi vẫn cần được bổ sung dinh dưỡng. Ăn nhiều bữa trong ngày và ăn ít trong một bữa vẫn rất tốt cho bạn.' },
      { key: '36w6d', week: 36, dayInWeek: 6, content: 'Bạn có thể sinh bất cứ lúc nào. Bạn nhất định phải kiểm tra xem gói đồ đi sinh có thiếu gì không, đặc biệt là những giấy tờ cần khi nằm viện như căn cước công dân, hồ sơ sinh v.v... là không thể bỏ sót nhé.' },
    ],
  },
  37: {
    week: 37,
    emoji: '🎉',
    title: 'Tuần 37 — Sẵn Sàng Sinh',
    days: [
      { key: '37w0d', week: 37, dayInWeek: 0, content: 'Tuần này cân nặng của bạn tăng không nhiều phải không? Nhưng các cơn co thắt tử cung thường xuyên hơn so với tuần trước, hơn nữa cảm giác chướng bụng dưới cũng rõ rệt hơn. Bạn cố gắng lên nhé!' },
      { key: '37w1d', week: 37, dayInWeek: 1, content: 'Hôm nay, bạn có thể cùng ông bố tương lai cùng tìm hiểu về môi trường trong phòng bệnh và phòng sinh, học các kiến thức sinh sản đúng đắn và thiết thực. Điều này sẽ giúp bạn thư giãn hơn.' },
      { key: '37w2d', week: 37, dayInWeek: 2, content: 'Khi tiếp tục thực hiện thai giáo, bạn có thể tiếp tục kể chuyện cho thai nhi nghe, giao tiếp bằng ngôn ngữ với thai nhi. Bạn hãy nhớ truyền năng lượng tích cực cho thai nhi nhé.' },
      { key: '37w3d', week: 37, dayInWeek: 3, content: 'Trong khoảng thời gian gần ngày sinh, bạn cần cố gắng tránh quan hệ tình dục. Vì sự kích thích của ngoại lực dễ dẫn đến co bóp tử cung, đồng thời việc quan hệ tình dục cũng sẽ làm tăng xác suất lây nhiễm bệnh cho thai nhi.' },
      { key: '37w4d', week: 37, dayInWeek: 4, content: 'Càng gần đến kỳ sinh nở, bạn càng không thể để xảy ra sai sót trong chế độ ăn uống của mình. Bạn cần phải ăn uống khoa học và đủ dinh dưỡng. Bạn đừng uống đồ uống có ga nhé!' },
      { key: '37w5d', week: 37, dayInWeek: 5, content: 'Việc sinh nở không đáng sợ như bạn nghĩ. Bạn có thể chia sẻ cảm xúc của mình với những người mới làm mẹ, tiếp thu kinh nghiệm. Bạn đừng làm cho bản thân lo lắng hơn nhé. Cố gắng lên nào!' },
      { key: '37w6d', week: 37, dayInWeek: 6, content: 'Bây giờ bạn phải nhớ thư giãn, kiên nhẫn chờ đợi. Bạn có thể nghiêm túc nghiên cứu về quá trình sinh nở, chuẩn bị sẵn sàng tâm lý.' },
    ],
  },
  38: {
    week: 38,
    emoji: '🌺',
    title: 'Tuần 38',
    days: [
      { key: '38w0d', week: 38, dayInWeek: 0, content: 'Lúc này cân nặng của bạn có thể vẫn tăng lên. Thai nhi đã phát triển đầy đủ và có thể chào đời bất cứ lúc nào.' },
      { key: '38w1d', week: 38, dayInWeek: 1, content: 'Bạn đã bước vào giai đoạn nước rút cuối cùng. Các cơn co thắt tử cung giả xuất hiện ngày càng thường xuyên hơn, thời gian kéo dài và cường độ cũng tăng lên. Nhưng bạn vẫn phải dựa vào sự chỉ dẫn của những cơn co thắt tử cung thật nhé.' },
      { key: '38w2d', week: 38, dayInWeek: 2, content: 'Việc sinh nở bình thường của bạn cần các yếu tố trên nhiều phương diện, trong đó cũng bao gồm cả thể lực. Vì vậy trước khi sinh bạn nên ăn nhiều thực phẩm giàu chất dinh dưỡng.' },
      { key: '38w3d', week: 38, dayInWeek: 3, content: 'Nếu tinh thần của bạn đã rơi vào trạng thái căng thẳng, bạn có thể nghe thêm vài bản nhạc nhẹ nhàng, trữ tình. Không biết chừng lúc này em bé còn hồi hộp hơn bạn đấy!' },
      { key: '38w4d', week: 38, dayInWeek: 4, content: 'Khi bạn ở trạng thái chuyển dạ, bạn có thể muốn dựa vào người khác nhiều hơn, lúc nào bạn cũng muốn người khác quan tâm đến mình. Chi bằng bạn hãy nhõng nhẽo với ông bố tương lai để giảm bớt tâm trạng lo lắng của mình đi.' },
      { key: '38w5d', week: 38, dayInWeek: 5, content: 'Sau khi sinh xong, bạn không được tắm ngay, vì vậy hãy tắm trước khi nhập viện. Nếu vào nhà tắm để tắm, phải có người đi cùng để tránh hơi nước dẫn tới ngất xỉu.' },
      { key: '38w6d', week: 38, dayInWeek: 6, content: 'Sắp đến ngày dự sinh, thai nhi có thể chào đời bất cứ lúc nào nên bạn cố gắng đừng đi xa. Nhưng cũng không được nằm trên giường nghỉ ngơi cả ngày.' },
    ],
  },
  39: {
    week: 39,
    emoji: '🕊️',
    title: 'Tuần 39',
    days: [
      { key: '39w0d', week: 39, dayInWeek: 0, content: 'Để dự trữ năng lượng cần thiết cho quá trình sinh nở, lúc này bạn có thể tăng số bữa ăn lên hơn 5 bữa mỗi ngày, với nguyên tắc là ăn ít và chia thành nhiều bữa.' },
      { key: '39w1d', week: 39, dayInWeek: 1, content: 'Để quá trình sinh nở diễn ra thuận lợi hơn, bạn đừng lười biếng. Lúc này, bạn có thể thực hiện thêm các bài tập vận động hỗ trợ sinh. Ví dụ, leo cầu thang chậm, vừa phải và tập thể dục mỗi ngày.' },
      { key: '39w2d', week: 39, dayInWeek: 2, content: 'Lúc này bạn có thể ăn thêm một số loại thực phẩm hỗ trợ sinh. Như thế có thể giúp bạn sinh nở thuận lợi hơn. Ví dụ như tảo biển, cá biển, trái cây tươi, giá đỗ, v.v.' },
      { key: '39w3d', week: 39, dayInWeek: 3, content: 'Nếu ăn không ngon, ngủ không ngon, tâm trạng căng thẳng có thể dẫn đến các tình trạng nguy hiểm như đờ tử cung, sinh khó, băng huyết sau sinh v.v... Vì vậy, bạn phải tiếp tục ăn uống đầy đủ và ngủ ngon nhé. Cố gắng lên nào!' },
      { key: '39w4d', week: 39, dayInWeek: 4, content: 'Bây giờ, về cơ bản thai nhi đang ở trạng thái rất ngoan. Nếu thai nhi cử động rất mạnh, mà không có dấu hiệu chuyển dạ thì bạn nên đến bệnh viện để kiểm tra và điều trị ngay.' },
      { key: '39w5d', week: 39, dayInWeek: 5, content: 'Nếu bạn dự định nuôi con bằng sữa mẹ, hãy nhớ chuẩn bị áo ngủ hoặc áo lót cài cúc trước. Như thế sẽ dễ mặc và dễ dàng cho bé bú hơn.' },
      { key: '39w6d', week: 39, dayInWeek: 6, content: 'Kiểm tra gói đồ đi sinh, xem đã có đầy đủ các vật dụng cần thiết khi nhập viện và xuất viện chưa. Việc lập kế hoạch chi tiết về tuyến đường khi chuyển dạ cũng là điều rất quan trọng.' },
    ],
  },
  40: {
    week: 40,
    emoji: '🎊',
    title: 'Tuần 40 — Ngày Dự Sinh',
    days: [
      { key: '40w0d', week: 40, dayInWeek: 0, content: 'Tuần này, cơ thể và tinh thần của bạn đã sẵn sàng. Hành trình 10 tháng mang thai đầy gian truân, vất vả, cuối cùng cũng tới ngày sinh nở. Bạn hãy chào đón con yêu với tâm trạng tốt nhất nhé!' },
      { key: '40w1d', week: 40, dayInWeek: 1, content: 'Bây giờ, nếu bạn xuất hiện cơn đau dưới 30 phút, bạn phải đến bệnh viện để chuẩn bị chờ sinh. Hãy nghe theo lời khuyên của bác sĩ và chào đón sự xuất hiện của con yêu.' },
      { key: '40w2d', week: 40, dayInWeek: 2, content: 'Lúc này, bạn nên ăn nhiều thực phẩm giàu năng lượng như giàu protein, các loại đường v.v... nhé! Bạn phải tích trữ nhiều năng lượng hơn nữa và bạn cần chú ý giảm bớt tâm lý căng thẳng cho bản thân.' },
      { key: '40w3d', week: 40, dayInWeek: 3, content: 'Trong vài ngày cuối của thai kỳ, tình trạng phù nề của bạn có thể tiếp tục nghiêm trọng hơn. Bạn hãy massage hai chân khi ngủ để giảm bớt tình trạng phù nề nhé.' },
      { key: '40w4d', week: 40, dayInWeek: 4, content: 'Nếu bây giờ em bé vẫn chưa có dấu hiệu chào đời, bạn phải tăng cường vận động. Vận động ở tư thế đứng thẳng sẽ giúp em bé đi vào khung xương chậu, nhưng bạn phải có người đi cùng khi vận động nhé.' },
      { key: '40w5d', week: 40, dayInWeek: 5, content: 'Bụng to lên sẽ khiến việc đi lại của bạn vô cùng bất tiện. Trước khi em bé chào đời, nguyên tắc khi đi lại của bạn là: An toàn là số 1!' },
      { key: '40w6d', week: 40, dayInWeek: 6, content: 'Dịch tiết tử cung của bạn tăng lên. Đây là một triệu chứng bình thường trước khi sinh. Bạn hãy thay quần lót hàng ngày, chú ý vệ sinh sạch sẽ thì sẽ không có vấn đề gì lớn cả.' },
    ],
  },
  41: {
    week: 41,
    emoji: '⏳',
    title: 'Tuần 41',
    days: [
      { key: '41w0d', week: 41, dayInWeek: 0, content: 'Bây giờ bạn có thể dành thời gian để tập bài tập thở đúng cách cho sản phụ. Điều này có thể giúp bạn tác dụng lực một cách chính xác trong quá trình sinh, đảm bảo sinh nở diễn ra thuận lợi.' },
      { key: '41w1d', week: 41, dayInWeek: 1, content: 'Nếu bây giờ em bé vẫn chưa có dấu hiệu chào đời, hãy nghe theo lời khuyên của bác sĩ, thực hiện phương pháp giục sinh chính xác. Bạn hãy cố gắng để được gặp con yêu sớm nhé!' },
      { key: '41w2d', week: 41, dayInWeek: 2, content: 'Trước khi chuyển dạ, cơ thể bạn sẽ có một số thay đổi như: tức ngực, bụng căng, đau lưng. Nếu bạn có những biểu hiện này, bạn cần đến ngay bệnh viện để chuẩn bị sinh.' },
      { key: '41w3d', week: 41, dayInWeek: 3, content: 'Chờ đợi trong căng thẳng và lo lắng có thể khiến bạn mất ngủ. Bạn có thể cùng chồng ra ngoài đi dạo, ngâm chân trước khi đi ngủ, uống một cốc sữa nóng v.v... Những cách này đều có thể giúp giảm chứng mất ngủ một cách hiệu quả.' },
      { key: '41w4d', week: 41, dayInWeek: 4, content: 'Bụng của bạn lúc này vô cùng lớn, đi lại sẽ rất bất tiện. Nhưng so với tâm trạng vừa mong đợi, vừa hơi căng thẳng thì sự bất tiện về cơ thể chỉ là vấn đề nhỏ.' },
      { key: '41w5d', week: 41, dayInWeek: 5, content: 'Trước khi chuyển dạ, sẽ có các cảm giác khó chịu khác nhau. Nếu thời tiết đẹp, bạn có thể ra ngoài đi dạo. Đi bộ khoa học cũng có thể đạt được hiệu quả giục sinh. Có phải là thật tuyệt vời không!' },
      { key: '41w6d', week: 41, dayInWeek: 6, content: 'Lúc này chắc là bạn đang chờ đón con yêu với tâm trạng vừa hồi hộp và háo hức. Nếu bạn cảm thấy bụng đau từng hồi, liên tục, có thể bạn sắp sinh rồi.' },
    ],
  },
  42: {
    week: 42,
    emoji: '🌸',
    title: 'Tuần 42',
    days: [{ key: '42w0d', week: 42, dayInWeek: 0, content: 'Trước khi sinh, bạn nên tranh thủ ăn và ngủ nhiều. Hãy nhớ rằng sinh nở không đáng sợ. Khi sinh, bạn đừng la hét, giữ sức mới là điều quan trọng nhất. Như thế quá trình sinh nở sẽ diễn ra thuận lợi hơn.' }],
  },
};
