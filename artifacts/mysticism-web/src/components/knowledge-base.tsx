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
