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
    week: 0,
    emoji: '🌱',
    title: 'Tuần 0',
    days: [
      {
        key: '0w1d',
        week: 0,
        dayInWeek: 1,
        content:
          'Mẹ ơi, hiện giờ con vẫn chưa tồn tại. Con đang ở dạng tinh trùng và trứng sống trong cơ thể bố và mẹ. Bố và mẹ hãy cố gắng lên, để con được mau mau di chuyển vào tử cung của mẹ nhé.',
      },
      {
        key: '0w2d',
        week: 0,
        dayInWeek: 2,
        content:
          'Mẹ ơi, mẹ có biết không? Từ khi mẹ sinh ra, trứng đã ở trong cơ thể mẹ rồi. Mẹ không nhìn thấy nó và cũng không chạm được vào nó. Nhưng tuổi của trứng bằng với tuổi của mẹ đấy.',
      },
      {
        key: '0w3d',
        week: 0,
        dayInWeek: 3,
        content:
          'Mẹ ơi, các nang trứng trong buồng trứng của mẹ đang bắt đầu phát triển rồi. Mặc dù mẹ có khoảng 2 triệu nang trứng nguyên thủy trong cuộc đời, nhưng cuối cùng chỉ có khoảng 500 trứng rụng thôi.',
      },
      {
        key: '0w4d',
        week: 0,
        dayInWeek: 4,
        content:
          'Mẹ ơi, con cho mẹ biết chút kiến thức nhỏ nhé. Chu kỳ rụng trứng của buồng trứng hai bên là 28 ngày. Thông thường mỗi tháng chỉ rụng 1 trứng trưởng thành, có phải là rất quý giá không?',
      },
      {
        key: '0w5d',
        week: 0,
        dayInWeek: 5,
        content:
          'Mẹ ơi, trứng là tế bào lớn nhất trong cơ thể phụ nữ với đường kính khoảng 0,1mm. So với các tế bào khác, thời gian hình thành của trứng dài hơn, thời gian sống cũng lâu hơn.',
      },
      {
        key: '0w6d',
        week: 0,
        dayInWeek: 6,
        content:
          'Mẹ ơi, nang trứng chính trong buồng trứng của mẹ đang phát triển với tốc độ khác nhau mỗi ngày. Đến ngày thứ 14, nang trứng sẽ có kích thước lớn nhất. Khi nang trứng trưởng thành, trứng sẽ rụng. Mẹ phải tiếp tục cố gắng lên!',
      },
    ],
  },
  1: {
    week: 1,
    emoji: '🥚',
    title: 'Tuần 1',
    days: [
      {
        key: '1w0d',
        week: 1,
        dayInWeek: 0,
        content:
          'Trứng đang phát triển sẽ kết hợp với 1 trong số hàng ngàn, hàng vạn tinh trùng. Mẹ ơi, bây giờ con cảm thấy hơi háo hức một chút, vì con sắp được gặp mẹ rồi!',
      },
      {
        key: '1w1d',
        week: 1,
        dayInWeek: 1,
        content:
          'Mẹ ơi, bố có thể xuất ra khoảng 200 triệu tinh trùng trong một lần xuất tinh, trong đó có khoảng 1 triệu tinh trùng sẽ đến tranh giành 1 trứng. Cuộc cạnh tranh này rất khốc liệt đúng không ạ?',
      },
      {
        key: '1w2d',
        week: 1,
        dayInWeek: 2,
        content:
          'Mẹ ơi, trong nang trứng chứa lượng chất nhầy phong phú, khi trứng chín, chất nhầy sẽ được một số enzyme hấp thụ, trứng sẽ rụng ra ngoài. Sau đó, trứng sẽ đi vào vòi trứng, chờ đợi gặp tinh trùng.',
      },
      {
        key: '1w3d',
        week: 1,
        dayInWeek: 3,
        content:
          'Trong thời kỳ rụng trứng, progesterone sẽ làm cổ tử cung giãn nở, mở ra dễ dàng, đồng thời sinh ra nhiều chất nhầy tạo điều kiện cho tinh trùng đi vào. Con đã rất nóng lòng muốn được gặp mẹ rồi.',
      },
      {
        key: '1w4d',
        week: 1,
        dayInWeek: 4,
        content:
          'Có khoảng hơn 100-300 triệu tinh trùng trong tinh dịch do bố phóng ra, "đội ngũ" đông đảo này "chen lấn" bơi ngược dòng trong cơ thể mẹ.',
      },
      {
        key: '1w5d',
        week: 1,
        dayInWeek: 5,
        content:
          'Mẹ ơi, trứng chỉ có thể sống được 12~36 giờ. Nếu không kịp kết hợp với tinh trùng để tạo thành trứng được thụ tinh thì trứng sẽ chết. Nếu mẹ vẫn muốn có thai, chỉ có thể đợi 1 tháng sau.',
      },
      {
        key: '1w6d',
        week: 1,
        dayInWeek: 6,
        content:
          'Các lông mao quét trứng vào miệng dạng phễu của vòi trứng. Vòi trứng vận chuyển trứng đến tử cung. Tử cung chính là "nhà" của con trong 10 tháng tới đấy!',
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
          'Tinh trùng không ngừng trưởng thành trong cơ thể bố, một số ít tinh trùng sẽ di chuyển về phía trước, đi qua ống cổ tử cung và khoang tử cung, đến vòi trứng, chờ gặp trứng.',
      },
      {
        key: '2w1d',
        week: 2,
        dayInWeek: 1,
        content:
          'Mẹ ơi, trong cơ thể mẹ đang diễn ra một cuộc đua khốc liệt. Các tinh trùng đang xâm nhập với tốc độ vũ bão, trứng sẽ chọn 1 trong số chúng làm bạn, cùng nhau tạo thành trứng được thụ tinh.',
      },
      {
        key: '2w2d',
        week: 2,
        dayInWeek: 2,
        content:
          'Mẹ ơi, thông thường thì 1~1,5 giờ, nhanh nhất chỉ cần vài phút là một lượng nhỏ tinh trùng có thể đi từ âm đạo đến vòi trứng. Chậm nhất thì chúng cũng đến nơi sau 4~6 giờ.',
      },
      {
        key: '2w3d',
        week: 2,
        dayInWeek: 3,
        content:
          'Sự cạnh tranh giữa các tinh trùng vô cùng khốc liệt, chỉ có tinh trùng nhanh nhất, mạnh nhất, giỏi nhất mới có thể kết hợp được với trứng. Chất lượng tinh trùng quyết định con có thông minh hay không.',
      },
      {
        key: '2w4d',
        week: 2,
        dayInWeek: 4,
        content:
          'Trứng được bao quanh bởi nhóm tế bào cumulus, tinh trùng phải phá vỡ vòng vây trùng trùng điệp điệp này, làm tan chảy tế bào cumulus mới có thể gặp được trứng.',
      },
      {
        key: '2w5d',
        week: 2,
        dayInWeek: 5,
        content:
          'Phần đầu của tinh trùng vào trứng trước, rồi trứng kéo tinh trùng vào, còn phần đuôi của tinh trùng ở bên ngoài. Sau đó, bề mặt trứng sẽ hình thành màng bảo vệ, ngăn các tinh trùng khác xâm nhập.',
      },
      {
        key: '2w6d',
        week: 2,
        dayInWeek: 6,
        content:
          'Trải qua vô vàn khó khăn, cuối cùng tinh trùng và trứng cũng kết hợp thành trứng được thụ tinh. Vòi trứng sẽ cung cấp chất dinh dưỡng cho quá trình thụ tinh và sự phát triển phôi thai trong giai đoạn sớm, đồng thời chịu trách nhiệm vận chuyển trứng được thụ tinh vào trong tử cung.',
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
          'Mẹ có biết không? Tế bào trứng được thụ tinh đã trải qua 3~4 lần phân chia. Từ 2 tế bào ban đầu phân chia thành 16 tế bào, được liên kết chặt chẽ thành một hình cầu nhỏ chắc chắn.',
      },
      {
        key: '3w1d',
        week: 3,
        dayInWeek: 1,
        content:
          'Mẹ ơi, bây giờ là giai đoạn làm tổ, phôi nang bám trên bề mặt tử cung, chờ chui vào bên trong. Có thể mẹ sẽ ra một ít máu nhạt. Điều đó chứng tỏ con đã nằm trong bụng mẹ rồi.',
      },
      {
        key: '3w2d',
        week: 3,
        dayInWeek: 2,
        content:
          'Phôi nang được cấy vào tử cung, kết hợp chặt chẽ với tử cung, dần dần phát triển thành phôi thai. Tiếp theo, con sẽ tự tạo cho mình một môi trường độc lập để con có thể phát triển, vui chơi.',
      },
      {
        key: '3w3d',
        week: 3,
        dayInWeek: 3,
        content:
          'Túi ối sắp xuất hiện rồi. Túi ối có hai lớp màng, con ở màng trong. Xung quanh con là nước ối. Màng ngoài là màng đệm, bao lấy màng trong, là một phần của nhau thai.',
      },
      {
        key: '3w4d',
        week: 3,
        dayInWeek: 4,
        content:
          'Nhau thai đang trong quá trình hình thành. Bây giờ con vẫn phải nhờ mẹ vận chuyển dinh dưỡng trong máu của mẹ đến nhau thai. Như thế con mới có đủ chất.',
      },
      {
        key: '3w5d',
        week: 3,
        dayInWeek: 5,
        content:
          'Lúc này, con vẫn chỉ là một khối nhỏ hình bầu dục. Có một lớp lông tơ bao phủ xung quanh con, truyền chất dinh dưỡng và oxy cho con, đồng thời lớp này còn chịu trách nhiệm nặng nề là thải chất thải.',
      },
      {
        key: '3w6d',
        week: 3,
        dayInWeek: 6,
        content:
          'Mô nhau thai sinh ra các chất như hormone và protein đặc hiệu mà con cần. Hệ thống tuần hoàn máu của con đã bước đầu hình thành. Mẹ yên tâm, con đang lớn rất nhanh.',
      },
    ],
  },
  4: {
    week: 4,
    emoji: '🌿',
    title: 'Tuần 4 — Phôi Thai',
    days: [
      {
        key: '4w0d',
        week: 4,
        dayInWeek: 0,
        content:
          'Tế bào nhau thai giúp con vận chuyển máu. Nước ối có tác dụng bảo vệ con khi con lớn lên và phát triển. Túi noãn hoàng sẽ tạo ra hồng cầu và vận chuyển chất dinh dưỡng cho con. Mẹ ơi, mẹ và con cùng cố gắng nhé!',
      },
      {
        key: '4w1d',
        week: 4,
        dayInWeek: 1,
        content:
          'Tuần này, con bước vào thời kỳ phôi thai rồi. Phôi thai gồm nội bì, trung bì và ngoại bì. Trong tương lai, ba lớp bì phôi này sẽ trở thành các cơ quan và mô cơ thể khác nhau của con.',
      },
      {
        key: '4w2d',
        week: 4,
        dayInWeek: 2,
        content:
          'Con đang tiếp tục lớn lên, bây giờ con còn kéo theo một cái đuôi dài, hình dạng rất giống một chú cá ngựa nhỏ. Ngoài ra, hệ thần kinh như não, tủy sống, v.v. và cơ quan thận cũng bắt đầu phát triển.',
      },
      {
        key: '4w3d',
        week: 4,
        dayInWeek: 3,
        content:
          'Con kết nối với mẹ qua dây rốn. Trong dây rốn có một tĩnh mạch và hai động mạch. Lúc này, đã có thể phân biệt được phần đầu và phần đuôi của con rồi.',
      },
      {
        key: '4w4d',
        week: 4,
        dayInWeek: 4,
        content:
          'Mẹ ơi, hệ thần kinh trung ương của con đang phát triển. Phần đầu ngày càng hoàn thiện. Tế bào "dây sống" đã dần tập hợp và hình thành trong đầu con, sau này nó sẽ phát triển thành tuỷ sống của con!',
      },
      {
        key: '4w5d',
        week: 4,
        dayInWeek: 5,
        content:
          'Cơ thể của con bắt đầu duỗi ra dần dần. Tuy thận của con đang phát triển, nhưng chưa có chức năng trao đổi chất. Trong một thời gian dài trong tương lai, con vẫn phải dựa vào nhau thai để thực hiện công việc trao đổi chất hàng ngày.',
      },
      {
        key: '4w6d',
        week: 4,
        dayInWeek: 6,
        content:
          'Nhau thai thực sự bắt đầu hình thành. Hệ thần kinh trung ương trong đại não con đang phát triển. Các tế bào não cũng đang được tạo ra nhanh chóng. Mẹ ơi, con sắp có ý thức rồi.',
      },
    ],
  },
  5: {
    week: 5,
    emoji: '💓',
    title: 'Tuần 5 — Tim Bắt Đầu Đập',
    days: [
      {
        key: '5w0d',
        week: 5,
        dayInWeek: 0,
        content:
          'Bây giờ đầu con rất to, 4 ngăn trong tim đang phát triển. Lồng ngực và khoang bụng cũng đang từng bước hình thành. Nhưng mẹ vẫn chưa thể nghe thấy tiếng tim con đập.',
      },
      {
        key: '5w1d',
        week: 5,
        dayInWeek: 1,
        content:
          'Con đã lớn bằng một hạt hướng dương rồi. Hệ thống mạch máu đang hình thành, máu bắt đầu tuần hoàn. Trên cái đầu to của con xuất hiện hai chấm đen nhỏ xíu. Đây chính là mắt của con.',
      },
      {
        key: '5w2d',
        week: 5,
        dayInWeek: 2,
        content:
          'Nhau thai ngày càng làm việc vất vả hơn, không ngừng truyền chất dinh dưỡng và oxy cho con, giúp con loại bỏ chất thải. Đồng thời, cánh tay và đùi của con bắt đầu phát triển.',
      },
      {
        key: '5w3d',
        week: 5,
        dayInWeek: 3,
        content:
          'Mẹ ơi, con báo cho mẹ tin vui nhé. Mặc dù hiện giờ cơ thể con vẫn còn ở dạng cong cong, nhưng động mạch chủ của con đã hình thành, tim cũng bắt đầu vận chuyển máu và chất dinh dưỡng đến các cơ quan rồi!',
      },
      {
        key: '5w4d',
        week: 5,
        dayInWeek: 4,
        content:
          'Lồng ngực và khoang bụng của con đã phân tách xong, các cơ quan nội tạng như phổi, ruột, tuyến tụy, dạ dày bắt đầu phát triển. Thần kinh và cột sống đang hình thành. Con đang từ từ lớn lên!',
      },
      {
        key: '5w5d',
        week: 5,
        dayInWeek: 5,
        content:
          'Mẹ ơi, bây giờ về cơ bản, gan của con đã hình thành, và tuyến giáp của con cũng đang nỗ lực phát triển một cách ngoan ngoãn. Điều thú vị là hai cánh tay của con trông như hai cái vây cá. Mẹ có thấy dễ thương không?',
      },
      {
        key: '5w6d',
        week: 5,
        dayInWeek: 6,
        content:
          'Mẹ ơi, bây giờ tim con bắt đầu đập rồi, tim sẽ vận chuyển máu tươi và chất dinh dưỡng đến các cơ quan.',
      },
    ],
  },
  6: {
    week: 6,
    emoji: '👁️',
    title: 'Tuần 6 — Hình Dáng Người',
    days: [
      {
        key: '6w0d',
        week: 6,
        dayInWeek: 0,
        content:
          'Bây giờ con đã lớn gấp 1000 lần so với ban đầu. Trông con giống như một quả nho khô! Con thích uốn mình thành chữ C và cố gắng tập nổi trong nước ối.',
      },
      {
        key: '6w1d',
        week: 6,
        dayInWeek: 1,
        content:
          'Các lớp da của con bắt đầu hình thành, ngũ quan trên khuôn mặt dần dần hiện ra, có thể nhìn thấy mờ mờ đường nét miệng, mí mắt, lỗ mũi. Các mô bên trong khoang miệng và mô lympho cũng bắt đầu phát triển.',
      },
      {
        key: '6w2d',
        week: 6,
        dayInWeek: 2,
        content:
          'Đại não của con đã tiến hóa thành 3 phần là não trước, não giữa và não sau, nhưng đại não và phần đầu vẫn cần phải tiếp tục phát triển một thời gian nữa. Và môi của con cũng bắt đầu xuất hiện rồi.',
      },
      {
        key: '6w3d',
        week: 6,
        dayInWeek: 3,
        content:
          'Tim của con đang hình thành các ngăn. Loa tai, mí mắt, núm vú và môi trên của con đều đã thành hình. Mẹ ơi, con đang cố gắng trở nên đẹp hơn, để sau này gặp mẹ.',
      },
      {
        key: '6w4d',
        week: 6,
        dayInWeek: 4,
        content:
          'Da của con dần dần phát triển hoàn chỉnh, đã có thể phân biệt được mặt, miệng, mắt, tai. Tay, đùi, chân, thậm chí cả ngón tay, ngón chân cũng bắt đầu xuất hiện. Điều vui mừng là con sắp có xúc giác rồi!',
      },
      {
        key: '6w5d',
        week: 6,
        dayInWeek: 5,
        content:
          'Mẹ ơi, bây giờ cơ và sụn của con bắt đầu phát triển, các cơ quan như ruột, gan, tuyến tụy, v.v. cũng đã có hình dạng nhất định. Mẹ hãy yên tâm, con sẽ cố gắng lớn thật nhanh!',
      },
      {
        key: '6w6d',
        week: 6,
        dayInWeek: 6,
        content:
          'Hàm trên và hàm dưới của con đã xuất hiện rồi. Mô tuyến vú bắt đầu phát triển. Bây giờ con có thể chuyển động trong tử cung. Mẹ có thể nhìn thấy con qua siêu âm rồi nhé!',
      },
    ],
  },
  7: {
    week: 7,
    emoji: '🫐',
    title: 'Tuần 7 — Bằng Quả Việt Quất',
    days: [
      {
        key: '7w0d',
        week: 7,
        dayInWeek: 0,
        content:
          'Bây giờ con đã lớn bằng một quả việt quất. "Cái đuôi" dài trước đây của con sắp biến mất rồi. Bây giờ ngón tay, chân của con giống như màng chân của chú vịt nhỏ, có phải là trông rất dễ thương không ạ?',
      },
      {
        key: '7w1d',
        week: 7,
        dayInWeek: 1,
        content:
          'Thời gian gần đây, khung xương và hệ thống thính giác của con đã bước đầu hình thành rồi, nhưng giờ con vẫn chưa nghe được giọng nói của mẹ. Con sẽ cố gắng hơn mẹ ạ!',
      },
      {
        key: '7w2d',
        week: 7,
        dayInWeek: 2,
        content:
          'Các tế bào não của con phát triển nhanh chóng, đặc biệt nhạy cảm với các thông tin từ cơ thể mẹ truyền tới. Đầu của con vẫn còn rất lớn, chiếm một nửa cơ thể con. Mắt của con cũng đang trong quá trình phát triển.',
      },
      {
        key: '7w3d',
        week: 7,
        dayInWeek: 3,
        content:
          'Vòm miệng của con tiếp tục phát triển, răng, hàm và cơ mặt của con bắt đầu hình thành. Xương cứng dần, giúp nâng đỡ tay chân và phần đầu.',
      },
      {
        key: '7w4d',
        week: 7,
        dayInWeek: 4,
        content:
          'Con đã bước đầu thành hình người rồi. Tim, não, gan, phổi, thận đang phát triển nhanh chóng, nhịp đập của tim có xu hướng bình thường hóa, khả năng bơm máu đã được nâng cao rất nhiều.',
      },
      {
        key: '7w5d',
        week: 7,
        dayInWeek: 5,
        content:
          'Mẹ ơi, con bắt đầu biết "đi tiểu" rồi. Cơ quan sinh sản bên ngoài bắt đầu phát triển, nhưng vẫn chưa nhìn ra hình dạng, dây rốn cũng đã hình thành rồi!',
      },
      {
        key: '7w6d',
        week: 7,
        dayInWeek: 6,
        content:
          'Cánh tay và cẳng chân nhỏ bé của con đang lớn lên vô cùng nhanh chóng. Khoang miệng phát triển tốt, đã bắt đầu mọc mầm răng sữa rồi, nụ vị giác cũng bắt đầu phát triển!',
      },
    ],
  },
  8: {
    week: 8,
    emoji: '🫧',
    title: 'Tuần 8 — Bằng Quả Mâm Xôi',
    days: [
      {
        key: '8w0d',
        week: 8,
        dayInWeek: 0,
        content:
          'Bây giờ con đã lớn bằng một quả mâm xôi, ngũ quan trên khuôn mặt đầy đủ, đầu to và tròn, tim và khoang bụng về cơ bản đã hình thành, tuyến nước bọt của đường tiêu hóa, v.v. cũng đều đã phát triển.',
      },
      {
        key: '8w1d',
        week: 8,
        dayInWeek: 1,
        content:
          'Xúc giác của con phát triển rất sớm, thính giác cũng rất nhạy cảm, nhưng vì trong tử cung tối, nên con vẫn cần một thời gian nữa mới có thể học được cách chớp mắt.',
      },
      {
        key: '8w2d',
        week: 8,
        dayInWeek: 2,
        content:
          'Lỗ mũi và chóp mũi của con bắt đầu mọc ra, nhưng các ngón chân vẫn dính vào nhau, như màng chân của chú vịt nhỏ đáng yêu. Điều đáng mừng là con sắp nghe được giọng nói của mẹ rồi!',
      },
      {
        key: '8w3d',
        week: 8,
        dayInWeek: 3,
        content:
          'Bề mặt đại não của con vẫn trơn và phẳng, có rất ít nếp nhăn và rãnh. Nhưng hệ nội tiết đã bắt đầu phát triển, niệu quản đã hình thành. Dùng phương pháp siêu âm còn có thể nghe thấy tiếng tim đập của con!',
      },
      {
        key: '8w4d',
        week: 8,
        dayInWeek: 4,
        content:
          'Mũi và miệng con đang phát triển. Trên phần đỉnh khoang miệng của con, vòm miệng ban đầu đang hình thành. Con bắt đầu thử uốn cong khuỷu tay và cổ tay của mình. Các cơ quan nội tạng của con cũng đang trong quá trình phát triển.',
      },
      {
        key: '8w5d',
        week: 8,
        dayInWeek: 5,
        content:
          '"Cái đuôi nhỏ" của con về cơ bản đã biến mất, tay chân bắt đầu trở nên dài hơn. Xương, cơ và khớp đều dần dần mọc ra. Các cơ quan trong cơ thể ngày càng phong phú hơn.',
      },
      {
        key: '8w6d',
        week: 8,
        dayInWeek: 6,
        content:
          'Lúc này, con là một em bé đáng yêu, thông minh, lanh lợi. Da của con mỏng và trong suốt, đã có khả năng xúc giác cơ bản. Hệ thần kinh trung ương cũng đang phát triển nhanh chóng!',
      },
    ],
  },
  9: {
    week: 9,
    emoji: '🧠',
    title: 'Tuần 9 — Có Phản Xạ Thần Kinh',
    days: [
      {
        key: '9w0d',
        week: 9,
        dayInWeek: 0,
        content:
          'Mẹ ơi, con nói cho mẹ một tin vui nhé, "cái đuôi nhỏ" của con đã biến mất rồi, các ngón tay và ngón chân con đều có thể phân biệt rõ ràng. Bây giờ con đã có phản xạ thần kinh, con thích vận động cơ thể trong nước ối.',
      },
      {
        key: '9w1d',
        week: 9,
        dayInWeek: 1,
        content:
          'Có lẽ mẹ sẽ không tưởng tượng được, bây giờ con là một em búp bê đầu to, nhưng con cũng đang cố gắng cao lên. Các cơ quan trên cơ thể con đều đã có hình dạng sơ khai! Đó có phải là một việc rất vui không ạ?',
      },
      {
        key: '9w2d',
        week: 9,
        dayInWeek: 2,
        content:
          'Mẹ ơi, bây giờ tim con đập mạnh rồi. Trong "căn nhà nhỏ" tối tăm, xúc giác của con phát triển nhanh chóng để sớm có thể tương tác và chơi với mẹ.',
      },
      {
        key: '9w3d',
        week: 9,
        dayInWeek: 3,
        content:
          'Khuỷu tay và đầu gối của con bắt đầu thử uốn cong rồi. Các hoạt động của cơ thể con trở nên linh hoạt hơn. Dưới sự che chở cẩn thận của mẹ, con đang luyện tập các kỹ năng mới là vươn người và ngáp. Mẹ hãy cổ vũ cho con nào!',
      },
      {
        key: '9w4d',
        week: 9,
        dayInWeek: 4,
        content:
          'Hệ thần kinh của con phát triển rất nhanh, có thể phản ứng đơn giản lại với kích thích từ thế giới bên ngoài, nhưng mẹ tạm thời chưa cảm nhận được điều đó. Răng sữa của con cũng bắt đầu mọc, nhưng chúng đều nằm dưới lợi!',
      },
      {
        key: '9w5d',
        week: 9,
        dayInWeek: 5,
        content:
          'Mẹ ơi, giờ ngũ quan trên khuôn mặt con đã thành hình rồi, không biết con giống bố hay giống mẹ hơn? Mặc dù tỷ lệ cơ thể của con vẫn chưa cân đối, nhưng mẹ đừng lo lắng, con đang cố gắng lớn lên.',
      },
      {
        key: '9w6d',
        week: 9,
        dayInWeek: 6,
        content:
          'Mẹ ơi, hình dáng khuôn mặt con ngày càng trở nên lập thể. Đôi mắt to tròn dần dần di chuyển vào giữa. Con trở nên ngày càng xinh đẹp hơn. Cánh tay con cũng phát triển rất nhanh, đã có thể phân biệt được cẳng tay, khuỷu tay và ngón tay.',
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
          'Xương hộp sọ phía trán bắt đầu phát triển và dần cứng lại, giúp bảo vệ cái đầu nhỏ của con. Nhiều cơ quan nội tạng của con bắt đầu hoạt động, không ngừng nghỉ lúc nào.',
      },
      {
        key: '10w1d',
        week: 10,
        dayInWeek: 1,
        content:
          'Mẹ ơi, tuy da con vẫn trong suốt, nhưng đã dần dần trở nên dày hơn. Sức lực của cơ thể cũng ngày càng mạnh mẽ. Dạo gần đây, con thích nhất là vươn vai, tập thể dục trong căn nhà nhỏ.',
      },
      {
        key: '10w2d',
        week: 10,
        dayInWeek: 2,
        content:
          'Bây giờ, tim con đập mạnh mẽ hơn, giống như một chú ngựa đang phi nước kiệu. Hệ tiêu hóa của con cũng đang phát triển nhanh chóng. Con hiện có thể hấp thụ glucose rồi!',
      },
      {
        key: '10w3d',
        week: 10,
        dayInWeek: 3,
        content:
          'Cơ thể của con đang phát triển nhanh chóng, cổ cũng trở nên cứng cáp hơn, sắp có thể nâng đỡ được cái đầu nhỏ của con rồi. Ngũ quan trên khuôn mặt của con ngày càng trở nên rõ nét, đang dần dần mang lại cho con nhiều khả năng khác nhau.',
      },
      {
        key: '10w4d',
        week: 10,
        dayInWeek: 4,
        content:
          'Dây rốn bắt đầu quấn lại cùng với sự di chuyển và phát triển của con, nhưng con biết tự tháo nó. Không ai chơi cùng con, dây rốn là người bạn tốt nhất của con. Lực từ tay chân của con bây giờ cũng không yếu nữa.',
      },
      {
        key: '10w5d',
        week: 10,
        dayInWeek: 5,
        content:
          'Mặc dù xương và cơ của con phát triển nhanh chóng, nhưng đại não còn phát triển nhanh hơn. Mặc dù bây giờ con vẫn chưa thể suy nghĩ, nhưng con đã bắt đầu chuẩn bị từ rất sớm rồi.',
      },
      {
        key: '10w6d',
        week: 10,
        dayInWeek: 6,
        content:
          'Con bắt đầu mọc lông mày và rất nhiều lông trên cơ thể. Lỗ mũi của con cũng hình thành để có thể thở bằng mũi sau khi chào đời. Bây giờ con đang hô hấp qua dây rốn, vì thế con không bị sặc nước ối.',
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
          'Mắt và tai của con đã rất rõ nét. Cấu trúc mắt cũng trở nên phức tạp hơn, chỉ có điều tạm thời con vẫn chưa thể cảm nhận được ánh sáng từ thế giới bên ngoài. Con còn biết lộn nhào, vươn vai. Thật giỏi phải không ạ!',
      },
      {
        key: '11w1d',
        week: 11,
        dayInWeek: 1,
        content:
          'Các đặc trưng trên khuôn mặt của con đã phát triển thành hình. Lúc này, con và mẹ bắt đầu có điểm gần giống nhau. Hai mắt con di chuyển về giữa, tai con cũng gần đến vị trí bình thường.',
      },
      {
        key: '11w2d',
        week: 11,
        dayInWeek: 2,
        content:
          'Mô ở nhiều cơ quan của con về cơ bản đã hình thành. Khả năng tiêu hóa thức ăn đã có từ rất sớm nên con có thể mút và bú sữa ngay sau khi sinh, nhưng mí mắt của con vẫn nhắm chặt.',
      },
      {
        key: '11w3d',
        week: 11,
        dayInWeek: 3,
        content:
          'Tủy xương của con bắt đầu tạo máu. Rất nhiều tế bào bạch cầu có khả năng chống lại vi khuẩn đều đã được phân chia, bảo vệ cơ thể yếu ớt của con. Các mô cơ quan khác cũng bắt đầu hoạt động. Con cũng bận rộn lắm đấy!',
      },
      {
        key: '11w4d',
        week: 11,
        dayInWeek: 4,
        content:
          'Con đã bắt đầu đi tiểu, hơn nữa còn đi tiểu trực tiếp vào nước ối. Nhưng nước tiểu của con rất sạch. Phản xạ có điều kiện của con ngày càng tốt hơn. Con sắp có thể tương tác với mẹ rồi.',
      },
      {
        key: '11w5d',
        week: 11,
        dayInWeek: 5,
        content:
          'Nhịp tim của con đã rất rõ ràng. Lúc mẹ đi khám thai, mẹ có nghe thấy không? Nhau thai đã hình thành, dây rốn sẽ truyền chất dinh dưỡng của mẹ vào trong cơ thể con, giúp con phát triển khỏe mạnh.',
      },
      {
        key: '11w6d',
        week: 11,
        dayInWeek: 6,
        content:
          'Móng tay, tóc và lợi của răng sữa đều tăng lên nhanh chóng, phát triển một cách mạnh mẽ. Con còn biết làm nhiều động tác đáng yêu nữa. Mẹ đã nhìn thấy con qua siêu âm khi mẹ khám thai chưa ạ?',
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
          'Bây giờ, lúc nào con cũng cuộn tròn cơ thể mình, như thế con cảm thấy rất an toàn, ngủ cũng rất ngon. Con còn biết làm nhiều động tác như mở miệng, ngáp, nuốt, v.v., nhưng có lẽ là con hơi lười nhác.',
      },
      {
        key: '12w1d',
        week: 12,
        dayInWeek: 1,
        content:
          'Cánh tay và cẳng chân của con đã phát triển. Tất cả các khớp đã hình thành. Khả năng hoạt động càng lúc càng mạnh mẽ hơn. Cổ của con có thể nâng đỡ phần đầu. Bàn tay cũng có thể nắm chặt, ngón chân có thể uốn cong.',
      },
      {
        key: '12w2d',
        week: 12,
        dayInWeek: 2,
        content:
          'Khả năng tạo máu của con rất linh hoạt, ngũ quan trên khuôn mặt rõ nét, dấu vân tay xinh xắn cũng bắt đầu phát triển. Dây thanh âm của con đang hình thành, nhưng con vẫn chưa thể phát ra âm thanh.',
      },
      {
        key: '12w3d',
        week: 12,
        dayInWeek: 3,
        content:
          'Ngón chân của con đã tách ra. Mắt cá chân đã phát triển hoàn thiện. Tai con đã dựng lên, da hơi mỏng, mỡ cũng bắt đầu xuất hiện, mặt mũi con ngày càng xinh rồi nhé.',
      },
      {
        key: '12w4d',
        week: 12,
        dayInWeek: 4,
        content:
          'Đầu của con hơi nhô ra, màu da đỏ hơn và cũng dày hơn. Đại não của con vẫn đang tiếp tục phát triển nhanh chóng. Nhãn cầu bắt đầu di chuyển qua lại và trở nên nhạy cảm với ánh sáng.',
      },
      {
        key: '12w5d',
        week: 12,
        dayInWeek: 5,
        content:
          'Trên mặt con đã mọc lông mịn. 20 chiếc răng sữa trong lợi và ổ răng cũng đã hình thành. Gan của con bắt đầu tiết ra mật, tuyến tụy cũng bắt đầu sản sinh ra insulin.',
      },
      {
        key: '12w6d',
        week: 12,
        dayInWeek: 6,
        content:
          'Da con dày lên, màu sắc hồng hào, trơn bóng và trong suốt. Nhịp tim của con đập mạnh hơn. Đến cả dấu vân tay cũng sắp phát triển hoàn chỉnh rồi. Đây là chứng minh thư độc nhất vô nhị của con.',
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
          'Tỷ lệ thân hình của con cân đối hơn, các đặc trưng trên khuôn mặt rất rõ nét. Môi con có thể khép mở. Cổ đã thành hình hoàn thiện và có thể đỡ cho phần đầu hoạt động. Con thường xuyên lật người, nhưng mẹ vẫn chưa cảm nhận được điều đó.',
      },
      {
        key: '13w1d',
        week: 13,
        dayInWeek: 1,
        content:
          'Gan, thận, lá lách của con vẫn đang tiếp tục phát triển, có thể nhìn thấy rõ xương của con qua phương pháp siêu âm. Bây giờ trên da của con có một lớp lông tơ mỏng để bảo vệ. Sau khi con sinh ra, lớp lông này sẽ dần dần biến mất.',
      },
      {
        key: '13w2d',
        week: 13,
        dayInWeek: 2,
        content:
          'Cổ họng của con bắt đầu hình thành, tuyến nước bọt cũng bắt đầu phát huy tác dụng. Các hoạt động như mút và nuốt, v.v. trở nên linh hoạt hơn. Nếu mẹ ấn nhẹ vào bụng, con sẽ cảm nhận được đấy ạ!',
      },
      {
        key: '13w3d',
        week: 13,
        dayInWeek: 3,
        content:
          'Mẹ ơi, con báo cho mẹ một tin nhé. Cục cưng của mẹ đã bắt đầu xuất hiện một vài chiếc răng nhỏ trong lợi. Lực của cơ khỏe hơn. Con còn biết thể hiện những biểu cảm đơn giản như cau mày, mút ngón tay, v.v.',
      },
      {
        key: '13w4d',
        week: 13,
        dayInWeek: 4,
        content:
          'Tim con đập rộn ràng hơn. Các cơ quan nội tạng đã phát triển xong. Cơ quan tiêu hóa và tiết niệu đã bắt đầu thực hiện chức năng. Bài tập hiện giờ của con là nỗ lực tập thở trong tử cung.',
      },
      {
        key: '13w5d',
        week: 13,
        dayInWeek: 5,
        content:
          'Bây giờ nhau thai đã phát triển hoàn thiện. Mẹ và con kết nối thành một với nhau qua dây rốn. Con cũng sẽ cố gắng hấp thu chất dinh dưỡng từ thức ăn của mẹ. Vì thế mẹ phải ăn uống đầy đủ nhé!',
      },
      {
        key: '13w6d',
        week: 13,
        dayInWeek: 6,
        content:
          'Cơ và xương của con không ngừng phát triển, bây giờ con hoàn toàn nhận chất dinh dưỡng từ nhau thai. Cổ họng của con đã hình thành, tuyến nước bọt đã phát huy tác dụng. Ruột già của con đã bắt đầu tích phân.',
      },
    ],
  },
  14: {
    week: 14,
    emoji: '🤲',
    title: 'Tuần 14 — Ý Thức Đầu Tiên',
    days: [
      {
        key: '14w0d',
        week: 14,
        dayInWeek: 0,
        content:
          'Bây giờ con đã lớn hơn khá nhiều rồi, gần bằng bàn tay của mẹ. Chức năng tạo máu của lá lách ngày càng linh hoạt. Trong phổi dần dần xuất hiện các sợi đàn hồi, chức năng ngày càng nhiều.',
      },
      {
        key: '14w1d',
        week: 14,
        dayInWeek: 1,
        content:
          'Tay chân của con đã phát triển hoàn thiện. Giờ con có thể tự do chơi đùa trong nước ối. Thỉnh thoảng con lại vươn cái tay, đá cái chân, nhưng vì con còn quá bé nên mẹ vẫn chưa cảm nhận được điều đó.',
      },
      {
        key: '14w2d',
        week: 14,
        dayInWeek: 2,
        content:
          'Hệ thần kinh trung ương của con phát triển và có xu hướng hoàn thiện. Đại não đã sinh ra ý thức ban đầu. Đầu con đã có thể dựng thẳng lên được. Đường nét trên khuôn mặt ngay ngắn. Hình miệng về cơ bản đã hoàn thành. Lợi cũng xuất hiện hình dạng sơ khai.',
      },
      {
        key: '14w3d',
        week: 14,
        dayInWeek: 3,
        content:
          'Cánh tay và cẳng chân của con đã vươn dài ra, bơi từ từ trong khoang ối. Đầu của con khá lớn, trán nhô về phía trước. Mẹ có thể cảm nhận được quy luật nấc của con trong bụng mẹ.',
      },
      {
        key: '14w4d',
        week: 14,
        dayInWeek: 4,
        content:
          'Con có thể bơi trong nước ối như kiện tướng bơi lội. Ngón tay, ngón chân, cổ tay và các cử động nhỏ khác của con cũng tương đối phát triển. Đồng thời tay con còn có thể di chuyển đến các vị trí khác của cơ thể, rất linh hoạt đấy ạ.',
      },
      {
        key: '14w5d',
        week: 14,
        dayInWeek: 5,
        content:
          'Hệ hô hấp của con đã hoàn thiện. Phần ngực bắt đầu xuất hiện nhịp co bóp đều đặn, nhưng mô phổi vẫn chưa có chức năng thực tế. Khí quản và biểu mô lông mao phủ trên khí quản đã hình thành rồi.',
      },
      {
        key: '14w6d',
        week: 14,
        dayInWeek: 6,
        content:
          'Hệ thần kinh trung ương của con có xu hướng hoàn thiện, ý thức của đại não sẽ ngày càng rõ ràng. Con không ngừng luyện tập các cơ nhỏ để cơ thể ngày càng khỏe mạnh, rắn chắc.',
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
          'Xương và cơ của con đã rất phát triển rồi. Cánh tay và cẳng chân có thể cử động tự do. Con sẽ thường xuyên xoay mình, mút, tập thở, khua tay múa chân trong bụng mẹ. Mẹ đã cảm nhận được chưa ạ?',
      },
      {
        key: '15w1d',
        week: 15,
        dayInWeek: 1,
        content:
          'Ngũ quan trên khuôn mặt của con trở nên lập thể hơn, đẹp hơn. Con ngày càng giống mẹ rồi. Tay chân con đặc biệt linh hoạt. Con vận động thường xuyên là để mẹ tương tác với con nhiều hơn.',
      },
      {
        key: '15w2d',
        week: 15,
        dayInWeek: 2,
        content:
          'Bây giờ con có thể tự quay đầu, quay hai cánh tay và nửa thân trên. Con còn biết thể hiện yêu và ghét bằng cách lắc người và đá chân. Tiếng nấc của con cũng ngày càng lớn hơn.',
      },
      {
        key: '15w3d',
        week: 15,
        dayInWeek: 3,
        content:
          'Bây giờ con đang bận rộn hít nước ối vào và thở nước ối ra nhằm giúp phát triển túi khí trong phổi, để phổi ngày càng khỏe mạnh, chuẩn bị cho việc hít hơi thở đầu tiên sau khi con chào đời.',
      },
      {
        key: '15w4d',
        week: 15,
        dayInWeek: 4,
        content:
          'Con bắt đầu tập động tác uống nước ối, miệng mở và khép lại. Mắt con vẫn còn nhắm nhưng đã có thể cảm nhận được ánh sáng rồi. Con thường xuyên tập hai hành vi phản xạ là nuốt và mút.',
      },
      {
        key: '15w5d',
        week: 15,
        dayInWeek: 5,
        content:
          'Bây giờ con đã rất nhạy cảm với ánh sáng. Những nơi sáng làm con cảm thấy thích thú, nhưng lúc ngủ con vẫn thích chỗ tối, vì thế nếu mẹ chơi với con bằng đèn pin thì đừng chơi quá lâu nhé!',
      },
      {
        key: '15w6d',
        week: 15,
        dayInWeek: 6,
        content:
          'Bây giờ con có thể bơi trong nước ối, lặp đi lặp lại các động tác giống nhau, di chuyển, thay đổi vị trí, vận động toàn bộ cơ thể lên và xuống. Lúc này, vật chất cứng nhất trong cơ thể con là men răng.',
      },
    ],
  },
  16: {
    week: 16,
    emoji: '🎵',
    title: 'Tuần 16 — Nghe Được Giọng Bố Mẹ',
    days: [
      {
        key: '16w0d',
        week: 16,
        dayInWeek: 0,
        content:
          'Giờ đây, chức năng thính giác của con phát triển rất tốt. Con thích nhất giọng nói của bố và mẹ, nhưng thường xuyên được nghe âm nhạc có giai điệu nhẹ nhàng cũng làm con rất vui.',
      },
      {
        key: '16w1d',
        week: 16,
        dayInWeek: 1,
        content:
          'Phần đầu của con tròn trịa hơn, đẹp hơn trước đây. Mức độ linh hoạt của cơ thể đã tăng lên rất nhiều. Con có thể tự do quay đầu, quay hai cánh tay và nửa thân trên.',
      },
      {
        key: '16w2d',
        week: 16,
        dayInWeek: 2,
        content:
          'Bây giờ tay của con cử động ngày càng nhiều hơn. Có lúc, hai tay con nắm lại, có lúc con cử động ngón tay cái, có lúc lại vặn cổ tay, có lúc con kéo dây rốn nghịch ngợm.',
      },
      {
        key: '16w3d',
        week: 16,
        dayInWeek: 3,
        content:
          'Sụn như cao su của con bắt đầu biến thành xương. Vì xương đã bắt đầu hình thành nên cơ lưng của con cũng cứng cáp hơn. Nhưng mẹ vẫn chưa cảm nhận được sự chuyển động của con.',
      },
      {
        key: '16w4d',
        week: 16,
        dayInWeek: 4,
        content:
          'Mẹ ơi, khi mẹ chạm tay vào con, ấn nhẹ vào bụng, con sẽ lập tức đưa tay hoặc chân ra đáp lại.',
      },
      {
        key: '16w5d',
        week: 16,
        dayInWeek: 5,
        content:
          'Nụ vị giác trên lưỡi của con bắt đầu phát triển hoàn toàn. Nó có khả năng cảm nhận đáng kinh ngạc, có thể phân biệt được vị của nước ối. Mặc dù nước ối hơi mặn, nhưng con rất thích hương vị hạnh phúc đó.',
      },
      {
        key: '16w6d',
        week: 16,
        dayInWeek: 6,
        content:
          'Con càng lúc càng hiếu động, mẹ có thể cảm nhận rõ rệt cử động thai. Lúc này dùng ống nghe có thể nghe thấy rõ ràng tiếng tim đập mạnh mẽ của con, có phải là rất vui không ạ?',
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
          'Bây giờ con bận rộn với việc duỗi cánh tay và đá cẳng chân! Mẹ ơi, có lẽ mẹ sẽ ngày càng cảm nhận rõ hơn những cử động này của con. Mẹ đừng lo lắng, mẹ hãy tận hưởng niềm hạnh phúc này nhé!',
      },
      {
        key: '17w1d',
        week: 17,
        dayInWeek: 1,
        content:
          'Chức năng thính giác của con đã dần hình thành, con đã biến thân thành công, trở thành "kẻ nghe trộm" bé nhỏ! Tiếng nói dịu dàng và tiếng hát nhẹ nhàng của mẹ đều khiến con cảm nhận được tình yêu thương ấm áp.',
      },
      {
        key: '17w2d',
        week: 17,
        dayInWeek: 2,
        content:
          'Tất cả các cơ quan của con đã phát triển thành hình. Cơ thể với phần đầu nặng và phần chân nhẹ đã được chia thành ba phần. Phần đầu chiếm một phần ba. Tỷ lệ cơ thể cuối cùng cũng đã trở nên cân đối hơn một chút.',
      },
      {
        key: '17w3d',
        week: 17,
        dayInWeek: 3,
        content:
          'Toàn thân con mọc lông mịn. Lông mày cũng đã mọc đầy đủ, ngay đến cả móng tay cũng mọc ra khỏi móng. Sau khi con chào đời, hầu hết lông tơ trên cơ thể con sẽ biến mất. Mẹ đừng lo lắng nhé!',
      },
      {
        key: '17w4d',
        week: 17,
        dayInWeek: 4,
        content:
          'Phần dạ dày của con đã xuất hiện tế bào tạo chất nhầy, tiết ra dịch vị. Nếp nhăn trên đại não tăng lên. Mẹ ơi, trong vòng 1~2 giờ sau khi mẹ ăn, con cũng bắt đầu hấp thu chất dinh dưỡng đấy nhé!',
      },
      {
        key: '17w5d',
        week: 17,
        dayInWeek: 5,
        content:
          'Các mạch máu dưới da của con rõ ràng và có thể nhìn thấy được. Độ dày của da cũng đang tăng lên để bảo vệ các mạch máu và cơ quan nội tạng của con. Tai đã phát triển ở vị trí bình thường, tuy nhiên vẫn còn hơi non nớt.',
      },
      {
        key: '17w6d',
        week: 17,
        dayInWeek: 6,
        content:
          'Phần đầu của con trông có vẻ hơi cao một chút. Con đã có cổ với ranh giới rõ ràng. Phần đầu và cổ ngày càng có xu hướng phát triển thành một đường thẳng. Toàn bộ cơ thể con trông đã đẹp hơn nhiều.',
      },
    ],
  },
  18: {
    week: 18,
    emoji: '🍅',
    title: 'Tuần 18 — Các Giác Quan Bùng Nổ',
    days: [
      {
        key: '18w0d',
        week: 18,
        dayInWeek: 0,
        content:
          'Bây giờ con trông giống như một quả cà chua. Con thường xuyên bận rộn với việc vươn tay và đá chân. Có thể mẹ sẽ càng ngày càng cảm nhận rõ hơn động tác này của con.',
      },
      {
        key: '18w1d',
        week: 18,
        dayInWeek: 1,
        content:
          'Khi mẹ vui và xúc động, sự tiết hormone trong cơ thể sẽ thay đổi, thúc đẩy não giữa tạo ra thông tin, rồi truyền cho con thông qua máu và nhau thai. Vì thế mẹ phải giữ tinh thần vui vẻ nhé!',
      },
      {
        key: '18w2d',
        week: 18,
        dayInWeek: 2,
        content:
          'Cấu trúc cơ bản trong cơ thể con đã tới giai đoạn hoàn thiện cuối cùng. Trung khu hô hấp bắt đầu hoạt động. Tá tràng và ruột già bắt đầu cố định, cơ quan tiêu hóa bắt đầu hoạt động.',
      },
      {
        key: '18w3d',
        week: 18,
        dayInWeek: 3,
        content:
          'Các giác quan của con phát triển mạnh mẽ. Đại não bắt đầu phân chia thành các khu vực khứu giác, vị giác, thính giác và xúc giác chuyên biệt. Bây giờ khả năng nhận thức môi trường của con mạnh mẽ hơn bao giờ hết.',
      },
      {
        key: '18w4d',
        week: 18,
        dayInWeek: 4,
        content:
          'Da của con có màu đỏ đậm. Tuyến bã nhờn đã phát triển và bắt đầu bài tiết. Tế bào biểu mô bong ra và bã nhờn trên da kết hợp với nhau tạo thành chất gây, bao phủ bề mặt da của con.',
      },
      {
        key: '18w5d',
        week: 18,
        dayInWeek: 5,
        content:
          'Bây giờ chỉ thỉnh thoảng con mới nấc. Tuy tần suất chậm lại, nhưng thời gian nấc liên tục lại dài hơn. Bây giờ thông thường con phải nấc nửa tiếng mới dừng. Mẹ đừng lo lắng nhé!',
      },
      {
        key: '18w6d',
        week: 18,
        dayInWeek: 6,
        content:
          'Bây giờ con có thể nghe thấy tiếng nói từ thế giới bên ngoài và cũng phân biệt được giọng nói của mẹ và người khác. Con đã nhanh chóng thể hiện sự yêu mến với giọng nói của mẹ bằng cách giảm nhịp tim, thư giãn cơ thể.',
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
          'Con đã nặng gần bằng một quả táo. Cánh tay và cẳng chân bây giờ đã cân xứng với các bộ phận khác trên cơ thể. Thận tiếp tục sản sinh ra nước tiểu. Tóc trên da đầu bắt đầu mọc ra.',
      },
      {
        key: '19w1d',
        week: 19,
        dayInWeek: 1,
        content:
          'Con nuốt thường xuyên hơn. Ngoài việc hấp thu chất dinh dưỡng từ nhau thai, trong quá trình nuốt con cũng hấp thu chất dinh dưỡng trong nước ối. Hút chất dinh dưỡng cần thiết cho sự phát triển của con.',
      },
      {
        key: '19w2d',
        week: 19,
        dayInWeek: 2,
        content:
          'Con đã biết phân biệt khoảng thời gian. Buổi sáng, buổi chiều và ban đêm con đều có thể phân biệt được rất rõ ràng. Khoảng thời gian con vận động nhiều mỗi ngày chính là cơ hội tốt để mẹ thủ thỉ với con!',
      },
      {
        key: '19w3d',
        week: 19,
        dayInWeek: 3,
        content:
          'Nhận thức của con đối với giọng nói của mẹ càng lúc càng rõ rệt. Lúc này, sao không để bố tham gia trò chuyện cùng, để con làm quen trước với giọng nói của bố.',
      },
      {
        key: '19w4d',
        week: 19,
        dayInWeek: 4,
        content:
          'Con cũng đã có lúc ngủ, lúc thức như một em bé sơ sinh. Khi ngủ, con nằm ở nhiều tư thế độc đáo khác nhau. Có lúc con chúi cằm lên ngực, có lúc con lại ngửa đầu về sau.',
      },
      {
        key: '19w5d',
        week: 19,
        dayInWeek: 5,
        content:
          'Nước tiểu của con đã có thể thải trực tiếp vào trong nước ối. Nhưng mẹ đừng lo lắng về việc nước ối sẽ bị bẩn. Cứ mỗi 3~4 giờ là nước ối sẽ được thay hoàn toàn. Con sẽ cố gắng để lớn lên thật nhanh. Cố lên nào!',
      },
      {
        key: '19w6d',
        week: 19,
        dayInWeek: 6,
        content:
          'Con đang sản xuất phân su, đây là dạng vật chất dính, màu đen được tạo thành từ tế bào chết, chất bài tiết tiêu hóa và nước ối được nuốt vào, và đó sẽ là "thành quả" đầu tiên trên tã sau khi con chào đời.',
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
          'Giờ đây con đã nặng bằng quả cam. Ở giai đoạn này con rất hiếu động, vì thế cử động thai cũng vô cùng thường xuyên, đôi lúc không phân biệt ngày và đêm. Con đã làm phiền mẹ rồi. Con xin lỗi mẹ nhé!',
      },
      {
        key: '20w1d',
        week: 20,
        dayInWeek: 1,
        content:
          'Lông mày của con bắt đầu hình thành. Trên đầu bắt đầu mọc những sợi tóc nhỏ xíu. Nhưng đây không phải lông tơ. Nếu con là bé gái thì tử cung của con đã hình thành hoàn toàn rồi.',
      },
      {
        key: '20w2d',
        week: 20,
        dayInWeek: 2,
        content:
          'Trái tim của con ngày càng khỏe mạnh. Máu trong dây rốn tuần hoàn nhanh. Chỉ cần khoảng thời gian 30 giây là đã hoàn thành một vòng tuần hoàn hoàn chỉnh giữa dây rốn và con.',
      },
      {
        key: '20w3d',
        week: 20,
        dayInWeek: 3,
        content:
          'Thận của con tiếp quản công việc sản xuất nước ối. Nước ối có thể giúp luyện tập chức năng tiêu hóa và bài tiết, còn có thể hỗ trợ loại bỏ chất thải trong máu và lọc nước tiểu. Thực sự rất cừ!',
      },
      {
        key: '20w4d',
        week: 20,
        dayInWeek: 4,
        content:
          'Mẹ ơi, mẹ có nghe thấy nhịp tim mạnh mẽ của con không? Nghe nói nếu là sinh đôi, nhịp tim của hai thai nhi có thể không giống nhau, có thể chênh lệch trên 10 lần trong một phút.',
      },
      {
        key: '20w5d',
        week: 20,
        dayInWeek: 5,
        content:
          'Cơ của con phát triển tương đối nhanh, thể lực tăng lên, cử động thai càng lúc càng thường xuyên hơn. Cho dù con đang ngủ, con cũng có thể máy rất mạnh. Mẹ đừng giật mình vì con nhé!',
      },
      {
        key: '20w6d',
        week: 20,
        dayInWeek: 6,
        content:
          'Nếu con là con trai, lúc này tinh hoàn sẽ bắt đầu di chuyển từ xương chậu xuống bìu. Nếu con là con gái, buồng trứng sẽ ở lại vị trí ban đầu!',
      },
    ],
  },
  21: {
    week: 21,
    emoji: '🧅',
    title: 'Tuần 21',
    days: [
      {
        key: '21w0d',
        week: 21,
        dayInWeek: 0,
        content:
          'Bây giờ con đã gần bằng một củ hành tây, lông mày và mí mắt đều đã phát triển đầy đủ. Ý thức của con cũng đang trong quá trình phát triển, có thể tiến hành trao đổi cơ bản với mẹ trong tử cung.',
      },
      {
        key: '21w1d',
        week: 21,
        dayInWeek: 1,
        content:
          'Lúc này da của con vẫn còn rất mỏng, trong suốt, dễ bị nhăn. Nếu giờ có thể nhìn thấy con thì mẹ sẽ thấy xương, các cơ quan và mạch máu của con.',
      },
      {
        key: '21w2d',
        week: 21,
        dayInWeek: 2,
        content:
          'Thời gian thức của con trở nên lâu hơn. Mẹ có thể tận dụng cơ hội này để kể chuyện cho con, hát bài hát thiếu nhi cho con nghe. Thông thường, con đều sẽ tích cực đáp lại mẹ.',
      },
      {
        key: '21w3d',
        week: 21,
        dayInWeek: 3,
        content:
          'Cơ của con phát triển tương đối nhanh, thể lực được tăng cường, cử động thai càng lúc càng thường xuyên, chứng minh cho khả năng hoạt động của con. Lúc này, diện mạo của con đã rõ nét, xương khỏe mạnh. Con còn thường xuyên thay đổi các động tác.',
      },
      {
        key: '21w4d',
        week: 21,
        dayInWeek: 4,
        content:
          'Môi của con rõ ràng hơn. Mầm răng cũng hình thành trong lợi, cho thấy dấu hiệu mọc răng ban đầu, 4~7 tháng sau khi chào đời chiếc răng đầu tiên của con mới thực sự xuất hiện.',
      },
      {
        key: '21w5d',
        week: 21,
        dayInWeek: 5,
        content:
          'Thính giác của con đã phát triển hoàn toàn, con có thể nhận biết các loại âm thanh và phản ứng lại trong bụng mẹ. Con còn thường xuyên bị đánh thức bởi âm thanh hoặc hoạt động của thế giới bên ngoài.',
      },
      {
        key: '21w6d',
        week: 21,
        dayInWeek: 6,
        content:
          'Đại não của con tiếp tục phát triển phức tạp hơn. Lông mày đã mọc ra, mũi cao hơn, cổ dài hơn. Khi con ngủ, hai cánh tay khoanh lại trước ngực, đầu gối gập vào bụng. Con rất đáng yêu phải không ạ?',
      },
    ],
  },
  22: {
    week: 22,
    emoji: '🐟',
    title: 'Tuần 22',
    days: [
      {
        key: '22w0d',
        week: 22,
        dayInWeek: 0,
        content:
          'Lúc này con đã lớn lên rất nhiều, cơ thể linh hoạt hơn, giống một chú cá chép nhỏ, tự do bơi lội trong nước ối, vô cùng thích thú.',
      },
      {
        key: '22w1d',
        week: 22,
        dayInWeek: 1,
        content:
          'Xương tai giữa của con bắt đầu cứng lại, thính giác thêm nhạy bén, có thể phân biệt được nhiều âm thanh hơn. Tín hiệu của âm thanh còn có thể truyền tới đại não, nhưng đại não vẫn chưa hoàn thiện!',
      },
      {
        key: '22w2d',
        week: 22,
        dayInWeek: 2,
        content:
          'Con cũng có cảm xúc, bắt đầu biết đá vào bụng mẹ để thể hiện tâm trạng của mình. Khi vui sẽ đá nhẹ, không vui thì đá mạnh. Mẹ có giận không ạ?',
      },
      {
        key: '22w3d',
        week: 22,
        dayInWeek: 3,
        content:
          'Con dần dần lớn lên, không gian trong tử cung càng lúc càng trở nên chật chội. Con máy ngày càng thường xuyên hơn. Lúc này, mẹ có thể cảm nhận được rõ rệt sự va đập, có phải là rất thú vị không ạ?',
      },
      {
        key: '22w4d',
        week: 22,
        dayInWeek: 4,
        content:
          'Da của con vẫn còn đỏ, nhăn nheo, đến khi chào đời mới có thể chuyển thành màu hồng hoặc đỏ nhạt. Các mạch máu lộ dưới da là nguyên nhân làm da có màu đỏ.',
      },
      {
        key: '22w5d',
        week: 22,
        dayInWeek: 5,
        content:
          'Hệ hô hấp của con vẫn còn khá non nớt. Phổi cần thời gian phát triển rất dài mới có thể tạo ra oxy cung cấp cho các mạch máu khi hít vào và thải khí cacbonic khi thở ra.',
      },
      {
        key: '22w6d',
        week: 22,
        dayInWeek: 6,
        content:
          'Mắt của con đã phát triển, nhưng mống mắt (phần có màu trong mắt) vẫn thiếu màu. Tuyến tụy của con là cơ quan quan trọng để sản xuất hormone. Cơ quan này cũng đang phát triển ổn định.',
      },
    ],
  },
  23: {
    week: 23,
    emoji: '👶',
    title: 'Tuần 23 — Giống Em Bé Sơ Sinh',
    days: [
      {
        key: '23w0d',
        week: 23,
        dayInWeek: 0,
        content:
          'Cân nặng của con đã tăng lên không ít. Xương và cơ cũng đang phát triển. Con hiện giống một em bé sơ sinh phiên bản thu nhỏ.',
      },
      {
        key: '23w1d',
        week: 23,
        dayInWeek: 1,
        content:
          'Nụ vị giác của con bây giờ cũng đang phát huy tác dụng. Con đã biết thích mùi vị. Mẹ ơi, con đã yêu thích vị của nước ối rồi!',
      },
      {
        key: '23w2d',
        week: 23,
        dayInWeek: 2,
        content:
          'Tay chân con đã trở nên linh hoạt, nhanh nhẹn hơn, có thể dễ dàng nắm lấy bàn chân nhỏ của mình, gặm không ngừng một cách thích thú. Sợ rằng con sẽ biến thành một chú mèo tham ăn!',
      },
      {
        key: '23w3d',
        week: 23,
        dayInWeek: 3,
        content:
          'Tế bào bạch cầu trong cơ thể con đang dần dần hình thành để chống lại các bệnh truyền nhiễm. Ngoài khả năng miễn dịch mà mẹ cung cấp, hệ miễn dịch của con chống lại các bệnh truyền nhiễm nhẹ cũng đang bắt đầu phát triển.',
      },
      {
        key: '23w4d',
        week: 23,
        dayInWeek: 4,
        content:
          'Phổi là cơ quan phát triển hoàn thiện cuối cùng của con. Giờ đây, các mô của phổi và mạch máu vẫn đang phát triển. Con phải tiếp tục luyện tập khả năng hô hấp bằng cách hít nước ối vào. Con cần cố gắng hơn rồi.',
      },
      {
        key: '23w5d',
        week: 23,
        dayInWeek: 5,
        content:
          'Tiếng tim của con ngày càng trở nên mạnh hơn. Áp tai vào bụng là có thể nghe thấy tim thai. Nếu dùng ống nghe sẽ nghe thấy rõ ràng hơn.',
      },
      {
        key: '23w6d',
        week: 23,
        dayInWeek: 6,
        content:
          'Mặt và cơ thể của con đã rất giống với trẻ sơ sinh. Mắt cũng đã hình thành. Cơ thể cũng đang từng bước phát triển hoàn thiện, càng ngày càng đẹp hơn!',
      },
    ],
  },
  24: {
    week: 24,
    emoji: '🍈',
    title: 'Tuần 24',
    days: [
      {
        key: '24w0d',
        week: 24,
        dayInWeek: 0,
        content:
          'Bây giờ con đã nặng hơn nhiều, lớn bằng quả thanh long. Tuy trông con hơi gầy, nhưng cơ thể vẫn rất khỏe mạnh. Mẹ đừng lo cho con nhé!',
      },
      {
        key: '24w1d',
        week: 24,
        dayInWeek: 1,
        content:
          'Màu và chất tóc của con bắt đầu thay đổi và sẽ vẫn tiếp tục thay đổi sau khi sinh. Giờ đây con đang dự trữ nhiều chất dinh dưỡng hơn để trở nên khỏe mạnh hơn.',
      },
      {
        key: '24w2d',
        week: 24,
        dayInWeek: 2,
        content:
          'Lỗ mũi của con đã mở ra. Các dây thần kinh gần miệng cũng trở nên nhạy cảm hơn. Tất cả những điều này đều nhằm chuẩn bị cho con tìm được núm vú của mẹ sau khi sinh một cách tốt hơn!',
      },
      {
        key: '24w3d',
        week: 24,
        dayInWeek: 3,
        content:
          'Dây rốn của con trở nên to hơn, có khả năng hấp thu chất dinh dưỡng tốt hơn. Vật chất dạng keo trên dây rốn là để tránh dây rốn bị thắt hoặc quấn vào nhau và cũng để đảm bảo lưu thông máu giữa con và nhau thai được thông suốt!',
      },
      {
        key: '24w4d',
        week: 24,
        dayInWeek: 4,
        content:
          'Mầm răng của con đã bắt đầu phát triển, ẩn trong lợi, giờ vẫn chưa nhìn thấy được. Phải chờ tới khi con 6 tuổi, răng sữa bắt đầu rụng thì răng mới mọc ra.',
      },
      {
        key: '24w5d',
        week: 24,
        dayInWeek: 5,
        content:
          'Thính giác của con càng ngày càng tốt. Con nhạy cảm hơn với âm thanh, ánh sáng của thế giới bên ngoài và sự tiếp xúc của mẹ. Bây giờ là thời điểm tuyệt vời để mẹ giao tiếp với con!',
      },
      {
        key: '24w6d',
        week: 24,
        dayInWeek: 6,
        content:
          'Mẹ ơi, hệ thần kinh của con giờ đây đã rất hoàn thiện rồi. Con biết cảm thấy đau, cảm thấy ngứa. Con thích nhất là được lắc. Mẹ hãy cùng con chơi nhiều trò chơi nhé!',
      },
    ],
  },
  25: {
    week: 25,
    emoji: '🥭',
    title: 'Tuần 25',
    days: [
      {
        key: '25w0d',
        week: 25,
        dayInWeek: 0,
        content:
          'Mẹ ơi, mẹ có cảm thấy con lại lớn hơn rồi không? Bây giờ con đã gần bằng một quả xoài rồi. Con thích ánh sáng mặt trời và không khí trong lành. Mẹ phải thường xuyên đưa con ra ngoài đi dạo nhé!',
      },
      {
        key: '25w1d',
        week: 25,
        dayInWeek: 1,
        content:
          'Con càng lúc càng khỏe mạnh hơn và càng lúc càng nghịch ngợm hơn. Con sẽ không ngừng tìm vị trí thoải mái nhất cho mình trong bụng mẹ. Các tư thế cũng thường xuyên thay đổi. Thật là vui!',
      },
      {
        key: '25w2d',
        week: 25,
        dayInWeek: 2,
        content:
          'Tai của con nhạy cảm hơn. Ngày ngày con có thể nghe thấy tiếng tim đập của mẹ, nghe thấy tiếng vọng lại của âm thanh khi trò chuyện, tiếng thở và tiếng ồn ào của ruột và dạ dày.',
      },
      {
        key: '25w3d',
        week: 25,
        dayInWeek: 3,
        content:
          'Con bắt đầu có ký ức nhỏ, đặc biệt là con có cảm giác rất thân quen với âm thanh xuất hiện trùng lặp. Mẹ và bố hãy nói chuyện nhiều với con nhé. Con rất mong chờ được tìm hiểu về thế giới này.',
      },
      {
        key: '25w4d',
        week: 25,
        dayInWeek: 4,
        content:
          'Sự phát triển của đại não giúp con trở nên thông minh hơn, cơ thể linh hoạt hơn. Con không chỉ biết khua chân múa tay, hơn nữa còn biết xoay người!',
      },
      {
        key: '25w5d',
        week: 25,
        dayInWeek: 5,
        content:
          'Cột sống của con trở nên khỏe hơn. Con cảm nhận được sức mạnh của các cơ, mặc dù vẫn chưa thể đỡ được toàn bộ cơ thể, nhưng con đã học được cách chắp tay và nắm tay.',
      },
      {
        key: '25w6d',
        week: 25,
        dayInWeek: 6,
        content:
          'Con bắt đầu mũm mĩm hơn, lớn hơn trong bụng mẹ. Mỡ cũng tăng lên không ít. Có mỡ, làn da nhăn nheo của con trở nên mịn màng hơn!',
      },
    ],
  },
  26: {
    week: 26,
    emoji: '🍇',
    title: 'Tuần 26',
    days: [
      {
        key: '26w0d',
        week: 26,
        dayInWeek: 0,
        content:
          'Mẹ ơi, con lại to hơn một chút và nặng như quả bưởi chùm rồi. Con thích hoạt động trong bụng của mẹ. Mẹ có cảm thấy những cử động nghịch ngợm của con không?',
      },
      {
        key: '26w1d',
        week: 26,
        dayInWeek: 1,
        content:
          'Con ngày càng thích các loại âm thanh. Mẹ nhớ kể chuyện cho con nghe nhiều hơn nhé. Con thích bản nhạc nhẹ nhàng, giọng nói dịu êm. Những điều này sẽ khiến con cảm thấy vui vẻ!',
      },
      {
        key: '26w2d',
        week: 26,
        dayInWeek: 2,
        content:
          'Mẹ ơi, có phải dạo này mẹ cảm thấy khó thở, và hơi thở dốc không? Đó là bởi vì cơ thể con đã lớn hơn, chèn vào cơ hoành của mẹ, khiến mẹ mệt khi hô hấp.',
      },
      {
        key: '26w3d',
        week: 26,
        dayInWeek: 3,
        content:
          'Đại não của con vẫn đang phát triển. Con suy nghĩ ngày càng nhiều hơn. Hình ảnh sóng não của con đã rất giống sóng não của những em bé sinh đủ tháng.',
      },
      {
        key: '26w4d',
        week: 26,
        dayInWeek: 4,
        content:
          'Ngũ quan trên khuôn mặt của con ngày càng rõ ràng hơn. Mí mắt đã mở trở lại, ống tai ngoài đã mở rồi, võng mạc càng hoàn thiện hơn. Con đã có khả năng thị giác ở mức độ nhẹ rồi nhé!',
      },
      {
        key: '26w5d',
        week: 26,
        dayInWeek: 5,
        content:
          'Con đã biết chớp mắt rồi, giấc ngủ cũng đã trở nên có giờ giấc. Mẹ nhớ nắm bắt nếp ngủ của con, hiệu quả thai giáo sẽ tốt hơn!',
      },
      {
        key: '26w6d',
        week: 26,
        dayInWeek: 6,
        content:
          'Con thích lặng im mút ngón tay cái trong bụng mẹ. Đừng xem thường hành động này nhé. Nó khiến cơ má và cơ hàm dưới của con ngày càng nhiều hơn.',
      },
    ],
  },
  27: {
    week: 27,
    emoji: '🐱',
    title: 'Tuần 27',
    days: [
      {
        key: '27w0d',
        week: 27,
        dayInWeek: 0,
        content:
          'Thân hình của con bây giờ giống một chú mèo con đang cuộn tròn trong tử cung của mẹ, thật dễ thương đúng không ạ? Điều tuyệt vời hơn là tóc của con đã mọc ra rồi!',
      },
      {
        key: '27w1d',
        week: 27,
        dayInWeek: 1,
        content:
          'Tính cách của con ngày càng mạnh mẽ. Tính cách của mỗi thai nhi đều không giống nhau. Những thai nhi ít vận động thì tương đối trầm tính. Thai nhi vận động nhiều thì nghịch ngợm hơn.',
      },
      {
        key: '27w2d',
        week: 27,
        dayInWeek: 2,
        content:
          'Con đã có khứu giác rồi. Con có thể giao tiếp với thế giới bên ngoài qua lỗ mũi. Nhưng vì con đang ở trong nước ối nên vẫn không thể ngửi thấy các mùi!',
      },
      {
        key: '27w3d',
        week: 27,
        dayInWeek: 3,
        content:
          'Hệ sinh sản của con phát triển hoàn thiện hơn. Nếu con là bé gái, môi nhỏ đã hình thành rồi. Chỉ có điều phải chờ 2 tháng mới có thể che phủ âm vật!',
      },
      {
        key: '27w4d',
        week: 27,
        dayInWeek: 4,
        content:
          'Chất hoạt động bề mặt phế nang của con đã bắt đầu bài tiết. Nói cách khác, con có thể hô hấp được rồi, nhưng khả năng hô hấp của con hiện không thích nghi được với môi trường bên ngoài.',
      },
      {
        key: '27w5d',
        week: 27,
        dayInWeek: 5,
        content:
          'Võng mạc của con đã phát triển hoàn toàn, có khả năng cảm ứng ánh sáng tốt hơn. Mẹ có biết không, bây giờ con có thể chớp mắt được rồi. Mẹ bất ngờ không!',
      },
      {
        key: '27w6d',
        week: 27,
        dayInWeek: 6,
        content:
          'Hệ thần kinh thính giác của con đã phát triển hoàn thiện. Con phản ứng rõ ràng hơn với âm thanh từ thế giới bên ngoài. Con thích nghe giọng nói của bố mẹ. Một số bản nhạc nhẹ nhàng khiến con cảm nhận được sâu sắc.',
      },
    ],
  },
  28: {
    week: 28,
    emoji: '🧠',
    title: 'Tuần 28 — Não Có Nếp Nhăn',
    days: [
      {
        key: '28w0d',
        week: 28,
        dayInWeek: 0,
        content:
          'Mỡ dưới da của con tiếp tục tích tụ, trông có vẻ như con đã mũm mĩm lên khá nhiều rồi! Tuy con đã mũm mĩm hơn, nhưng con vẫn hoạt bát và hiếu động như thế. Thời gian hoạt động hàng ngày dường như dài hơn.',
      },
      {
        key: '28w1d',
        week: 28,
        dayInWeek: 1,
        content:
          'Con ngày càng lớn hơn, sắp lấp đầy tử cung của mẹ. Bề mặt đại não của con cũng bắt đầu xuất hiện một số khe rãnh, phản ứng ngày càng trở nên nhạy bén hơn.',
      },
      {
        key: '28w2d',
        week: 28,
        dayInWeek: 2,
        content:
          'Hệ hô hấp của con chưa hoàn thiện lắm, cần một thời gian rất dài để phát triển thì con mới có thể hít oxy đưa vào mạch máu và thở ra khí Carbon như mẹ.',
      },
      {
        key: '28w3d',
        week: 28,
        dayInWeek: 3,
        content:
          'Mẹ ơi, giai đoạn này mẹ đừng gây kích động cho con. Đây là giai đoạn nhịp tim và cử động thai của con thay đổi. Nhạc có tiết tấu quá nhanh và âm thanh có mức decibel cao sẽ ảnh hưởng đến sự phát triển của con!',
      },
      {
        key: '28w4d',
        week: 28,
        dayInWeek: 4,
        content:
          'Con thích nhất là luyện tập động tác phản xạ có điều kiện. Điều này tốt cho sự sinh tồn của con sau khi chào đời. Môi và miệng của con rất nhạy cảm. Nếu bàn tay nhỏ xuất hiện vừa đúng bên cạnh miệng, con sẽ mút ngón tay của mình!',
      },
      {
        key: '28w5d',
        week: 28,
        dayInWeek: 5,
        content:
          'Để mau lớn, con cố gắng hấp thu chất dinh dưỡng của mẹ. Da của con bắt đầu trở nên trơn láng, hồng hào. Lông tơ trên cơ thể cũng bắt đầu dần dần rụng đi.',
      },
      {
        key: '28w6d',
        week: 28,
        dayInWeek: 6,
        content:
          'Mắt con bây giờ vừa có thể mở ra, vừa có thể nhắm lại được, hơn nữa đã hình thành chu kỳ ngủ của riêng con. Con nhạy cảm hơn với ánh sáng của thế giới bên ngoài. Con cũng có thể phân biệt được ánh sáng mặt trời và bóng tối.',
      },
    ],
  },
  29: {
    week: 29,
    emoji: '🌙',
    title: 'Tuần 29',
    days: [
      {
        key: '29w0d',
        week: 29,
        dayInWeek: 0,
        content:
          'Con càng lúc càng lớn hơn. Số lần con lộn nhào trong bụng mẹ đã ít đi rất nhiều. Nhưng đôi lúc con vẫn thích đá liên tục, thậm chí còn làm cho mẹ không ngủ được.',
      },
      {
        key: '29w1d',
        week: 29,
        dayInWeek: 1,
        content:
          'Cơ và phổi của con đã hoàn thiện hơn. Đầu của con ngày càng lớn hơn. Đó là để có thể chứa hàng tỷ tế bào thần kinh mà đại não tạo ra!',
      },
      {
        key: '29w2d',
        week: 29,
        dayInWeek: 2,
        content:
          'Con thay đổi tư thế trong bụng mẹ, đôi lúc đầu hướng lên trên, đôi lúc đầu hướng xuống dưới. Nhưng mẹ cũng đừng quá lo lắng. Sau cùng, đầu con sẽ hướng xuống dưới vì phần đầu nặng.',
      },
      {
        key: '29w3d',
        week: 29,
        dayInWeek: 3,
        content:
          'Móng tay của con trông đã rõ hơn rồi. Vì con đã lớn hơn nhiều nên mẹ sẽ cảm nhận được những cơn co thắt tử cung không có quy luật. Đôi lúc bụng sẽ trở nên căng cứng. Đó là hiện tượng bình thường!',
      },
      {
        key: '29w4d',
        week: 29,
        dayInWeek: 4,
        content:
          'Cơ quan giác quan của con bắt đầu thử hoạt động. Vì con chưa thở khi ở trong tử cung, nên sau khi con chào đời, cơ quan khứu giác của con mới phát huy tác dụng!',
      },
      {
        key: '29w5d',
        week: 29,
        dayInWeek: 5,
        content:
          'Tóc của con đã trở nên dày hơn. Do ảnh hưởng của di truyền từ bố mẹ, khi sinh ra, đầu con có thể sẽ đầy tóc, cũng có thể chỉ có vài sợi tóc dính vào da đầu!',
      },
      {
        key: '29w6d',
        week: 29,
        dayInWeek: 6,
        content:
          'Thị lực của con vẫn còn vô cùng yếu, chỉ có thể nhận biết được vật thể cách mặt con vài centimet. Nhưng mẹ đừng lo, thị lực của con sẽ phát triển nhanh chóng sau khi chào đời.',
      },
    ],
  },
  30: {
    week: 30,
    emoji: '💪',
    title: 'Tuần 30',
    days: [
      {
        key: '30w0d',
        week: 30,
        dayInWeek: 0,
        content:
          'Trong thời gian này, con cần nguồn dinh dưỡng dồi dào. Mỡ dưới da của con cũng tiếp tục tăng lên. Khi ở trong bụng mẹ, người con cũng dài bằng cẳng tay rồi đó.',
      },
      {
        key: '30w1d',
        week: 30,
        dayInWeek: 1,
        content:
          'Vui quá mẹ ơi, bây giờ trông con đã hài hòa hơn nhiều rồi. Tay chân, cơ thể và đầu đều đang phát triển, tỷ lệ ngày càng cân đối hơn.',
      },
      {
        key: '30w2d',
        week: 30,
        dayInWeek: 2,
        content:
          'Mẹ ơi, có phải mẹ cảm thấy con không nghịch ngợm, hiếu động như trước nữa? Mẹ đừng lo lắng. Con đang cố gắng phát triển, nhưng không gian hoạt động hẹp đi, con không thể duỗi tay chân tự do được nữa.',
      },
      {
        key: '30w3d',
        week: 30,
        dayInWeek: 3,
        content:
          'Khi thức, con sẽ tập mở mắt và nhắm mắt. Lúc bên ngoài có ánh sáng, con sẽ quay lại và dùng tay chạm vào. Mẹ có cảm nhận được không ạ?',
      },
      {
        key: '30w4d',
        week: 30,
        dayInWeek: 4,
        content:
          'Đại não của con phát triển nhanh. Hệ thần kinh cũng dần phát triển đến một mức độ nhất định. Vỏ não cũng có nhiều nếp nhăn hơn. Chắc chắn con sẽ là một em bé thông minh!',
      },
      {
        key: '30w5d',
        week: 30,
        dayInWeek: 5,
        content:
          'Các cơ quan chính của con đã bước đầu phát triển xong. Phổi và cơ quan tiêu hóa cũng đã gần hoàn thiện. Móng chân của con bắt đầu mọc ra.',
      },
      {
        key: '30w6d',
        week: 30,
        dayInWeek: 6,
        content:
          'Mẹ ơi, bây giờ con đã có thể nghe thấy giọng nói của mẹ. Mẹ hãy nói chuyện với con nhiều hơn, hoặc hát cho con nghe mẹ nhé! Con thích những bài nhẹ nhàng.',
      },
    ],
  },
  31: {
    week: 31,
    emoji: '⭐',
    title: 'Tuần 31',
    days: [
      {
        key: '31w0d',
        week: 31,
        dayInWeek: 0,
        content:
          'Mẹ ơi, con lại học được một kỹ năng mới! Con có thể nuốt nước ối, sau đó lại bài tiết vào trong nước ối qua bàng quang. Mẹ hãy yên tâm, con sẽ luyện tập chức năng tiểu tiện này nhiều hơn.',
      },
      {
        key: '31w1d',
        week: 31,
        dayInWeek: 1,
        content:
          'Lớp mỡ tích tụ trong mấy ngày này đã phát huy tác dụng. Cánh tay và đùi con trở nên đầy đặn. Nếp nhăn trên da cũng giảm bớt. Mẹ ơi, có phải là con ngày càng xinh hơn không?',
      },
      {
        key: '31w2d',
        week: 31,
        dayInWeek: 2,
        content:
          'Tuy mỗi ngày con dành 90-95% thời gian để ngủ, nhưng khi thức dậy, con sẽ chăm chỉ luyện tập các động tác như mở mắt, nhắm mắt, uống nước ối, v.v.',
      },
      {
        key: '31w3d',
        week: 31,
        dayInWeek: 3,
        content:
          'Khi con mở mắt, con có thể nhìn thấy cảnh tượng trong "ngôi nhà nhỏ". Hơn nữa, thị giác, thính giác, vị giác, khứu giác và xúc giác của con đều bắt đầu hoạt động rồi.',
      },
      {
        key: '31w4d',
        week: 31,
        dayInWeek: 4,
        content:
          'Mẹ ơi, không gian hoạt động của con ngày càng chật hẹp. Xung quanh có khoảng 850ml nước ối, con không thể di chuyển qua lại, chỉ có thể lắc lư để đáp lại mẹ.',
      },
      {
        key: '31w5d',
        week: 31,
        dayInWeek: 5,
        content:
          'Mẹ ơi, con nghe nói tinh hoàn của bé trai đã bắt đầu hạ xuống bìu, còn môi lớn của bé gái thì bắt đầu lớn lên. Mẹ hy vọng con có những thay đổi nào?',
      },
      {
        key: '31w6d',
        week: 31,
        dayInWeek: 6,
        content:
          'Bây giờ con thường xuyên quay đầu từ bên này sang bên kia. Mẹ ơi, mẹ hãy chú ý đến con nhiều hơn để tránh trường hợp con bị dây rốn quấn cổ.',
      },
    ],
  },
  32: {
    week: 32,
    emoji: '🥦',
    title: 'Tuần 32',
    days: [
      {
        key: '32w0d',
        week: 32,
        dayInWeek: 0,
        content:
          'Bây giờ tần suất cử động thai của con ít đi một chút. Có lẽ con thích máy nhiều hơn vào buổi tối. Mẹ đừng lo lắng. Mẹ hãy đếm thật kỹ nhé, những hoạt động này vẫn có quy luật đấy.',
      },
      {
        key: '32w1d',
        week: 32,
        dayInWeek: 1,
        content:
          'Mẹ ơi, bây giờ con đã nặng như cái súp lơ. Thân hình cũng gần giống như khi con chào đời. Ngày con được gặp mẹ càng lúc càng gần hơn.',
      },
      {
        key: '32w2d',
        week: 32,
        dayInWeek: 2,
        content:
          'Hầu hết xương của con đã cứng lại, nhưng hộp sọ vẫn mềm và chưa khép, giúp con có thể đi qua ống sinh một cách thuận lợi sau này.',
      },
      {
        key: '32w3d',
        week: 32,
        dayInWeek: 3,
        content:
          'Mẹ ơi, lúc nãy con đã vô tình đạp vào ngực mẹ. Con xin lỗi mẹ. Con đang thay đổi tư thế. Đầu con hướng xuống dưới là tư thế đúng nhé mẹ. Tư thế này có lợi cho việc chào đời của con.',
      },
      {
        key: '32w4d',
        week: 32,
        dayInWeek: 4,
        content:
          'Mẹ ơi, thính giác của con đã hoàn thiện rồi. Con có thể phản ứng bằng cử động cơ thể và nét mặt để thể hiện tâm trạng thích hoặc ghét. Mẹ hãy chơi với con nhiều hơn nhé.',
      },
      {
        key: '32w5d',
        week: 32,
        dayInWeek: 5,
        content:
          'Bây giờ con đã có thể thở theo nhịp giống như mẹ. Nhưng phổi của con vẫn chưa hoàn thiện. Để phổi hoạt động, con sẽ nuốt nước ối vào và nhả nước ối ra, tiếp tục tập thở.',
      },
      {
        key: '32w6d',
        week: 32,
        dayInWeek: 6,
        content:
          'Tuy không gian hoạt động của con ngày càng chật hẹp, nhưng con vẫn kiên trì vận động. Mẹ cũng phải tiếp tục ghi lại cử động thai của con và có thể đưa thông tin này cho bác sĩ tham khảo.',
      },
    ],
  },
  33: {
    week: 33,
    emoji: '🌡️',
    title: 'Tuần 33',
    days: [
      {
        key: '33w0d',
        week: 33,
        dayInWeek: 0,
        content:
          'Tuần này, hệ hô hấp và hệ tiêu hóa của con đã gần phát triển hoàn thiện. Hệ thống điều chỉnh nhiệt độ cơ thể bắt đầu hoạt động.',
      },
      {
        key: '33w1d',
        week: 33,
        dayInWeek: 1,
        content:
          'Mẹ ơi, da của con bắt đầu chuyển thành màu hồng, không còn nhăn nheo nữa, mỡ vẫn tiếp tục tích tụ. Con tin rằng con sẽ ngày càng xinh đẹp hơn.',
      },
      {
        key: '33w2d',
        week: 33,
        dayInWeek: 2,
        content:
          'Con bắt đầu làm quen với môi trường xung quanh bao gồm cả các loại tiếng ồn ngoài bụng mẹ hay thế giới nước ối trong tử cung. Mẹ phải đưa con đến những nơi dễ chịu, thoải mái nhiều hơn nhé.',
      },
      {
        key: '33w3d',
        week: 33,
        dayInWeek: 3,
        content:
          'Xương đầu của con còn rất mềm. Giữa mỗi phần xương đầu đều có khe hở. Hai khe hở của xương sọ lần lượt ở thóp trước và thóp sau, phải đợi tới khi chào đời khe hở này mới đóng lại.',
      },
      {
        key: '33w4d',
        week: 33,
        dayInWeek: 4,
        content:
          'Mẹ ơi, nghe nói một số thai nhi đã mọc đầy tóc, còn một số bé khác chỉ có một lớp lông tơ mỏng. Mẹ đoán xem, có phải con là em bé dễ thương với mái tóc dày không?',
      },
      {
        key: '33w5d',
        week: 33,
        dayInWeek: 5,
        content:
          'Dạo gần đây, bác sĩ sẽ chú ý đến ngôi thai của con. Ngôi thai có bình thường hay không sẽ ảnh hưởng trực tiếp đến việc mẹ sinh con. Mẹ đừng lo lắng, nếu ngôi thai của con không đúng, bác sĩ sẽ có biện pháp để điều chỉnh lại.',
      },
      {
        key: '33w6d',
        week: 33,
        dayInWeek: 6,
        content:
          'Chức năng của phổi và dạ dày ruột của con đã gần hoàn thiện. Về cơ bản con có khả năng thở, có thể bài tiết dịch tiêu hóa. Nếu lúc này chào đời, con đã có thể thích nghi với cuộc sống bên ngoài tử cung.',
      },
    ],
  },
  34: {
    week: 34,
    emoji: '🌈',
    title: 'Tuần 34',
    days: [
      {
        key: '34w0d',
        week: 34,
        dayInWeek: 0,
        content:
          'Tuần này, hệ miễn dịch của con đang phát triển nhanh chóng, có thể giúp con chống lại bệnh truyền nhiễm một cách hiệu quả sau khi chào đời. Con ngày càng cố gắng hơn để có thể gặp được mẹ.',
      },
      {
        key: '34w1d',
        week: 34,
        dayInWeek: 1,
        content:
          'Không phải là con trở nên lười biếng đâu. Trong ngôi nhà nhỏ chật chội, con hoạt động chậm chạp hơn trước, thậm chí chỉ có thể nằm ngược đầu ngoan ngoãn thôi.',
      },
      {
        key: '34w2d',
        week: 34,
        dayInWeek: 2,
        content:
          'Con sắp trở thành một em bé mập mạp. Hàm lượng mỡ đã tăng lên tới khoảng 12%. Tay chân đều trở nên tròn trịa. Mẹ có thấy con đáng yêu không?',
      },
      {
        key: '34w3d',
        week: 34,
        dayInWeek: 3,
        content:
          'Mẹ ơi, khuôn mặt nhỏ của con đã phúng phính rồi, da cũng không còn nhăn nheo nữa. Trông con mũm mĩm giống một em bé rồi.',
      },
      {
        key: '34w4d',
        week: 34,
        dayInWeek: 4,
        content:
          'Mẹ ơi, không gian hoạt động trong tử cung đã trở nên chật chội. Lúc con vươn vai, đá chân, có phải mẹ thấy bụng lồi lên không?',
      },
      {
        key: '34w5d',
        week: 34,
        dayInWeek: 5,
        content:
          'Tuy ngón tay của con rất nhỏ, nhưng đã có thể nhìn thấy rõ các móng trên ngón tay. Chúng siêu nhỏ và không vượt quá đầu ngón tay con.',
      },
      {
        key: '34w6d',
        week: 34,
        dayInWeek: 6,
        content:
          'Con ngày càng mập mạp hơn, cơ thể cũng lớn hơn. Mẹ ơi, mẹ có để ý không, đường nét cơ thể con có lúc lằn trên da bụng mẹ, là con rất mong mẹ nhìn thấy con đó.',
      },
    ],
  },
  35: {
    week: 35,
    emoji: '🌟',
    title: 'Tuần 35',
    days: [
      {
        key: '35w0d',
        week: 35,
        dayInWeek: 0,
        content:
          'Hệ thần kinh trung ương của con cũng đã phát triển hoàn thiện. Vì thế bây giờ con dễ thức dậy hơn trước đây. Khi mẹ tỉnh dậy vào ban đêm thì hãy nhẹ nhàng một chút nhé, con phải bắt đầu hình thành nếp ngủ của mình rồi.',
      },
      {
        key: '35w1d',
        week: 35,
        dayInWeek: 1,
        content:
          'Bây giờ con ngày càng lớn hơn, con đã không thể trôi nổi trong nước ối được nữa. Nhưng điều đó không làm giảm niềm đam mê vận động của con! Mẹ phải ghi chép hoạt động của con theo thời gian nhé!',
      },
      {
        key: '35w2d',
        week: 35,
        dayInWeek: 2,
        content:
          'Hai quả thận của con về cơ bản đã phát triển xong, gan cũng có thể chuyển hóa một số chất cặn bã. Mẹ cần giữ thói quen sinh hoạt tốt, bổ sung dinh dưỡng cân bằng mới có thể giúp con phát triển tốt hơn.',
      },
      {
        key: '35w3d',
        week: 35,
        dayInWeek: 3,
        content:
          'Lúc ánh sáng chiếu vào bụng, con cũng sẽ vươn vai thức dậy. Lúc đêm khuya vắng vẻ, con sẽ cùng mẹ nghỉ ngơi, xây dựng chu kỳ sinh hoạt đều đặn mỗi ngày.',
      },
      {
        key: '35w4d',
        week: 35,
        dayInWeek: 4,
        content:
          'Giờ đây, thính giác của con đã phát triển đầy đủ. Âm sắc thanh và cao càng thu hút sự chú ý của con hơn. Chi bằng mẹ hãy kể cho con một vài câu chuyện hay mẹ nhé.',
      },
      {
        key: '35w5d',
        week: 35,
        dayInWeek: 5,
        content:
          'Con càng lúc càng mũm mĩm, thân hình trở nên mập mạp, cân nặng không ngừng tăng lên. Mỡ dưới da cũng sắp hình thành rồi, nó sẽ giúp điều chỉnh nhiệt độ cơ thể con sau khi chào đời.',
      },
      {
        key: '35w6d',
        week: 35,
        dayInWeek: 6,
        content:
          'Mẹ ơi, thành tử cung và thành bụng của mẹ ngày càng mỏng, con cũng đang dần dần lớn lên. Mẹ có thấy bàn tay, chân bé nhỏ của con và cả khuỷu tay lồi trên bụng mẹ không.',
      },
    ],
  },
  36: {
    week: 36,
    emoji: '🍼',
    title: 'Tuần 36 — Gần Ngày Sinh',
    days: [
      {
        key: '36w0d',
        week: 36,
        dayInWeek: 0,
        content:
          'Thận của con đã phát triển hoàn toàn rồi. Sau khi chào đời, nước tiểu của con sẽ được sản sinh qua thận. Con đang cố gắng lớn lên, và đồng thời cũng làm cho cân nặng của mẹ tăng lên nhanh chóng.',
      },
      {
        key: '36w1d',
        week: 36,
        dayInWeek: 1,
        content:
          'Con có lẽ đã chuyển sang tư thế đầu hướng xuống dưới rồi. Bây giờ con đang dần dần đi vào khoang chậu. Đây là tư thế thuận lợi nhất để sinh thường. Con sẽ cố gắng duy trì tư thế này.',
      },
      {
        key: '36w2d',
        week: 36,
        dayInWeek: 2,
        content:
          'Móng tay của con lại mọc dài ra rồi. Móng tay có thể dài quá đầu ngón tay. Còn nữa, tóc của con cũng không chịu thua kém, chúng đang cố gắng mọc dài ra. Về cơ bản cũng được 1~2cm rồi.',
      },
      {
        key: '36w3d',
        week: 36,
        dayInWeek: 3,
        content:
          'Mẹ ơi con đang cố gắng lớn lên. Con chiếm thể tích ngày càng nhiều trong tử cung của mẹ. Trọng lượng cơ thể của mẹ và con cũng sẽ đạt đến mức cao nhất, tăng khoảng 11,5~12,5kg.',
      },
      {
        key: '36w4d',
        week: 36,
        dayInWeek: 4,
        content:
          'Hai quả thận của con đã phát triển hoàn toàn. Gan vẫn tiếp tục xử lý một số chất thải của quá trình trao đổi chất. Ngoài ra, lá lách của con cũng đã phát triển xong và có thể tạo ra máu rồi.',
      },
      {
        key: '36w5d',
        week: 36,
        dayInWeek: 5,
        content:
          'Lông tơ bao phủ cơ thể con và lớp chất gây bảo vệ làn da non nớt của con trong nước ối đã bắt đầu rụng. Bây giờ da của con bắt đầu trở nên hồng hào, trơn bóng, vô cùng đáng yêu.',
      },
      {
        key: '36w6d',
        week: 36,
        dayInWeek: 6,
        content:
          'Trong ruột của con tích tụ một lượng phân su nhất định. Đây chính là lượng phân được thải ra lần đầu tiên sau khi con chào đời. Nhưng nếu chào đời quá muộn, con sẽ đào thải trực tiếp phân su vào trong nước ối.',
      },
    ],
  },
  37: {
    week: 37,
    emoji: '🎉',
    title: 'Tuần 37 — Sẵn Sàng Chào Đời',
    days: [
      {
        key: '37w0d',
        week: 37,
        dayInWeek: 0,
        content:
          'Chiều cao của con khoảng 49cm, cân nặng khoảng 3kg. Tốc độ phát triển bắt đầu chậm dần cho tới khi sinh ra. Giờ đây con có thể gặp mẹ bất cứ lúc nào.',
      },
      {
        key: '37w1d',
        week: 37,
        dayInWeek: 1,
        content:
          'Đầu của con đã di chuyển vào khoang xương chậu của mẹ. Bây giờ xung quanh con được bảo vệ bởi khung xương chậu, rất an toàn. Hơn nữa cũng có thêm nhiều không gian hơn để con cố gắng lớn lên.',
      },
      {
        key: '37w2d',
        week: 37,
        dayInWeek: 2,
        content:
          'Phổi và các cơ quan hô hấp khác của con đã phát triển hoàn thiện. Nếu sinh ra vào lúc này thì con cũng có thể tự sống được rồi. Mỗi ngày lượng mỡ tăng lên khoảng 38g, giúp con không bị lạnh.',
      },
      {
        key: '37w3d',
        week: 37,
        dayInWeek: 3,
        content:
          'Con đang tập thở. Do không gian hoạt động chật hẹp, nên nhóc quậy là con cũng sẽ im lặng hơn khá nhiều. Đành phải chờ tới lúc chào đời rồi mới tiếp tục vui chơi.',
      },
      {
        key: '37w4d',
        week: 37,
        dayInWeek: 4,
        content:
          'Mẹ ơi, mẹ không cần lo lắng quá về việc tóc của con quá mỏng, quá thưa. Sau khi chào đời, tóc con vẫn có thể trở nên dày và bóng mượt.',
      },
      {
        key: '37w5d',
        week: 37,
        dayInWeek: 5,
        content:
          'Bây giờ con phát triển chậm hơn rất nhiều so với trước đây. Các động tác mạnh của con cũng ít hơn rồi. Mẹ phải tiếp tục theo dõi nhịp tim và cử động thai của con nhé, vì lúc này con có thể gặp mẹ bất cứ lúc nào.',
      },
      {
        key: '37w6d',
        week: 37,
        dayInWeek: 6,
        content:
          'Tư thế và ngôi thai của con gần như đã được xác định. Nếu ngôi thai không thuận, mà bác sĩ cũng không thể giúp con chỉnh lại được thì có lẽ mẹ sẽ phải sinh mổ.',
      },
    ],
  },
  38: {
    week: 38,
    emoji: '🌺',
    title: 'Tuần 38',
    days: [
      {
        key: '38w0d',
        week: 38,
        dayInWeek: 0,
        content:
          'Trước khi con chuẩn bị vào đường sinh, con vẫn sẽ tiếp tục hấp thu các loại chất dinh dưỡng trong cơ thể mẹ và trong nước ối. Như thế con có thể tăng cường khả năng miễn dịch tốt hơn.',
      },
      {
        key: '38w1d',
        week: 38,
        dayInWeek: 1,
        content:
          'Các cơ quan của con đã phát triển hoàn toàn. Cơ quan tuần hoàn mà đứng đầu là tim, phổi, gan, cơ quan hô hấp, cơ quan tiêu hóa đã hình thành đầy đủ. Con đã có khả năng sinh tồn độc lập ngoài bụng mẹ.',
      },
      {
        key: '38w2d',
        week: 38,
        dayInWeek: 2,
        content:
          'Phổi và đại não của con về cơ bản có thể phát huy được chức năng. Con có thể hô hấp độc lập và não bộ đã có ý thức đơn giản. Khả năng này sẽ tiếp tục phát triển trong suốt thời thơ ấu sau khi con chào đời.',
      },
      {
        key: '38w3d',
        week: 38,
        dayInWeek: 3,
        content:
          'Lông tơ đã từng bao phủ cơ thể con về cơ bản đã biến mất, nhưng vẫn có một số tồn tại cho tới lúc sinh ra. Đến lúc đó, mẹ có thể thấy lông tơ còn sót lại ở vai, trán và cổ của con.',
      },
      {
        key: '38w4d',
        week: 38,
        dayInWeek: 4,
        content:
          'Đặc trưng trẻ sơ sinh ở con càng lúc càng rõ rệt. Lúc này con đã có thể khóc to. Nhưng lần khóc đầu tiên thường sẽ không có nước mắt.',
      },
      {
        key: '38w5d',
        week: 38,
        dayInWeek: 5,
        content:
          'Mẹ ơi, chiều dài dây rốn của con khoảng 30~100cm, đường kính là 0,8~2,0cm. Trước khi chào đời, con vẫn tiếp tục hấp thu chất dinh dưỡng qua dây rốn.',
      },
      {
        key: '38w6d',
        week: 38,
        dayInWeek: 6,
        content:
          'Lớp mỡ tăng trưởng giúp da của con dần trở nên không còn trong suốt nữa. Da của con bắt đầu chuyển dần từ màu đỏ hoặc màu hồng sang màu trắng.',
      },
    ],
  },
  39: {
    week: 39,
    emoji: '🕊️',
    title: 'Tuần 39',
    days: [
      {
        key: '39w0d',
        week: 39,
        dayInWeek: 0,
        content:
          'Bây giờ con vẫn đang tiếp tục tăng lượng mỡ và cũng đang không ngừng dự trữ năng lượng. Phổi sẽ là cơ quan cuối cùng của con hoàn thiện.',
      },
      {
        key: '39w1d',
        week: 39,
        dayInWeek: 1,
        content:
          'Xương sọ của con vẫn chưa cố định hoàn toàn. Xương sọ bây giờ vẫn được tạo bởi năm mảnh xương lớn riêng biệt. Khi chào đời, năm mảnh xương này sẽ ép trực tiếp vào nhau.',
      },
      {
        key: '39w2d',
        week: 39,
        dayInWeek: 2,
        content:
          'Các cơ quan của con đã phát triển xong. Vài giờ sau khi con chào đời, cơ quan phổi mới có thể thiết lập hệ hô hấp bình thường.',
      },
      {
        key: '39w3d',
        week: 39,
        dayInWeek: 3,
        content:
          'Mẹ ơi, nước ối lúc này đã trở nên hơi đục, có màu trắng sữa. Đó là do lông tơ và lớp chất gây trên bề mặt cơ thể con bong ra, bên cạnh đó là các chất bài tiết khác thải vào nước ối.',
      },
      {
        key: '39w4d',
        week: 39,
        dayInWeek: 4,
        content:
          'Phần ngực của con ngày càng nhô lên. Đó là do gan to lên tự nhiên dưới tác dụng đặc biệt trong quá trình sản xuất tế bào hồng cầu. Vì thế khi sinh ra bụng của con vừa lớn, vừa tròn.',
      },
      {
        key: '39w5d',
        week: 39,
        dayInWeek: 5,
        content:
          'Mẹ ơi, đa phần các chức năng của nhau thai bắt đầu thoái hóa, xuất hiện những vết vôi hóa và cục máu trên diện tích lớn. Đến khi con chào đời, nhau thai sẽ hoàn toàn "không còn tác dụng".',
      },
      {
        key: '39w6d',
        week: 39,
        dayInWeek: 6,
        content:
          'Các cơ quan con đã phát triển đầy đủ và vô cùng nhạy bén. Tay chân con cũng chắc khỏe. Con đang kiên nhẫn chờ đợi thế giới tuyệt vời bên ngoài, và khoảnh khắc đó sắp tới rồi.',
      },
    ],
  },
  40: {
    week: 40,
    emoji: '🎊',
    title: 'Tuần 40 — Ngày Dự Sinh',
    days: [
      {
        key: '40w0d',
        week: 40,
        dayInWeek: 0,
        content:
          'Thời gian trôi thật nhanh. Con đã bước vào ngày dự sinh rồi. Xác suất con sinh ra đúng vào ngày dự sinh không cao. Mẹ phải chuẩn bị tinh thần nhé.',
      },
      {
        key: '40w1d',
        week: 40,
        dayInWeek: 1,
        content:
          'Mẹ ơi, cho dù chưa có dấu hiệu sinh, mẹ cũng đừng lo lắng. Có lẽ con chính là một nhóc quậy, muốn nằm thêm trong bụng mẹ vài ngày nữa. Chậm hơn hai tuần so với ngày dự sinh là điều bình thường.',
      },
      {
        key: '40w2d',
        week: 40,
        dayInWeek: 2,
        content:
          'Ngày nào con cũng nỗ lực, tiếp tục hấp thu nhiều chất dinh dưỡng hơn, không ngừng tích trữ năng lượng cho mình. Như thế rất có ích cho việc điều hòa thân nhiệt của con sau khi sinh.',
      },
      {
        key: '40w3d',
        week: 40,
        dayInWeek: 3,
        content:
          'Cùng với nước ối, con sẽ nuốt lông tơ, chất gây và các chất bài tiết khác mà mình tiết ra, giữ chúng lại trong ruột và thải ra ngoài trong vòng một, hai ngày sau khi con chào đời.',
      },
      {
        key: '40w4d',
        week: 40,
        dayInWeek: 4,
        content:
          'Mẹ ơi, xương trên đầu con vẫn chưa nối liền lại với nhau. Đó là để giúp đầu con chui qua ống sinh dễ dàng hơn trong quá trình chuyển dạ.',
      },
      {
        key: '40w5d',
        week: 40,
        dayInWeek: 5,
        content:
          'Mẹ ơi, cho dù bây giờ con mọc đầy tóc hay chỉ có một chút tóc tơ thì mẹ cũng không cần phải lo lắng. Đó là hiện tượng bình thường. Sau khi con sinh ra, chắc chắn con sẽ rất xinh đẹp.',
      },
      {
        key: '40w6d',
        week: 40,
        dayInWeek: 6,
        content:
          'Lớp da bên ngoài của con đang bong ra, thay vào đó là lớp da mới bên dưới. Mẹ có mong chờ gặp con không? Sự thay đổi hoàn toàn mới giúp con xinh đẹp và dễ thương hơn.',
      },
    ],
  },
  41: {
    week: 41,
    emoji: '⏳',
    title: 'Tuần 41',
    days: [
      {
        key: '41w0d',
        week: 41,
        dayInWeek: 0,
        content:
          'Mẹ ơi, con đã chuẩn bị xong và có thể ra gặp mẹ bất cứ lúc nào! Mẹ phải luôn chú ý đến tình hình sức khỏe của chính mình, sẵn sàng chuẩn bị đón con.',
      },
      {
        key: '41w1d',
        week: 41,
        dayInWeek: 1,
        content:
          'Mẹ ơi, con đã quá ngày dự sinh một tuần rồi. Da con có thể khô như giấy da, cơ thể hơi thừa cân. Nếu mẹ muốn nhanh được gặp con thì mẹ có thể hỏi ý kiến tư vấn của bác sĩ.',
      },
      {
        key: '41w2d',
        week: 41,
        dayInWeek: 2,
        content:
          'Lúc này, do chức năng bài tiết của màng ối giảm, lượng nước ối sẽ giảm xuống. Mẹ nhớ kiểm tra định kỳ, chú ý thật kỹ tới lượng nước ối nhé. Bởi nước ối quá ít sẽ làm chậm thời gian mẹ và con gặp nhau!',
      },
      {
        key: '41w3d',
        week: 41,
        dayInWeek: 3,
        content:
          'Con đã "chuẩn bị kỹ lưỡng, sẵn sàng lên đường". Bây giờ chỉ còn thiếu "thời cơ" nữa thôi. Mẹ phải kiên nhẫn chờ đợi, con mong chờ lần đầu tiên được gặp mẹ.',
      },
      {
        key: '41w4d',
        week: 41,
        dayInWeek: 4,
        content:
          'Gần đây, da con khô và nhăn hơn, móng tay móng chân cũng dài ra, thực sự giống "cụ già tí hon" lắm đó! Mẹ cần ăn nhiều thực phẩm giàu protein, nhiều năng lượng để bổ sung năng lượng cho con.',
      },
      {
        key: '41w5d',
        week: 41,
        dayInWeek: 5,
        content:
          'Bây giờ con đã phát triển hoàn thiện rồi, nhu cầu oxy của con cũng tăng lên. Mẹ phải nhớ bổ sung oxy kịp thời, nếu không ở trong này con sẽ cảm thấy khó chịu.',
      },
      {
        key: '41w6d',
        week: 41,
        dayInWeek: 6,
        content:
          'Mẹ ơi, bây giờ con đã trở nên vô cùng cứng cáp trong bụng của mẹ rồi. Mặc dù con rất muốn ra ngoài gặp mẹ, nhưng con vẫn hơi "lười". Vì thế, nhờ các cô, chú bác sĩ "giúp" con ạ!',
      },
    ],
  },
  42: {
    week: 42,
    emoji: '🌸',
    title: 'Tuần 42',
    days: [
      {
        key: '42w0d',
        week: 42,
        dayInWeek: 0,
        content:
          'Mẹ ơi, lúc nào con cũng muốn ra ngoài để gặp mẹ. Mẹ có vừa mong chờ, vừa lo lắng không ạ? Mẹ đừng lo, mọi thứ sẽ như mẹ tưởng tượng. Mẹ càng mong chờ thì kết quả sẽ càng tốt đẹp. ❤️',
      },
    ],
  },
};

export function getFetalDayEntry(week: number, dayInWeek: number): FetalDayEntry | undefined {
  return FETAL_DEVELOPMENT[week]?.days.find((d) => d.dayInWeek === dayInWeek);
}
