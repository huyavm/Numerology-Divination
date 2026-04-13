export interface DigitInfo {
  digit: number;
  meaning: string;
  element: string;
  score: number;
  level: "great" | "good" | "neutral" | "bad" | "terrible";
}

export interface Combination {
  pattern: string;
  name: string;
  meaning: string;
  score: number;
  level: "great" | "good" | "neutral" | "bad" | "terrible";
}

export interface CatHungResult {
  digits: DigitInfo[];
  combinations: Combination[];
  totalScore: number;
  verdict: "dai-cat" | "cat" | "binh-thuong" | "hung" | "dai-hung";
  verdictLabel: string;
  verdictColor: string;
  verdictDescription: string;
}

const DIGIT_MAP: Omit<DigitInfo, "digit">[] = [
  {
    meaning: "Không - Trống rỗng, vô cực",
    element: "Thủy",
    score: 0,
    level: "neutral",
  },
  {
    meaning: "Nhất - Khởi đầu, thủ lĩnh",
    element: "Dương",
    score: 1.5,
    level: "good",
  },
  {
    meaning: "Nhị - Cân bằng, đôi lứa",
    element: "Âm Dương",
    score: 0.5,
    level: "neutral",
  },
  {
    meaning: "Tam - Sinh sôi, thịnh vượng",
    element: "Mộc",
    score: 1,
    level: "good",
  },
  {
    meaning: "Tứ - Tử, suy giảm",
    element: "Âm Kim",
    score: -2,
    level: "bad",
  },
  {
    meaning: "Ngũ - Ngũ hành, biến hóa",
    element: "Thổ",
    score: 0,
    level: "neutral",
  },
  {
    meaning: "Lục - Lộc, tài vận dồi dào",
    element: "Thủy",
    score: 2,
    level: "good",
  },
  {
    meaning: "Thất - Thất bại, trắc trở",
    element: "Âm",
    score: -0.5,
    level: "neutral",
  },
  {
    meaning: "Bát - Phát, phú quý vô biên",
    element: "Kim",
    score: 2.5,
    level: "great",
  },
  {
    meaning: "Cửu - Cửu, trường tồn viên mãn",
    element: "Hỏa",
    score: 1.5,
    level: "good",
  },
];

const TRIPLE_COMBOS: Array<{ patterns: string[]; name: string; meaning: string; score: number; level: Combination["level"] }> = [
  {
    patterns: ["888"],
    name: "Tam Phát",
    meaning: "Phát tài, phát lộc, phát phúc - cực kỳ may mắn",
    score: 7,
    level: "great",
  },
  {
    patterns: ["168"],
    name: "Nhất Lộc Phát",
    meaning: "Nhất sinh lộc phát - khởi đầu thuận lợi, giàu sang phú quý",
    score: 6,
    level: "great",
  },
  {
    patterns: ["668"],
    name: "Song Lộc Phát",
    meaning: "Lộc lộc phát - tài lộc đôi đường, vượng phát",
    score: 6,
    level: "great",
  },
  {
    patterns: ["689"],
    name: "Lộc Phát Cửu",
    meaning: "Lộc phát trường thọ - giàu sang lâu bền",
    score: 5,
    level: "great",
  },
  {
    patterns: ["698"],
    name: "Lộc Cửu Phát",
    meaning: "Lộc cửu phát - vận lộc dài lâu, phát tài bền vững",
    score: 5,
    level: "great",
  },
  {
    patterns: ["666"],
    name: "Tam Lộc",
    meaning: "Lộc lộc lộc - đại vượng tài lộc",
    score: 6,
    level: "great",
  },
  {
    patterns: ["999"],
    name: "Tam Cửu",
    meaning: "Cửu cửu cửu - trường tồn vĩnh cửu",
    score: 3,
    level: "good",
  },
  {
    patterns: ["899"],
    name: "Phát Song Cửu",
    meaning: "Phát tài trường thọ - giàu có và sống lâu",
    score: 4,
    level: "great",
  },
  {
    patterns: ["189"],
    name: "Nhất Phát Cửu",
    meaning: "Khởi đầu phát tài, sống lâu",
    score: 4,
    level: "great",
  },
  {
    patterns: ["196"],
    name: "Nhất Cửu Lộc",
    meaning: "Đứng đầu, trường thọ, lộc vượng",
    score: 3,
    level: "good",
  },
  {
    patterns: ["444"],
    name: "Tam Tử",
    meaning: "Tam tứ - cực kỳ hung, tuyệt không nên dùng",
    score: -9,
    level: "terrible",
  },
  {
    patterns: ["144", "414", "441"],
    name: "Nhất Tam Tử",
    meaning: "Khởi đầu gặp nhiều vận hạn, suy sụp",
    score: -6,
    level: "terrible",
  },
  {
    patterns: ["744", "474", "447"],
    name: "Thất Tử Hung",
    meaning: "Thất bại và suy vong, đại hung",
    score: -6,
    level: "terrible",
  },
];

const PAIR_COMBOS: Array<{ patterns: string[]; name: string; meaning: string; score: number; level: Combination["level"] }> = [
  {
    patterns: ["88"],
    name: "Song Phát",
    meaning: "Phát tài song đôi - vượng phát cực mạnh",
    score: 4,
    level: "great",
  },
  {
    patterns: ["68", "86"],
    name: "Lộc Phát",
    meaning: "Lộc phát song toàn - tài lộc hanh thông",
    score: 4,
    level: "great",
  },
  {
    patterns: ["66"],
    name: "Song Lộc",
    meaning: "Lộc lộc - tài vận đôi chiều, thịnh vượng",
    score: 3.5,
    level: "great",
  },
  {
    patterns: ["69", "96"],
    name: "Lộc Cửu",
    meaning: "Lộc cửu - tài lộc bền lâu, phúc thọ",
    score: 3,
    level: "good",
  },
  {
    patterns: ["89", "98"],
    name: "Phát Cửu",
    meaning: "Phát tài trường thọ - giàu có lâu bền",
    score: 3,
    level: "good",
  },
  {
    patterns: ["99"],
    name: "Song Cửu",
    meaning: "Cửu cửu - trường thọ, vĩnh cửu",
    score: 2.5,
    level: "good",
  },
  {
    patterns: ["18", "81"],
    name: "Khởi Phát",
    meaning: "Nhất phát - khởi đầu vượng phát",
    score: 2.5,
    level: "good",
  },
  {
    patterns: ["16", "61"],
    name: "Nhất Lộc",
    meaning: "Nhất lộc - đứng đầu về tài lộc",
    score: 2.5,
    level: "good",
  },
  {
    patterns: ["19", "91"],
    name: "Nhất Cửu",
    meaning: "Khởi đầu viên mãn, trường thọ",
    score: 2,
    level: "good",
  },
  {
    patterns: ["13", "31"],
    name: "Nhất Tam",
    meaning: "Khởi đầu sinh sôi, phát triển",
    score: 1.5,
    level: "good",
  },
  {
    patterns: ["38", "83"],
    name: "Tam Phát",
    meaning: "Sinh sôi phát tài",
    score: 2,
    level: "good",
  },
  {
    patterns: ["36", "63"],
    name: "Tam Lộc",
    meaning: "Sinh sôi hưởng lộc",
    score: 2,
    level: "good",
  },
  {
    patterns: ["44"],
    name: "Song Tử",
    meaning: "Song tứ - đại hung, thất bại nặng nề",
    score: -6,
    level: "terrible",
  },
  {
    patterns: ["14", "41"],
    name: "Nhất Tử",
    meaning: "Khởi đầu gặp họa, suy sụp",
    score: -4,
    level: "terrible",
  },
  {
    patterns: ["24", "42"],
    name: "Nhị Tử",
    meaning: "Dễ chết - hung, bất lợi đôi đường",
    score: -4,
    level: "bad",
  },
  {
    patterns: ["74", "47"],
    name: "Thất Tử",
    meaning: "Thất bại và suy vong",
    score: -4,
    level: "bad",
  },
  {
    patterns: ["04", "40"],
    name: "Không Tử",
    meaning: "Hao tài, dễ gặp nạn",
    score: -3,
    level: "bad",
  },
  {
    patterns: ["54", "45"],
    name: "Ngũ Tử",
    meaning: "Biến đổi tiêu cực, cần đề phòng",
    score: -3,
    level: "bad",
  },
  {
    patterns: ["34", "43"],
    name: "Tam Tử",
    meaning: "Phát triển gặp trở ngại",
    score: -2.5,
    level: "bad",
  },
];

function detectCombinations(numStr: string): Combination[] {
  const found: Combination[] = [];
  const usedPositions = new Set<string>();

  for (const combo of TRIPLE_COMBOS) {
    for (const pattern of combo.patterns) {
      let idx = numStr.indexOf(pattern);
      while (idx !== -1) {
        const posKey = `${idx}-${idx + pattern.length - 1}`;
        if (![...Array(pattern.length).keys()].some((k) => usedPositions.has(`${idx + k}`))) {
          found.push({ pattern, name: combo.name, meaning: combo.meaning, score: combo.score, level: combo.level });
          for (let k = 0; k < pattern.length; k++) usedPositions.add(`${idx + k}`);
          break;
        }
        idx = numStr.indexOf(pattern, idx + 1);
      }
    }
  }

  for (const combo of PAIR_COMBOS) {
    for (const pattern of combo.patterns) {
      let idx = numStr.indexOf(pattern);
      while (idx !== -1) {
        if (![...Array(pattern.length).keys()].some((k) => usedPositions.has(`${idx + k}`))) {
          found.push({ pattern, name: combo.name, meaning: combo.meaning, score: combo.score, level: combo.level });
          for (let k = 0; k < pattern.length; k++) usedPositions.add(`${idx + k}`);
          break;
        }
        idx = numStr.indexOf(pattern, idx + 1);
      }
    }
  }

  return found;
}

export function analyzeCatHung(numStr: string): CatHungResult {
  const digits: DigitInfo[] = numStr.split("").map((ch) => {
    const d = parseInt(ch, 10);
    return { digit: d, ...DIGIT_MAP[d] };
  });

  const combinations = detectCombinations(numStr);

  const digitScore = digits.reduce((sum, d) => sum + d.score, 0);
  const comboScore = combinations.reduce((sum, c) => sum + c.score, 0);
  const totalScore = digitScore + comboScore;

  let verdict: CatHungResult["verdict"];
  let verdictLabel: string;
  let verdictColor: string;
  let verdictDescription: string;

  if (totalScore >= 8) {
    verdict = "dai-cat";
    verdictLabel = "Đại Cát";
    verdictColor = "text-yellow-400";
    verdictDescription = "Vô cùng may mắn và thịnh vượng. Con số này mang lại tài lộc, phúc khí và vận hội tuyệt vời.";
  } else if (totalScore >= 4) {
    verdict = "cat";
    verdictLabel = "Cát";
    verdictColor = "text-green-400";
    verdictDescription = "May mắn, thuận lợi. Con số mang năng lượng tích cực, hỗ trợ cuộc sống và sự nghiệp.";
  } else if (totalScore >= 0) {
    verdict = "binh-thuong";
    verdictLabel = "Bình Thường";
    verdictColor = "text-blue-400";
    verdictDescription = "Trung bình, không đặc biệt tốt cũng không xấu. Kết quả phụ thuộc vào nỗ lực bản thân.";
  } else if (totalScore >= -4) {
    verdict = "hung";
    verdictLabel = "Hung";
    verdictColor = "text-orange-400";
    verdictDescription = "Có một số yếu tố bất lợi. Nên cẩn trọng và bổ sung các yếu tố may mắn khác trong cuộc sống.";
  } else {
    verdict = "dai-hung";
    verdictLabel = "Đại Hung";
    verdictColor = "text-red-500";
    verdictDescription = "Nhiều yếu tố bất lợi, cần thận trọng. Nên xem xét thay đổi để tránh vận hạn.";
  }

  return { digits, combinations, totalScore, verdict, verdictLabel, verdictColor, verdictDescription };
}

export function extractLastFourDigits(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, "");
  return digitsOnly.slice(-4);
}

export function validateLicensePlate(num: string): string {
  return num.replace(/\D/g, "").slice(0, 5);
}

export const LEVEL_CONFIG: Record<DigitInfo["level"], { bg: string; border: string; text: string; badge: string }> = {
  great:   { bg: "bg-yellow-500/10", border: "border-yellow-500/40", text: "text-yellow-400", badge: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40" },
  good:    { bg: "bg-green-500/10",  border: "border-green-500/40",  text: "text-green-400",  badge: "bg-green-500/20 text-green-300 border-green-500/40"  },
  neutral: { bg: "bg-blue-500/10",   border: "border-blue-500/30",   text: "text-blue-400",   badge: "bg-blue-500/20 text-blue-300 border-blue-500/30"    },
  bad:     { bg: "bg-orange-500/10", border: "border-orange-500/40", text: "text-orange-400", badge: "bg-orange-500/20 text-orange-300 border-orange-500/40"},
  terrible:{ bg: "bg-red-500/10",    border: "border-red-500/40",    text: "text-red-400",    badge: "bg-red-500/20 text-red-300 border-red-500/40"        },
};
