import { useState } from "react";

function KBSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-primary/15 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-card/20 hover:bg-primary/5 transition-colors"
      >
        <span className="text-sm font-semibold text-primary/80 uppercase tracking-widest">{title}</span>
        <span className={`text-primary/60 transition-transform duration-300 ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="px-5 py-4 bg-card/10 border-t border-primary/10 space-y-4 text-sm text-foreground/80 animate-in fade-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

function KBTable({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-primary/10">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-primary/10">
            {headers.map((h, i) => (
              <th key={i} className="px-3 py-2 text-left text-primary/70 font-semibold uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? "bg-background/20" : "bg-background/5"}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 text-foreground/75 border-t border-primary/5">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function KBGrid({ items }: { items: { label: string; value: string; sub?: string; color?: string }[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-primary/10 bg-background/20 px-3 py-2 text-center">
          <div className={`font-bold text-sm ${item.color ?? "text-primary"}`}>{item.label}</div>
          <div className="text-xs text-foreground/60 mt-0.5">{item.value}</div>
          {item.sub && <div className="text-[10px] text-muted-foreground mt-0.5">{item.sub}</div>}
        </div>
      ))}
    </div>
  );
}

export function NumerologyKnowledge() {
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-widest text-muted-foreground text-center py-2">Nguồn tri thức — Thần Số Học</p>

      <KBSection title="Hệ thống Pythagore">
        <p className="leading-relaxed">
          Thần số học ứng dụng trong trang web dựa trên hệ thống <strong className="text-primary">Pythagore</strong> — phương pháp phổ biến nhất toàn cầu, do Pythagoras (580–495 TCN) xây dựng. Mỗi chữ cái trong tên được chuyển đổi thành con số từ 1 đến 9 theo bảng tương ứng sau:
        </p>
        <KBTable
          headers={["Số", "Chữ cái"]}
          rows={[
            ["1", "A, J, S"],
            ["2", "B, K, T"],
            ["3", "C, L, U"],
            ["4", "D, M, V"],
            ["5", "E, N, W"],
            ["6", "F, O, X"],
            ["7", "G, P, Y"],
            ["8", "H, Q, Z"],
            ["9", "I, R"],
          ]}
        />
        <p className="text-xs text-muted-foreground">Dấu tiếng Việt được chuẩn hóa về dạng Latin trước khi tra bảng (ă→a, đ→d, ơ→o, ư→u, v.v.).</p>
      </KBSection>

      <KBSection title="Quy tắc thu gọn số">
        <p className="leading-relaxed">
          Mọi con số đều được cộng các chữ số lại và lặp lại cho đến khi ra số từ 1–9, hoặc dừng lại tại <strong className="text-primary">số Master</strong> nếu tổng trung gian là 11, 22, hoặc 33.
        </p>
        <div className="bg-background/30 rounded-lg px-4 py-3 font-mono text-xs space-y-1 border border-primary/10">
          <div>Ví dụ (Ngày sinh 15/08/1990):</div>
          <div className="text-primary">1+5+0+8+1+9+9+0 = 33 → Số Master 33</div>
          <div>Ví dụ khác (14/03/1985):</div>
          <div className="text-primary">1+4+0+3+1+9+8+5 = 31 → 3+1 = <strong>4</strong></div>
        </div>
      </KBSection>

      <KBSection title="4 chỉ số chính">
        <KBTable
          headers={["Chỉ số", "Nguồn tính", "Ý nghĩa"]}
          rows={[
            ["Số đường đời", "Tổng tất cả chữ số trong ngày tháng năm sinh", "Con đường và sứ mệnh trong cuộc đời"],
            ["Số linh hồn", "Tổng giá trị các nguyên âm (A, E, I, O, U) trong tên", "Khát vọng và động lực nội tâm sâu thẳm"],
            ["Số định mệnh", "Tổng giá trị tất cả chữ cái trong tên đầy đủ", "Sứ mệnh cuộc đời và cách thế giới nhìn bạn"],
            ["Số nhân cách", "Tổng giá trị các phụ âm trong tên", "Hình ảnh bạn thể hiện ra bên ngoài"],
          ]}
        />
      </KBSection>

      <KBSection title="Số Master (11 — 22 — 33)">
        <p className="leading-relaxed">
          Ba số Master mang tần số rung động cao hơn và không bị thu gọn thêm. Chúng mang sứ mệnh đặc biệt nhưng cũng đòi hỏi nỗ lực lớn hơn để hoàn thành.
        </p>
        <KBGrid
          items={[
            { label: "11", value: "Người Khai Sáng", sub: "Trực giác · Truyền cảm hứng", color: "text-yellow-400" },
            { label: "22", value: "Kiến Trúc Sư Vĩ Đại", sub: "Tầm nhìn · Thực thi lớn", color: "text-yellow-400" },
            { label: "33", value: "Bậc Thầy Chữa Lành", sub: "Tình yêu · Hy sinh · Bao dung", color: "text-yellow-400" },
          ]}
        />
      </KBSection>
    </div>
  );
}

export function BatuKnowledge() {
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-widest text-muted-foreground text-center py-2">Nguồn tri thức — Bát Tự Tứ Trụ</p>

      <KBSection title="Hệ thống Tứ Trụ">
        <p className="leading-relaxed">
          Bát Tự (四柱八字) là hệ thống chiêm tinh Trung Hoa cổ đại dựa trên <strong className="text-primary">Tứ Trụ</strong> — bốn cột trụ tương ứng với Năm, Tháng, Ngày và Giờ sinh. Mỗi trụ gồm một <em>Thiên Can</em> và một <em>Địa Chi</em>, tạo thành 8 chữ (bát tự).
        </p>
        <KBGrid
          items={[
            { label: "Trụ Năm", value: "Tổ tiên · Tuổi tác", color: "text-blue-400" },
            { label: "Trụ Tháng", value: "Cha mẹ · Sự nghiệp", color: "text-green-400" },
            { label: "Trụ Ngày", value: "Bản thân · Hôn nhân", color: "text-yellow-400" },
            { label: "Trụ Giờ", value: "Con cái · Tương lai", color: "text-orange-400" },
          ]}
        />
      </KBSection>

      <KBSection title="Thập Thiên Can">
        <KBTable
          headers={["Can", "Hành", "Âm/Dương", "Đặc tính"]}
          rows={[
            ["Giáp", "Mộc", "Dương", "Cứng rắn, tiên phong, thẳng thắn"],
            ["Ất", "Mộc", "Âm", "Linh hoạt, mềm mỏng, kiên trì"],
            ["Bính", "Hỏa", "Dương", "Nhiệt huyết, rực rỡ, hào phóng"],
            ["Đinh", "Hỏa", "Âm", "Ấm áp, tinh tế, khéo léo"],
            ["Mậu", "Thổ", "Dương", "Vững chắc, bao dung, trung thực"],
            ["Kỷ", "Thổ", "Âm", "Cẩn thận, tỉ mỉ, thực tế"],
            ["Canh", "Kim", "Dương", "Cương quyết, mạnh mẽ, chính trực"],
            ["Tân", "Kim", "Âm", "Tinh tế, nhạy cảm, thẩm mỹ"],
            ["Nhâm", "Thủy", "Dương", "Thông minh, linh hoạt, phiêu lưu"],
            ["Quý", "Thủy", "Âm", "Sâu sắc, trực giác, bí ẩn"],
          ]}
        />
      </KBSection>

      <KBSection title="Thập Nhị Địa Chi">
        <KBTable
          headers={["Chi", "Con giáp", "Hành", "Giờ tương ứng"]}
          rows={[
            ["Tý", "Chuột", "Thủy", "23h–01h"],
            ["Sửu", "Trâu", "Thổ", "01h–03h"],
            ["Dần", "Hổ", "Mộc", "03h–05h"],
            ["Mão", "Mèo", "Mộc", "05h–07h"],
            ["Thìn", "Rồng", "Thổ", "07h–09h"],
            ["Tỵ", "Rắn", "Hỏa", "09h–11h"],
            ["Ngọ", "Ngựa", "Hỏa", "11h–13h"],
            ["Mùi", "Dê", "Thổ", "13h–15h"],
            ["Thân", "Khỉ", "Kim", "15h–17h"],
            ["Dậu", "Gà", "Kim", "17h–19h"],
            ["Tuất", "Chó", "Thổ", "19h–21h"],
            ["Hợi", "Lợn", "Thủy", "21h–23h"],
          ]}
        />
      </KBSection>

      <KBSection title="Tương sinh & Tương khắc Ngũ Hành">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-green-400 uppercase tracking-wider">Tương sinh (hỗ trợ nhau)</p>
            <div className="space-y-1 text-xs">
              {[
                "Mộc → Hỏa (gỗ nuôi lửa)",
                "Hỏa → Thổ (lửa tạo tro)",
                "Thổ → Kim (đất sinh kim)",
                "Kim → Thủy (kim tạo nước)",
                "Thủy → Mộc (nước nuôi cây)",
              ].map((line, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                  <span className="text-foreground/70">{line}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">Tương khắc (kìm hãm nhau)</p>
            <div className="space-y-1 text-xs">
              {[
                "Mộc khắc Thổ (rễ phá đất)",
                "Thổ khắc Thủy (đất hút nước)",
                "Thủy khắc Hỏa (nước dập lửa)",
                "Hỏa khắc Kim (lửa nung kim)",
                "Kim khắc Mộc (kim chặt cây)",
              ].map((line, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  <span className="text-foreground/70">{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Lưu ý: Phiên bản hiện tại sử dụng thuật toán tính Tứ Trụ đơn giản hóa. Tứ Trụ chính xác yêu cầu tra cứu lịch vạn niên và tiết khí mặt trời chuyên sâu.
        </p>
      </KBSection>
    </div>
  );
}

export function IChingKnowledge() {
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-widest text-muted-foreground text-center py-2">Nguồn tri thức — I Ching (Kinh Dịch)</p>

      <KBSection title="Tổng quan Kinh Dịch">
        <p className="leading-relaxed">
          Kinh Dịch (易經 — I Ching) là bộ kinh điển cổ nhất của Trung Quốc, được hình thành từ khoảng 1000 TCN. Hệ thống gồm <strong className="text-primary">64 quẻ</strong>, mỗi quẻ có 6 hào (hào âm yin ‐‐ hoặc hào dương yang ——), biểu trưng cho mọi trạng thái biến đổi của vũ trụ.
        </p>
        <KBGrid
          items={[
            { label: "64", value: "Quẻ (Hexagram)", color: "text-primary" },
            { label: "6", value: "Hào mỗi quẻ", color: "text-primary" },
            { label: "8", value: "Bát Quái (Trigram)", color: "text-primary" },
            { label: "2", value: "Loại hào: âm & dương", color: "text-primary" },
          ]}
        />
      </KBSection>

      <KBSection title="Bát Quái — 8 Quẻ Đơn">
        <KBTable
          headers={["Quẻ", "Ký hiệu", "Tên", "Tượng", "Hành"]}
          rows={[
            ["☰", "Càn", "乾", "Trời — thuần dương", "Kim"],
            ["☷", "Khôn", "坤", "Đất — thuần âm", "Thổ"],
            ["☳", "Chấn", "震", "Sấm — vận động", "Mộc"],
            ["☴", "Tốn", "巽", "Gió — thâm nhập", "Mộc"],
            ["☵", "Khảm", "坎", "Nước — hiểm trở", "Thủy"],
            ["☲", "Ly", "離", "Lửa — sáng rõ", "Hỏa"],
            ["☶", "Cấn", "艮", "Núi — dừng lại", "Thổ"],
            ["☱", "Đoài", "兌", "Đầm — vui vẻ", "Kim"],
          ]}
        />
      </KBSection>

      <KBSection title="Phương pháp gieo quẻ">
        <p className="leading-relaxed">
          Phương pháp truyền thống: Tung <strong className="text-primary">3 đồng xu</strong> 6 lần để tạo 6 hào từ dưới lên trên.
        </p>
        <KBTable
          headers={["Kết quả 3 xu", "Hào", "Loại"]}
          rows={[
            ["3 sấp (PPP)", "——— (6)", "Dương biến — hào động"],
            ["2 ngửa + 1 sấp (NNP)", "—— —— (7)", "Dương tĩnh"],
            ["2 sấp + 1 ngửa (PPN)", "— — (8)", "Âm tĩnh"],
            ["3 ngửa (NNN)", "—✕— (9)", "Âm biến — hào động"],
          ]}
        />
        <p className="text-xs text-muted-foreground">
          Ứng dụng sử dụng thuật toán ngẫu nhiên xác suất tương đương phương pháp đồng xu để tạo quẻ tức thời.
        </p>
      </KBSection>

      <KBSection title="Cấu trúc một quẻ">
        <div className="space-y-2">
          <p className="leading-relaxed">Mỗi quẻ gồm 2 quẻ đơn (trigram) chồng lên nhau:</p>
          <div className="bg-background/30 rounded-lg px-4 py-3 text-xs space-y-1 border border-primary/10 font-mono">
            <div className="text-muted-foreground">— Hào 6 (trên cùng)</div>
            <div className="text-muted-foreground">— Hào 5</div>
            <div className="text-primary">— Hào 4 ← Thượng quái (trigram trên)</div>
            <div className="text-muted-foreground">— — Hào 3</div>
            <div className="text-muted-foreground">— — Hào 2</div>
            <div className="text-primary">— — Hào 1 ← Hạ quái (trigram dưới)</div>
          </div>
          <p className="text-xs text-muted-foreground">
            Tên quẻ kép = Thượng quái + Hạ quái. Ví dụ: Càn (☰) + Khảm (☵) = Quẻ Nhu (天水訟 · Thiên Thủy Tụng).
          </p>
        </div>
      </KBSection>
    </div>
  );
}

export function TuViKnowledge() {
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-widest text-muted-foreground text-center py-2">Nguồn tri thức — Tử Vi Đẩu Số</p>

      <KBSection title="Tử Vi Đẩu Số là gì?">
        <p className="leading-relaxed">
          <strong className="text-primary">Tử Vi Đẩu Số</strong> (紫微斗數) là hệ thống chiêm tinh cổ truyền Trung Hoa, tương truyền do đạo sĩ <em>Trần Đoàn</em> (陳摶) thời Ngũ Đại (thế kỷ X) sáng lập. Hệ thống dựa trên ngày giờ sinh âm lịch để bố trí <strong className="text-primary">14 Chính Tinh</strong> và hàng chục phụ tinh vào <strong className="text-primary">12 Cung</strong>, tạo nên một "lá số" phản ánh vận mệnh trọn đời.
        </p>
        <KBGrid
          items={[
            { label: "14", value: "Chính Tinh chủ đạo", color: "text-primary" },
            { label: "12", value: "Cung Mệnh", color: "text-primary" },
            { label: "100+", value: "Phụ tinh & Sát tinh", color: "text-primary" },
            { label: "5", value: "Mệnh Cục Ngũ Hành", color: "text-primary" },
          ]}
        />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Khác với Bát Tự (dùng dương lịch), Tử Vi sử dụng <strong>ngày tháng năm âm lịch</strong> và <strong>giờ sinh</strong> để xác định vị trí cung mệnh và an sao. Phiên bản này sử dụng thuật toán đơn giản hóa phù hợp cho tham khảo phổ thông.
        </p>
      </KBSection>

      <KBSection title="12 Cung Mệnh">
        <p className="leading-relaxed mb-2">Mỗi cung ứng với một lĩnh vực quan trọng trong cuộc đời. Cung Mệnh là cung quan trọng nhất, cung Thân cho thấy ảnh hưởng ngoại cảnh.</p>
        <KBTable
          headers={["Cung", "Lĩnh vực", "Ý nghĩa chính"]}
          rows={[
            ["Mệnh", "Bản thân", "Tính cách, ngoại hình, vận mệnh tổng quan"],
            ["Phụ Mẫu", "Cha mẹ & Bề trên", "Quan hệ cha mẹ, ông chủ, văn bằng, tài liệu"],
            ["Phúc Đức", "Phúc phần & Tâm linh", "Phúc báu tích lũy, cuộc sống tinh thần, an nhiên"],
            ["Điền Trạch", "Bất động sản", "Nhà cửa, đất đai, môi trường sống"],
            ["Quan Lộc", "Sự nghiệp", "Công việc, địa vị, quyền lực, danh vọng"],
            ["Nô Bộc", "Bạn bè & Cấp dưới", "Nhân viên, bạn hữu, hợp tác viên"],
            ["Thiên Di", "Di chuyển & Ngoại giao", "Du lịch, xuất ngoại, quan hệ xã hội bên ngoài"],
            ["Tật Ách", "Sức khỏe & Tai nạn", "Bệnh tật, rủi ro thân thể, nghịch cảnh"],
            ["Tài Bạch", "Tài chính", "Thu nhập, chi tiêu, khả năng kiếm tiền"],
            ["Tử Tức", "Con cái & Sáng tạo", "Con cái, đệ tử, dự án sáng tạo"],
            ["Phu Thê", "Hôn nhân & Tình cảm", "Vợ/chồng, đối tác, tình duyên"],
            ["Huynh Đệ", "Anh chị em & Đồng nghiệp", "Anh em ruột, bạn đồng hành, đồng nghiệp"],
          ]}
        />
      </KBSection>

      <KBSection title="14 Chính Tinh">
        <p className="leading-relaxed mb-2">
          14 Chính Tinh được chia thành hai nhóm: <strong className="text-primary">Tử Vi hệ</strong> (7 sao cung trên) và <strong className="text-primary">Thiên Phủ hệ</strong> (7 sao cung dưới).
        </p>
        <KBTable
          headers={["Sao", "Ngũ Hành", "Nhóm", "Đặc tính"]}
          rows={[
            ["Tử Vi", "Thổ", "Tử Vi hệ", "Đế vương, quyền lực, lãnh đạo, địa vị cao"],
            ["Thiên Cơ", "Mộc", "Tử Vi hệ", "Trí tuệ, mưu lược, linh hoạt, tư duy sáng tạo"],
            ["Thái Dương", "Hỏa", "Tử Vi hệ", "Ánh sáng, phú quý, nam giới, hào phóng"],
            ["Vũ Khúc", "Kim", "Tử Vi hệ", "Tài phú, cứng rắn, quyết đoán, vật chất"],
            ["Thiên Đồng", "Thủy", "Tử Vi hệ", "Phúc đức, hòa thuận, thư thái, hưởng thụ"],
            ["Liêm Trinh", "Hỏa", "Tử Vi hệ", "Nguyên tắc, đạo đức, thị phi, văn học"],
            ["Thiên Phủ", "Thổ", "Thiên Phủ hệ", "Kho tàng, bảo vệ, ổn định, giàu có"],
            ["Thái Âm", "Thủy", "Thiên Phủ hệ", "Trực giác, nữ giới, cảm xúc, nghệ thuật"],
            ["Tham Lang", "Thủy/Mộc", "Thiên Phủ hệ", "Đa dục, hấp dẫn, tài năng đa diện"],
            ["Cự Môn", "Thủy", "Thiên Phủ hệ", "Ngôn từ, tranh luận, khẩu thiệt, thị phi"],
            ["Thiên Tướng", "Thủy", "Thiên Phủ hệ", "Quan chức, pháp luật, công bằng, tổ chức"],
            ["Thiên Lương", "Mộc", "Thiên Phủ hệ", "Y dược, đạo đức, thọ mạng, nhân từ"],
            ["Thất Sát", "Kim/Hỏa", "Thiên Phủ hệ", "Dũng khí, chinh phạt, thử thách, đột phá"],
            ["Phá Quân", "Thủy", "Thiên Phủ hệ", "Cải tổ, phá cách, cách mạng, đột biến"],
          ]}
        />
      </KBSection>

      <KBSection title="Mệnh Cục — 5 Cục Ngũ Hành">
        <p className="leading-relaxed mb-2">
          Mệnh Cục xác định "vận tốc" an sao và màu sắc năng lượng bản mệnh, được tính từ Nạp Âm của can chi năm sinh.
        </p>
        <KBGrid
          items={[
            { label: "Thủy Nhị Cục", value: "Cục số 2", sub: "Thủy: trí tuệ, linh hoạt, thích nghi", color: "text-blue-400" },
            { label: "Mộc Tam Cục", value: "Cục số 3", sub: "Mộc: phát triển, sinh sôi, hướng thượng", color: "text-green-400" },
            { label: "Kim Tứ Cục", value: "Cục số 4", sub: "Kim: cứng rắn, kiên định, quyết đoán", color: "text-slate-300" },
            { label: "Thổ Ngũ Cục", value: "Cục số 5", sub: "Thổ: vững chắc, bao dung, trung tâm", color: "text-yellow-500" },
            { label: "Hỏa Lục Cục", value: "Cục số 6", sub: "Hỏa: nhiệt huyết, rực rỡ, hào phóng", color: "text-red-400" },
          ]}
        />
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          Số của cục (2–6) là bước nhảy dùng để đặt sao Tử Vi vào đúng cung tương ứng với ngày sinh âm lịch.
        </p>
      </KBSection>

      <KBSection title="Cách đọc lá số cơ bản">
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-primary/80 uppercase tracking-wider mb-1.5">Bước 1 — Xác định Cung Mệnh & Cung Thân</p>
            <p className="text-xs text-foreground/75 leading-relaxed">Cung Mệnh = vị trí chứa sao an theo tháng sinh và giờ sinh. Cung Thân = vị trí ảnh hưởng của ngoại cảnh và hoàn cảnh sống. Hai cung này là trọng tâm phân tích đầu tiên.</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-primary/80 uppercase tracking-wider mb-1.5">Bước 2 — Xem Chính Tinh trong Cung Mệnh</p>
            <p className="text-xs text-foreground/75 leading-relaxed">Chính tinh tọa mệnh quyết định phần lớn tính cách và vận mệnh. Sao vượng địa (đặc biệt trong cung tương sinh) mang lực mạnh hơn sao hãm địa (cung tương khắc).</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-primary/80 uppercase tracking-wider mb-1.5">Bước 3 — Phân tích từng cung theo lĩnh vực</p>
            <p className="text-xs text-foreground/75 leading-relaxed">Nhấn vào từng cung trong lá số để xem chi tiết các sao bên trong và ý nghĩa của từng sao với lĩnh vực đó. Cung Quan Lộc (sự nghiệp), Tài Bạch (tài chính) và Phu Thê (hôn nhân) thường được quan tâm nhất.</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-primary/80 uppercase tracking-wider mb-1.5">Bước 4 — Kết hợp AI luận giải</p>
            <p className="text-xs text-foreground/75 leading-relaxed">Sau khi chọn một cung cụ thể, nhấn "Luận giải AI" để nhận phân tích chuyên sâu về cung đó trong bối cảnh toàn bộ lá số.</p>
          </div>
        </div>
      </KBSection>
    </div>
  );
}

export function CatHungKnowledge() {
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-widest text-muted-foreground text-center py-2">Nguồn tri thức — Cát Hung Số</p>

      <KBSection title="Nền tảng lý thuyết">
        <p className="leading-relaxed">
          Hệ thống cát hung số kết hợp <strong className="text-primary">huyền số học phương Đông</strong> (phổ biến tại Trung Hoa, Việt Nam, Hàn Quốc) và chiết âm tiếng Quảng Đông/Việt. Mỗi chữ số mang âm vận gần với các từ có nghĩa cát (may mắn) hoặc hung (xui xẻo), từ đó hình thành điểm năng lượng cơ bản.
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Ví dụ: Số 8 (Bát) phát âm gần "Phát" (giàu có), số 4 (Tứ) gần "Tử" (chết) trong tiếng Quảng Đông và Việt cổ.
        </p>
      </KBSection>

      <KBSection title="Điểm cơ bản từng chữ số">
        <KBTable
          headers={["Số", "Tên gọi", "Hành", "Ý nghĩa", "Điểm"]}
          rows={[
            ["0", "Không", "Thủy", "Trống rỗng, vô cực, tiềm năng ẩn", "0"],
            ["1", "Nhất", "Dương", "Khởi đầu, thủ lĩnh, dẫn đầu", "+1.5"],
            ["2", "Nhị", "Âm Dương", "Cân bằng, đôi lứa, đối xứng", "+0.5"],
            ["3", "Tam", "Mộc", "Sinh sôi, thịnh vượng, phát triển", "+1.0"],
            ["4", "Tứ", "Âm Kim", "Tử (chết) — suy giảm, trở ngại", "−2.0"],
            ["5", "Ngũ", "Thổ", "Ngũ hành, biến hóa, trung tính", "0"],
            ["6", "Lục", "Thủy", "Lộc — tài vận dồi dào, may mắn", "+2.0"],
            ["7", "Thất", "Âm", "Thất bại, trắc trở, bất ổn", "−0.5"],
            ["8", "Bát", "Kim", "Phát — phú quý vô biên, đại cát", "+2.5"],
            ["9", "Cửu", "Hỏa", "Cửu — trường tồn, viên mãn, bền lâu", "+1.5"],
          ]}
        />
      </KBSection>

      <KBSection title="Tổ hợp đôi (Pair combos)">
        <KBTable
          headers={["Tổ hợp", "Tên", "Điểm", "Ý nghĩa"]}
          rows={[
            ["88", "Song Phát", "+4.0", "Phát tài song đôi — vượng phát cực mạnh"],
            ["68 / 86", "Lộc Phát", "+4.0", "Lộc phát song toàn — tài lộc hanh thông"],
            ["66", "Song Lộc", "+3.5", "Lộc lộc — tài vận đôi chiều, thịnh vượng"],
            ["69 / 96", "Lộc Cửu", "+3.0", "Tài lộc bền lâu, phúc thọ"],
            ["89 / 98", "Phát Cửu", "+3.0", "Phát tài trường thọ"],
            ["99", "Song Cửu", "+2.5", "Trường thọ, vĩnh cửu"],
            ["18 / 81", "Khởi Phát", "+2.5", "Khởi đầu vượng phát"],
            ["44", "Song Tử", "−6.0", "Đại hung — thất bại nặng nề"],
            ["14 / 41", "Nhất Tử", "−4.0", "Khởi đầu gặp họa"],
            ["74 / 47", "Thất Tử", "−4.0", "Thất bại và suy vong"],
          ]}
        />
      </KBSection>

      <KBSection title="Tổ hợp ba (Triple combos)">
        <KBTable
          headers={["Tổ hợp", "Tên", "Điểm", "Ý nghĩa"]}
          rows={[
            ["888", "Tam Phát", "+7.0", "Phát tài · Phát lộc · Phát phúc — cực đại cát"],
            ["168", "Nhất Lộc Phát", "+6.0", "Khởi đầu thuận lợi, giàu sang phú quý"],
            ["668", "Song Lộc Phát", "+6.0", "Tài lộc đôi đường, vượng phát"],
            ["666", "Tam Lộc", "+6.0", "Đại vượng tài lộc"],
            ["689 / 698", "Lộc Phát Cửu", "+5.0", "Giàu sang lâu bền, trường thọ"],
            ["444", "Tam Tử", "−9.0", "Cực kỳ hung — tuyệt không nên dùng"],
            ["144 / 414 / 441", "Nhất Tam Tử", "−6.0", "Khởi đầu gặp vận hạn, suy sụp"],
          ]}
        />
      </KBSection>

      <KBSection title="Thang điểm & Luận đoán">
        <KBTable
          headers={["Mức", "Khoảng điểm", "Ý nghĩa"]}
          rows={[
            [<span className="text-yellow-400 font-bold">Đại Cát</span>, "≥ 8.0", "Số cực tốt, thu hút tài lộc và may mắn mạnh"],
            [<span className="text-green-400 font-bold">Cát</span>, "4.0 → 7.9", "Số tốt, thuận lợi trong công việc và cuộc sống"],
            [<span className="text-blue-400 font-bold">Bình Thường</span>, "0 → 3.9", "Số trung tính, không đặc biệt may/xui"],
            [<span className="text-orange-400 font-bold">Hung</span>, "−4.0 → −0.1", "Số không thuận lợi, cần cân nhắc"],
            [<span className="text-red-500 font-bold">Đại Hung</span>, "< −4.0", "Số xấu nặng, ảnh hưởng tiêu cực rõ rệt"],
          ]}
        />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Điểm tổng = tổng điểm từng chữ số + điểm thưởng/phạt của tất cả tổ hợp đôi và ba được tìm thấy trong chuỗi số.
        </p>
      </KBSection>

      <KBSection title="Tương hợp chủ nhân & số">
        <p className="leading-relaxed">
          Tương hợp được tính bằng cách so sánh <strong className="text-primary">Số mệnh</strong> (hoặc Số đường đời từ ngày sinh) với <strong className="text-primary">Năng lượng số</strong> của chuỗi chữ số điện thoại.
        </p>
        <KBTable
          headers={["Mức tương hợp", "Điều kiện", "Ý nghĩa"]}
          rows={[
            [<span className="text-yellow-400">Tuyệt Đối Tương Hợp</span>, "Hai số bằng nhau", "Cộng hưởng hoàn hảo, số như sinh ra dành riêng cho bạn"],
            [<span className="text-green-400">Tương Hợp</span>, "Trong nhóm hỗ trợ nhau", "Hai luồng năng lượng bổ trợ, cuộc sống hanh thông"],
            [<span className="text-blue-400">Trung Tính</span>, "Không hỗ trợ, không xung", "Ảnh hưởng trung lập, tự thân quyết định"],
            [<span className="text-red-400">Xung Khắc</span>, "Trong nhóm đối nghịch nhau", "Hai năng lượng mâu thuẫn, cần vật phẩm hóa giải"],
          ]}
        />
        <div className="mt-3 space-y-1.5">
          <p className="text-xs font-semibold text-primary/70 uppercase tracking-wider">Bảng nhóm tương hợp số</p>
          <KBTable
            headers={["Số đường đời", "Hỗ trợ", "Xung khắc"]}
            rows={[
              ["1", "1, 3, 5, 9", "6, 8"],
              ["2", "2, 4, 6, 8", "5, 7"],
              ["3", "1, 3, 6, 9", "4, 8"],
              ["4", "2, 4, 8", "1, 3, 7"],
              ["5", "1, 5, 7, 9", "2, 4, 6"],
              ["6", "2, 3, 6, 9", "1, 5, 7"],
              ["7", "5, 7, 9", "2, 4, 6"],
              ["8", "2, 4, 8", "3, 7, 9"],
              ["9", "1, 3, 5, 6, 9", "4, 8"],
            ]}
          />
        </div>
      </KBSection>
    </div>
  );
}

export function SaoHanKnowledge() {
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-widest text-muted-foreground text-center py-2">Nguồn tri thức — Sao Hạn Hàng Năm</p>

      <KBSection title="Cơ sở lý thuyết — Cửu Diệu Tinh">
        <p className="leading-relaxed">
          Sao hạn hàng năm dựa trên hệ thống <strong className="text-primary">Cửu Diệu Tinh</strong> (九曜星) — 9 ngôi sao hành tinh trong thiên văn cổ đại Trung Hoa, kết hợp với <strong className="text-primary">Hệ Lạc Thư</strong> (luân chuyển theo chu kỳ 9 năm). Mỗi người, căn cứ vào năm sinh, được gán vào một trong 9 sao, và các sao sẽ luân phiên theo thứ tự từng năm.
        </p>
        <KBGrid
          items={[
            { label: "9 Sao", value: "Nhất Bạch → Cửu Tử", color: "text-primary" },
            { label: "9 năm", value: "1 vòng chu kỳ", color: "text-primary" },
            { label: "Lạc Thư", value: "Nền tảng phân bổ", color: "text-primary" },
            { label: "Can Chi", value: "Xác định sao gốc", color: "text-primary" },
          ]}
        />
      </KBSection>

      <KBSection title="9 Ngôi Sao & Ý nghĩa">
        <KBTable
          headers={["Sao", "Ngũ Hành", "Tính chất", "Đánh giá"]}
          rows={[
            ["Nhất Bạch Thủy Tinh", "Thủy", "Trí tuệ, học vấn, quý nhân", "Tốt"],
            ["Nhị Hắc Thổ Tinh", "Thổ", "Bệnh tật, chướng ngại, mệt mỏi", "Cẩn thận"],
            ["Tam Bích Mộc Tinh", "Mộc", "Tranh chấp, thị phi, kiện tụng", "Cẩn thận"],
            ["Tứ Lục Mộc Tinh", "Mộc", "Văn chương, tình cảm, sáng tạo", "Tốt"],
            ["Ngũ Hoàng Thổ Tinh", "Thổ", "Tai họa, bệnh nặng, thất bại lớn", "Xấu nhất"],
            ["Lục Bạch Kim Tinh", "Kim", "Quyền lực, lãnh đạo, may mắn", "Rất tốt"],
            ["Thất Xích Kim Tinh", "Kim", "Đao kiếm, rủi ro, vật lộn", "Cẩn thận"],
            ["Bát Bạch Thổ Tinh", "Thổ", "Tài lộc, bất động sản, thịnh vượng", "Rất tốt"],
            ["Cửu Tử Hỏa Tinh", "Hỏa", "Hỷ sự, danh vọng, sáng rực", "Tốt (hỷ sự)"],
          ]}
        />
        <p className="text-xs text-muted-foreground leading-relaxed mt-2">
          Ngũ Hoàng (5) và Nhị Hắc (2) là hai sao hung nhất. Lục Bạch (6) và Bát Bạch (8) là hai sao cát nhất trong giai đoạn Vận 8–9 hiện nay.
        </p>
      </KBSection>

      <KBSection title="Cách tính sao gốc theo năm sinh">
        <p className="leading-relaxed">
          Sao gốc được tính từ <strong className="text-primary">năm sinh Dương lịch</strong>. Công thức rút gọn phổ biến:
        </p>
        <div className="bg-background/30 rounded-lg px-4 py-3 font-mono text-xs space-y-1.5 border border-primary/10">
          <div>Nam: Sao gốc = (11 − tổng chữ số năm sinh) mod 9</div>
          <div>Nữ: Sao gốc = (4 + tổng chữ số năm sinh) mod 9</div>
          <div className="text-primary mt-2">Ví dụ (Nam, sinh 1990): 1+9+9+0 = 19 → 1+9 = 10 → 1+0 = 1</div>
          <div className="text-primary">→ (11 − 1) = 10 mod 9 = <strong>Nhất Bạch</strong></div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-2">
          Sau đó, sao di chuyển theo thứ tự nghịch (Nam đi lui) hoặc thuận (Nữ đi tới) qua bảng Lạc Thư mỗi năm để tìm ra sao hạn cho từng năm cụ thể.
        </p>
      </KBSection>

      <KBSection title="Gợi ý hóa giải sao xấu">
        <div className="space-y-2">
          {[
            { sao: "Ngũ Hoàng (5) — Nguy hiểm nhất", bien: "Treo chuông gió kim loại, đặt vật phẩm ngũ hành Kim, tránh động thổ hướng Ngũ Hoàng trong năm." },
            { sao: "Nhị Hắc (2) — Bệnh tật", bien: "Dùng đồ vật màu trắng/bạc, treo gương bát quái, bổ sung khí Kim để hóa Thổ sinh bệnh." },
            { sao: "Tam Bích (3) — Thị phi", bien: "Đặt vật phẩm màu đỏ (Hỏa khắc Mộc), hạn chế tranh luận, kiện tụng trong năm." },
            { sao: "Thất Xích (7) — Rủi ro", bien: "Đặt bình nước hoặc vật phẩm Thủy, tránh đầu tư mạo hiểm và xung đột bạo lực." },
          ].map((item, i) => (
            <div key={i} className="rounded-lg bg-background/20 border border-primary/10 p-3">
              <p className="text-xs font-semibold text-red-400 mb-1">{item.sao}</p>
              <p className="text-xs text-foreground/70 leading-relaxed">{item.bien}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">Sao hạn mang tính định hướng. Tu tâm tích đức, hành thiện và chọn thời điểm hành động đúng lúc luôn là nền tảng vững chắc hơn bất kỳ vật phẩm hóa giải nào.</p>
      </KBSection>
    </div>
  );
}

export function PhongThuyKnowledge() {
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-widest text-muted-foreground text-center py-2">Nguồn tri thức — Phong Thuỷ Hướng Nhà</p>

      <KBSection title="Hệ thống Bát Trạch Phong Thuỷ">
        <p className="leading-relaxed">
          <strong className="text-primary">Bát Trạch Phong Thuỷ</strong> (八宅风水) là một trong các trường phái phong thuỷ cổ điển Trung Hoa, phân loại con người thành <strong className="text-primary">Đông Tứ Mệnh</strong> hoặc <strong className="text-primary">Tây Tứ Mệnh</strong> dựa trên năm sinh và giới tính. Mỗi mệnh có 4 hướng cát và 4 hướng hung riêng biệt.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mt-2">
          <div className="rounded-lg bg-blue-950/20 border border-blue-500/20 p-3 space-y-1">
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Đông Tứ Mệnh</p>
            <p className="text-xs text-foreground/70">Quái: Khảm (1), Ly (9), Chấn (3), Tốn (4)</p>
            <p className="text-xs text-foreground/60">Hướng tốt: Đông, Đông Nam, Nam, Bắc</p>
          </div>
          <div className="rounded-lg bg-orange-950/20 border border-orange-500/20 p-3 space-y-1">
            <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Tây Tứ Mệnh</p>
            <p className="text-xs text-foreground/70">Quái: Càn (6), Khôn (2), Cấn (8), Đoài (7)</p>
            <p className="text-xs text-foreground/60">Hướng tốt: Tây, Tây Bắc, Tây Nam, Đông Bắc</p>
          </div>
        </div>
      </KBSection>

      <KBSection title="8 Vị Tinh — Ý nghĩa từng hướng">
        <KBTable
          headers={["Tinh", "Tên", "Ý nghĩa"]}
          rows={[
            ["Sinh Khí", "Phước Đức · Tốt nhất", "Tài lộc, sức khoẻ, thịnh vượng, phát đạt"],
            ["Thiên Y", "Trời Thuốc", "Sức khoẻ, trường thọ, mọi sự bình an"],
            ["Diên Niên", "Kéo Dài Tuổi", "Hôn nhân tốt, gia đình hoà thuận, sự nghiệp bền"],
            ["Phục Vị", "Vị Trí Gốc", "Ổn định, an toàn, bình yên, duy trì hiện trạng"],
            ["Hoạ Hại", "Tai Hoạ Nhẹ", "Tranh cãi, tiểu nhân, thất bại nhỏ"],
            ["Lục Sát", "Sáu Điều Xấu", "Hao tài, tình cảm trục trặc, mất tiền bạc"],
            ["Ngũ Quỷ", "Năm Con Quỷ", "Bệnh tật, mất trộm, hoả hoạn, tai ương"],
            ["Tuyệt Mệnh", "Tuyệt Sinh Mệnh", "Hướng xấu nhất — đại nạn, phá sản, tai ương lớn"],
          ]}
        />
      </KBSection>

      <KBSection title="Cách tính Mệnh Quái (Quái Số)">
        <div className="space-y-3">
          <div className="bg-background/30 rounded-lg px-4 py-3 font-mono text-xs space-y-1.5 border border-primary/10">
            <div className="font-semibold text-primary">Nam (sinh trước 2000): (10 − tổng chữ số năm) mod 9</div>
            <div className="font-semibold text-primary">Nam (sinh từ 2000 trở đi): (9 − tổng chữ số năm) mod 9</div>
            <div className="font-semibold text-primary mt-1">Nữ (sinh trước 2000): (tổng chữ số năm + 5) mod 9</div>
            <div className="font-semibold text-primary">Nữ (sinh từ 2000 trở đi): (tổng chữ số năm + 6) mod 9</div>
            <div className="text-muted-foreground mt-1 text-[11px]">Kết quả 0 → tính thành 9. Kết quả 5: Nam → 2 (Khôn), Nữ → 8 (Cấn).</div>
          </div>
          <KBTable
            headers={["Quái số", "Tên Quái", "Hành", "Nhóm"]}
            rows={[
              ["1", "Khảm", "Thủy", "Đông Tứ Mệnh"],
              ["2", "Khôn", "Thổ", "Tây Tứ Mệnh"],
              ["3", "Chấn", "Mộc", "Đông Tứ Mệnh"],
              ["4", "Tốn", "Mộc", "Đông Tứ Mệnh"],
              ["6", "Càn", "Kim", "Tây Tứ Mệnh"],
              ["7", "Đoài", "Kim", "Tây Tứ Mệnh"],
              ["8", "Cấn", "Thổ", "Tây Tứ Mệnh"],
              ["9", "Ly", "Hỏa", "Đông Tứ Mệnh"],
            ]}
          />
        </div>
      </KBSection>

      <KBSection title="Ứng dụng thực tế trong nhà ở">
        <div className="space-y-2">
          {[
            { title: "Phòng ngủ & Đầu giường", desc: "Đặt đầu giường hướng Sinh Khí hoặc Thiên Y để tăng sức khoẻ và tái tạo năng lượng khi ngủ." },
            { title: "Bàn làm việc / học tập", desc: "Mặt hướng Sinh Khí (tài lộc) hoặc Diên Niên (sự nghiệp lâu dài) khi làm việc, học tập." },
            { title: "Bếp nấu & Cửa lò", desc: "Tránh đặt bếp ở hướng Sinh Khí — lửa sẽ 'đốt' khí may mắn. Nên dùng hướng phụ trung tính." },
            { title: "Cửa chính", desc: "Cửa đón gió hướng Sinh Khí hoặc Thiên Y mang khí tốt vào nhà liên tục quanh năm." },
            { title: "Tránh Tuyệt Mệnh & Ngũ Quỷ", desc: "Không ngủ, không ngồi làm việc quay lưng hoặc mặt về các hướng xấu nhất này." },
          ].map((tip, i) => (
            <div key={i} className="rounded-lg bg-background/20 border border-primary/10 p-3">
              <p className="text-xs font-semibold text-primary/80 mb-1">{tip.title}</p>
              <p className="text-xs text-foreground/70 leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </KBSection>
    </div>
  );
}

export function XemTenKnowledge() {
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-widest text-muted-foreground text-center py-2">Nguồn tri thức — Xem Tên</p>

      <KBSection title="Hệ thống Ngũ Cách — Phân tích Họ Tên">
        <p className="leading-relaxed">
          Xem tên theo <strong className="text-primary">Ngũ Cách</strong> (五格) là hệ thống phân tích họ tên dựa trên <strong className="text-primary">số nét chữ Hán</strong>, được phổ biến tại Nhật Bản (熊崎式姓名判断 — Kumazaki) vào đầu thế kỷ 20 và lan rộng sang Trung Hoa, Hàn Quốc, Việt Nam. Hệ thống chia tên thành 5 "cách" mang ý nghĩa vận mệnh khác nhau.
        </p>
        <KBGrid
          items={[
            { label: "Thiên Cách", value: "Nét họ + 1", sub: "Vận tiên thiên, tổ tiên", color: "text-yellow-400" },
            { label: "Nhân Cách", value: "Nét cuối họ + nét đầu tên", sub: "Vận chủ — quan trọng nhất", color: "text-primary" },
            { label: "Địa Cách", value: "Nét tên + 1", sub: "Vận hậu thiên, thực tế", color: "text-green-400" },
            { label: "Ngoại Cách", value: "Nét họ + nét đầu tên lót", sub: "Vận xã hội, môi trường", color: "text-blue-400" },
            { label: "Tổng Cách", value: "Tổng tất cả nét", sub: "Vận tổng thể cả đời", color: "text-purple-400" },
          ]}
        />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Ứng dụng này sử dụng bảng số nét chuẩn hóa cho từng chữ Latin đại diện họ tên Việt, quy ước mỗi chữ cái = 1 nét và cộng thêm 1 cho phần họ hoặc tên đơn lẻ theo phương pháp Kumazaki.
        </p>
      </KBSection>

      <KBSection title="Phân loại số cát hung (1–81)">
        <p className="leading-relaxed">
          Mỗi tổng số nét (từ 1 đến 81) mang một ý nghĩa vận mệnh riêng, phân loại thành 4 nhóm:
        </p>
        <KBGrid
          items={[
            { label: "Đại Cát", value: "Vận mệnh rất tốt", sub: "1, 5, 6, 11, 13, 15, 16, 21, 23, 24, 31, 32, 33, 35, 37, 41...", color: "text-yellow-400" },
            { label: "Cát", value: "Vận mệnh khá tốt", sub: "Số hỗ trợ và thuận lợi vừa phải", color: "text-green-400" },
            { label: "Trung Bình", value: "Vận bình thường", sub: "Không đặc biệt tốt hay xấu", color: "text-blue-400" },
            { label: "Hung", value: "Vận cần chú ý", sub: "4, 9, 10, 14, 19, 20, 22, 26, 28, 34, 36, 40, 44...", color: "text-red-400" },
          ]}
        />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong>Nhân Cách</strong> là chỉ số quan trọng nhất — ảnh hưởng trực tiếp tới tính cách, sự nghiệp và hôn nhân. Tổng Cách phản ánh vận mệnh tổng thể cả đời.
        </p>
      </KBSection>

      <KBSection title="Số Linh Hồn & Số Sứ Mệnh">
        <p className="leading-relaxed mb-2">
          Ngoài Ngũ Cách, hệ thống còn tính thêm 2 chỉ số từ <strong className="text-primary">Thần Số Học Pythagore</strong> để có cái nhìn đa chiều về tên:
        </p>
        <KBTable
          headers={["Chỉ số", "Cách tính", "Ý nghĩa"]}
          rows={[
            ["Số Linh Hồn", "Tổng giá trị số của các nguyên âm (A, E, I, O, U) trong tên đầy đủ", "Khát vọng nội tâm sâu thẳm, điều trái tim thực sự muốn"],
            ["Số Sứ Mệnh", "Tổng giá trị số của toàn bộ chữ cái trong họ tên đầy đủ", "Sứ mệnh và mục đích lớn trong cuộc đời"],
          ]}
        />
      </KBSection>

      <KBSection title="Nguyên tắc đặt tên tốt theo Ngũ Cách">
        <div className="space-y-2">
          {[
            { title: "Ưu tiên Nhân Cách đạt số Đại Cát", desc: "Đây là chỉ số ảnh hưởng trực tiếp nhất tới tính cách và cuộc đời. Cần đạt số 1, 5, 6, 11, 13, 15, 16, 21, 23, 24, 31, 32, 33..." },
            { title: "Tổng Cách nên là số lẻ cát", desc: "Tổng Cách số lẻ thường mang vận mệnh tốt hơn số chẵn theo quan niệm truyền thống." },
            { title: "Tránh các số hung phổ biến", desc: "Đặc biệt tránh số 4, 9, 10, 19, 20, 22, 26, 28 ở vị trí Nhân Cách và Tổng Cách." },
            { title: "Phối hợp Ngũ Hành tên với bản mệnh", desc: "Nếu biết mệnh ngũ hành của con, nên chọn chữ tên có bộ thủ hoặc âm nghĩa phù hợp (tương sinh) với bản mệnh." },
          ].map((tip, i) => (
            <div key={i} className="rounded-lg bg-background/20 border border-primary/10 p-3">
              <p className="text-xs font-semibold text-primary/80 mb-1">{tip.title}</p>
              <p className="text-xs text-foreground/70 leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          Tên đẹp là tên dễ đọc, dễ nhớ và có nghĩa đẹp. Ngũ Cách là công cụ tham khảo — vận mệnh còn phụ thuộc lớn vào môi trường sống, giáo dục và sự nỗ lực của bản thân.
        </p>
      </KBSection>
    </div>
  );
}
