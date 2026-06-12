"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Lightbulb,
  Shuffle,
  ChevronRight,
  Pen,
  Sparkles,
  ArrowRight,
  Users,
  Layers,
} from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { CHARACTERS, TOTAL_EPISODES } from "@/lib/data";
import { saveBrainstorm, getBrainstormHistory, saveCharacterField, saveScratch } from "@/lib/supabase/actions";

// ============================================================
// 브레인스토밍 질문 뱅크 — 80부작 웹소설 '가뭄해갈사 조선비' 전용
// Pixar 22 Rules / Save the Cat / John Truby Anatomy of Story 반영
// ============================================================
const QUESTIONS = {
  character: [
    // --- 조선비 (주인공) ---
    "조선비가 제일 싫어하는 자기 습관은 뭐야?",
    "조선비가 혼자 있을 때 무의식적으로 하는 행동은?",
    "조선비의 가장 행복했던 기억은? 그 기억이 지금 어떻게 변질됐어?",
    "조선비가 절대 하지 않을 말은 뭐야? 그 말을 하게 되는 순간은 몇 화야?",
    "조선비 핸드폰 배경화면은 뭐야? 그게 80화 끝에 바뀌어?",
    "조선비가 거짓말할 때 어떤 틱이 있어?",
    "조선비가 10년 뒤에도 절대 안 바뀌는 한 가지는?",
    "조선비가 제일 무서워하는 게 뭐야? 표면적인 거 말고 진짜.",
    "[Truby] 조선비의 심리적 약점(psychological weakness)은 뭐야? 도덕적 약점(moral weakness)은?",
    "[Truby] 조선비가 자기 약점을 남한테 어떻게 투사해? 누구한테?",
    // --- 조선비 아빠 ---
    "조선비 아빠가 아들한테 가장 하고 싶은 말인데 못 하는 말은?",
    "조선비 아빠의 젊은 시절 꿈은 뭐였어? 그게 어떻게 꺾였어?",
    "조선비 아빠가 혼자 술 마실 때 어떤 표정이야?",
    "조선비 아빠의 습관 중에 아들이 무의식적으로 따라 하는 것은?",
    // --- 조선비 깔치 ---
    "깔치가 조선비한테 진짜 원하는 게 뭐야? 말로는 뭐라고 해?",
    "깔치의 가장 솔직한 순간은 언제야? 어떤 상황에서 가면이 벗겨져?",
    "깔치가 조선비 없으면 어떻게 살아? 더 잘 살아? 더 못 살아?",
    "깔치의 약점이 조선비의 강점이야? 아니면 둘 다 같은 약점을 공유해?",
    // --- 조연 / 세계관 ---
    "80화 동안 등장하는 조연 중 가장 기억에 남을 캐릭터는 누구야? 왜?",
    "악역이 있어? 있으면 그 사람의 자기 합리화는 뭐야?",
    "[Pixar #13] 캐릭터한테 의견을 줘봐. '조선비야, 넌 왜 거기 있었어?' 조선비가 뭐라고 대답해?",
    "[Save the Cat] 조선비가 관객의 공감을 사는 첫 장면은? 'Save the Cat' 순간이 뭐야?",
    "[Truby] 조선비의 '욕망의 선(desire line)'은 뭐야? 80화 동안 뭘 향해 달려?",
    "[Truby] 조선비에게 '계시(revelation)'가 오는 순간 — 자기가 뭘 잘못했는지 깨닫는 그 순간은 몇 화야?",
  ],
  scene: [
    // --- 핵심 장면 ---
    "1화 첫 문장은 뭐야? 독자가 왜 2화까지 넘어가?",
    "80화 마지막 문장은 뭐야? 그 문장이 1화 첫 문장과 어떻게 연결돼?",
    "이 소설에서 가장 조용한 장면은 어디야? 그 침묵이 뭘 말해?",
    "조선비가 처음으로 울거나 무너지는 장면 — 어디서, 무슨 자세로, 주변에 뭐가 있어?",
    "독자가 소름 돋을 반전 장면이 있어? 그 장면의 직전 3초를 묘사해봐.",
    "가장 웃긴 장면은 뭐야? 웹소설에서 유머가 어떤 역할을 해?",
    "조선비 아빠와 조선비가 말 없이 같은 공간에 있는 장면 — 뭘 하고 있어?",
    "깔치가 진심을 드러내는 장면 — 표정, 손, 목소리 톤을 써봐.",
    "비가 오는 장면이 있어? 비가 이 이야기에서 뭘 의미해?",
    "40화 근처 중간 지점에서 독자가 '아 이래서 이 소설을 읽는구나' 느끼는 장면은?",
    // --- Pixar 장면 규칙 ---
    "[Pixar #1] 관객이 주인공이 되는 장면 — 조선비의 아침 루틴을 써봐. 관객이 같이 느끼게.",
    "[Pixar #5] 캐릭터 소개를 행동으로 해. 조선비가 처음 등장하는 30초를 묘사 — 성격이 다 드러나게.",
    "[Pixar #9] 막혔을 때: '이 장면에서 제일 의외의 일이 일어난다면?' — 그게 뭐야?",
    "[Pixar #16] '만약 이 이야기가 아니라면, 조선비는 어떤 이야기에 있어?'",
    // --- 감각 디테일 ---
    "이 소설의 냄새는 뭐야? 어떤 장면에서 그 냄새가 나?",
    "조선비가 사는 동네의 밤 풍경 — 가로등, 소리, 바람을 써봐.",
    "음식이 나오는 장면이 있어? 그 음식이 관계를 어떻게 보여줘?",
    "계절이 바뀌는 장면 — 그 전환이 조선비의 내면 변화와 연결돼?",
    "물이 나오는 장면들을 모아봐. 비, 강, 바다, 눈물 — 물이 이 이야기에서 뭘 해?",
    "[Save the Cat] '다크 나이트 오브 더 소울' — 조선비의 가장 바닥인 순간의 물리적 공간은 어디야?",
  ],
  theme: [
    // --- 핵심 주제 ---
    "이 소설의 주제를 한 단어로. 그 단어가 1화와 80화에 어떻게 나타나?",
    "조선비라는 이름 자체가 주제야? 이름이 이야기 안에서 어떻게 해석돼?",
    "'가뭄해갈사'가 뭐야? 가뭄이 비유하는 것과 해갈이 비유하는 것은?",
    "이 이야기에서 '성장'은 뭐야? 더 강해지는 거야? 더 솔직해지는 거야? 뭔가를 포기하는 거야?",
    "80화 끝에 조선비가 도달하는 깨달음은 뭐야? 그게 진부하지 않으려면 뭐가 필요해?",
    "이 이야기에서 돈은 어떤 역할이야? 산소? 독? 도구?",
    "사랑이 나와? 나오면 어떤 종류의 사랑이야? 로맨스? 우정? 가족?",
    "이 소설이 독자한테 남기고 싶은 감정은 뭐야? 감동? 허탈? 희망? 씁쓸함?",
    "세대 갈등이 있어? 아빠 세대와 조선비 세대의 차이는 뭐야?",
    "전통과 현대가 충돌하는 지점은 어디야?",
    // --- Pixar 테마 ---
    "[Pixar #3] 테마를 한 문장으로 — 그 문장을 1화에 숨기고 80화에 드러내봐.",
    "[Pixar #6] '만약에 ___라면 어쩌지?'로 시작해봐. 이 이야기의 '만약에'는 뭐야?",
    "[Pixar #11] 지금 가장 아끼는 장면을 빼면 이야기가 어떻게 바뀌어?",
    "[Pixar #14] 왜 이 이야기를 네가 써야 해? 다른 사람이 쓰면 뭐가 달라져?",
    "[Pixar #22] 이 이야기의 핵심은 뭐야? 한 단어. 그 단어를 빼면 이야기가 존재해?",
    // --- Truby ---
    "[Truby] 이 이야기의 도덕적 논쟁(moral argument)은 뭐야? 어떤 가치관이 충돌해?",
    "[Truby] 조선비의 변화 아크에서 '거짓 자아'와 '진짜 자아'는 각각 뭐야?",
    "[Truby] 상대편(opponent)의 가치관이 조선비보다 더 설득력 있는 순간은?",
    // --- Save the Cat ---
    "[Save the Cat] 이 소설의 장르는 Save the Cat 10장르 중 뭐야? Monster in the House? Buddy Love? Rites of Passage?",
    "[Save the Cat] B Story(사이드 플롯)가 테마를 어떻게 반영해?",
  ],
  structure: [
    // --- 80화 구조 ---
    "80화를 4막으로 나누면 각 막의 전환점은 몇 화야?",
    "1~20화(1막)의 핵심 사건은? 20화 끝에 독자가 느끼는 감정은?",
    "21~40화(2막 전반)에서 조선비가 겪는 시련의 종류는? 점점 세지는 패턴이야?",
    "41~60화(2막 후반)에서 조선비가 잃는 것은? 그게 왜 필요한 잃음이야?",
    "61~80화(3막)로 가는 전환점 — 뭐가 터져? 그게 1화의 뭐와 연결돼?",
    "80화 중 가장 조용한 화는 몇 화야? 왜 거기서 쉬어가?",
    "독자가 50화쯤에서 빠질 수 있어. 어떻게 잡아?",
    "회차별 5000자 제한이 리듬에 어떤 영향을 줘? 클리프행어를 매화 넣어?",
    "서브플롯은 몇 개야? 각각 몇 화에서 시작하고 몇 화에서 끝나?",
    "플래시백을 써? 쓴다면 어떤 규칙으로?",
    // --- Pixar 구조 ---
    "[Pixar #2] 관객으로서 재미있는 것 vs 작가로서 쓰고 싶은 것 — 겹치는 건 뭐야?",
    "[Pixar #4] '옛날 옛적에 ___. 매일매일 ___. 그러던 어느 날 ___.' 조선비로 채워봐.",
    "[Pixar #7] 엔딩을 먼저 정해. 80화 마지막에서 역으로 1화까지 와봐. 뭐가 부족해?",
    "[Pixar #8] 미완성이어도 끝내. 80화 전체를 한 줄씩만 채워봐. 빈 화에 한 줄만.",
    "[Pixar #12] 제일 먼저 떠오르는 아이디어는 버려. 두 번째, 세 번째까지 가. 핵심 사건의 세 번째 버전은?",
    "[Pixar #17] 막혔으면 역순으로. 80화에 관객이 느껴야 할 감정은? 그걸 만드는 직전 장면은?",
    // --- Truby 구조 ---
    "[Truby] 22단계 중 '유령(ghost)'은 뭐야? 조선비의 과거에서 현재를 지배하는 사건은?",
    "[Truby] '계시(revelation)' → '결심(decision)' → '새로운 균형(new equilibrium)' 순서로 70~80화를 정리해봐.",
    "[Truby] 조선비의 상대(opponent)가 조선비와 같은 목표를 추구하는 구조가 돼 있어?",
    "[Truby] '가짜 동맹(fake-ally opponent)'이 있어? 있다면 정체가 드러나는 화는?",
    // --- Save the Cat Beat Sheet ---
    "[Save the Cat] Opening Image(1화)와 Final Image(80화) — 뭐가 대칭이고 뭐가 변해?",
    "[Save the Cat] Catalyst(촉매 사건)은 몇 화야? 그 전까지 일상을 충분히 보여줬어?",
    "[Save the Cat] Midpoint(40화 근처)에서 false victory야 false defeat야?",
    "[Save the Cat] All Is Lost 순간은 몇 화야? 'Whiff of Death'(죽음의 냄새)가 어떤 형태로 나와?",
    "[Save the Cat] Break into Three(3막 진입)는 A Story와 B Story가 합쳐지는 순간이야. 그게 뭐야?",
    // --- 웹소설 특유 ---
    "웹소설은 매화 끝에 다음 화 클릭하게 만들어야 해. 클리프행어 패턴이 3가지 이상 있어?",
    "무료 구간(1~10화?)에서 독자를 잡는 전략은?",
    "댓글로 독자가 싸울 만한 논쟁적 장면이 있어?",
    "연재 중단 없이 80화를 쓸 체력 배분은? 어느 구간이 제일 힘들 거 같아?",
  ],
  wild: [
    // --- 메타 / 작가 자신 ---
    "조선비가 너한테 한마디 할 수 있다면 뭐라고 해?",
    "이 이야기를 싫어하는 사람은 왜 싫어해?",
    "10년 뒤에 이 소설을 다시 읽으면 뭐라고 할까?",
    "이 소설을 안 쓰면 어떻게 돼?",
    "이 이야기를 색깔 하나로 표현하면?",
    "이 이야기의 냄새는?",
    "넷플릭스 썸네일에 어떤 장면을 넣을 거야?",
    "OST 첫 곡은? 마지막 곡은?",
    // --- 세계관 확장 ---
    "조선비가 사는 세계의 규칙 중 현실과 다른 게 있어?",
    "이 이야기를 다른 시대 배경으로 옮기면 뭐가 달라져?",
    "조선비를 여자로 바꾸면 이야기가 성립해?",
    "조선비 세계에 SNS가 있어? 있으면 조선비 프로필은 뭐야?",
    "조선비가 제일 좋아하는 유튜브 채널은?",
    "깔치의 인스타를 열면 뭐가 보여?",
    // --- 독자 / 시장 ---
    "이 소설의 타겟 독자는 누구야? 그 사람이 왜 이걸 클릭해?",
    "경쟁작은 뭐야? 그 작품과 뭐가 다르고 뭐가 같아?",
    "리뷰에 별 5개 주는 사람은 뭐라고 써? 별 1개 주는 사람은?",
    "이 소설 제목이 '조선비'가 아니라면 뭐야?",
    // --- 와일드카드 ---
    "80화 전체를 세 문장으로 요약해봐.",
    "조선비가 죽는 엔딩도 가능해? 그러면 뭐가 달라져?",
    "이 이야기에서 가장 사소하지만 가장 중요한 소품은 뭐야?",
    "조선비 아빠 시점으로 이 이야기를 다시 쓰면 제목이 뭐야?",
    "깔치가 주인공인 스핀오프가 있다면 — 1화 첫 문장은?",
    "80화 다 쓰고 나서 보너스 81화를 쓴다면 뭘 써?",
    "[Pixar #19] 이 이야기에서 제일 운이 좋은 우연은 뭐야? 그걸 우연이 아니게 만들어봐.",
    "[Pixar #15] 네가 조선비라면 — 가장 힘든 순간에 뭘 느껴?",
    "조선비 세계에서 가장 맛있는 음식은 뭐야? 그걸 누가 만들어?",
    "이 이야기의 마지막 단어가 뭐야?",
  ],
};

type Category = keyof typeof QUESTIONS;

const CATEGORY_INFO: { key: Category; label: string; icon: typeof Lightbulb; color: string }[] = [
  { key: "character", label: "인물", icon: Users, color: "text-rose-400" },
  { key: "scene", label: "장면", icon: Pen, color: "text-blue-400" },
  { key: "theme", label: "테마", icon: Lightbulb, color: "text-amber-400" },
  { key: "structure", label: "구조", icon: Layers, color: "text-emerald-400" },
  { key: "wild", label: "와일드", icon: Sparkles, color: "text-purple-400" },
];

// 현재 상태 기반 제안
function getSuggestions(): string[] {
  const suggestions: string[] = [];

  // 캐릭터 기반 제안
  for (const c of CHARACTERS) {
    suggestions.push(`${c.name}의 첫 등장 장면을 써봐. 행동 하나로 성격이 드러나게.`);
  }

  suggestions.push("80화 중 오늘 가장 쓰고 싶은 장면 하나만 골라. 거기부터 시작해.");
  suggestions.push("1화 첫 문단만 써봐. 3문장이면 충분해. 완벽 안 해도 돼.");
  suggestions.push("조선비의 하루를 시간표로 써봐. 아침 7시부터 밤 12시까지.");
  suggestions.push("5000자짜리 1화를 쓸 수 있는 최소 아웃라인: 시작-중간-끝 각 한 줄.");

  // 랜덤 셔플 후 앞에서 3개
  return suggestions.sort(() => Math.random() - 0.5);
}

// ============================================================
// 반영 시스템 — 답변에서 캐릭터/에피소드 자동 감지 후 구조에 반영
// ============================================================
const CHARACTER_NAMES = CHARACTERS.map(c => ({ id: c.id, name: c.name }));
const EPISODE_PATTERN = /(\d{1,2})화/g;

function detectMentions(text: string) {
  const chars = CHARACTER_NAMES.filter(c => text.includes(c.name));
  const episodes: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = EPISODE_PATTERN.exec(text)) !== null) {
    const n = parseInt(m[1]);
    if (n >= 1 && n <= TOTAL_EPISODES && !episodes.includes(n)) episodes.push(n);
  }
  EPISODE_PATTERN.lastIndex = 0;
  return { chars, episodes };
}

type ApplyTarget = { type: "character"; id: string; name: string } | { type: "episode"; number: number } | { type: "world" };

export default function BrainstormPage() {
  const [category, setCategory] = useState<Category>("character");
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState<{ id?: string; q: string; a: string; created_at?: string }[]>([]);
  const [suggestions] = useState(getSuggestions);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // 반영 시스템 state
  const [applyPanel, setApplyPanel] = useState<{ question: string; answer: string; targets: ApplyTarget[] } | null>(null);
  const [applySelected, setApplySelected] = useState<Set<string>>(new Set());
  const [applying, setApplying] = useState(false);
  const [applyDone, setApplyDone] = useState(false);

  // Load history from Supabase
  useEffect(() => {
    async function loadHistory() {
      const data = await getBrainstormHistory();
      if (data.length > 0) {
        setHistory(data.map((d) => ({
          id: d.id,
          q: d.question,
          a: d.answer,
          created_at: d.created_at,
        })));
      }
    }
    loadHistory();
  }, []);

  const pickRandom = useCallback(() => {
    const pool = QUESTIONS[category];
    const q = pool[Math.floor(Math.random() * pool.length)];
    setCurrentQuestion(q);
    setAnswer("");
    setSaveStatus(null);
  }, [category]);

  const saveAndNext = async () => {
    if (currentQuestion && answer.trim()) {
      setSaving(true);
      setSaveStatus(null);
      try {
        const data = await saveBrainstorm(currentQuestion, answer.trim(), category);
        if (data) {
          setHistory((prev) => [
            { id: data.id, q: data.question, a: data.answer, created_at: data.created_at },
            ...prev,
          ]);
          setSaveStatus("저장됨!");

          // 반영 시스템: 캐릭터/에피소드 자동 감지
          const { chars, episodes } = detectMentions(answer.trim() + " " + currentQuestion);
          const targets: ApplyTarget[] = [
            ...chars.map(c => ({ type: "character" as const, id: c.id, name: c.name })),
            ...episodes.map(n => ({ type: "episode" as const, number: n })),
            { type: "world" as const },
          ];
          if (targets.length > 1) {
            setApplyPanel({ question: currentQuestion, answer: answer.trim(), targets });
            setApplySelected(new Set(chars.map(c => `char:${c.id}`)));
            setApplyDone(false);
          }
        } else {
          setSaveStatus("저장 실패");
        }
      } catch (err) {
        setSaveStatus("저장 실패: " + String(err));
      }
      setSaving(false);
    }
    setTimeout(() => pickRandom(), 500);
  };

  // 반영 실행
  const applyToTargets = async () => {
    if (!applyPanel) return;
    setApplying(true);
    const snippet = `\n\n---\n**[브레인스토밍]** ${applyPanel.question}\n> ${applyPanel.answer}`;

    const selectedArr = Array.from(applySelected);
    for (const key of selectedArr) {
      if (key.startsWith("char:")) {
        const charId = key.replace("char:", "");
        const char = CHARACTERS.find(c => c.id === charId);
        if (char) {
          await saveCharacterField(char.name, "notes", (char.description || "") + snippet);
        }
      } else if (key.startsWith("ep:")) {
        const epNum = key.replace("ep:", "");
        await saveScratch(`[brainstorm→ep${epNum}] Q: ${applyPanel.question}\nA: ${applyPanel.answer}`);
      } else if (key === "world") {
        await saveScratch(`[brainstorm→세계관] Q: ${applyPanel.question}\nA: ${applyPanel.answer}`);
      }
    }
    setApplying(false);
    setApplyDone(true);
    setTimeout(() => setApplyPanel(null), 1500);
  };

  const totalQuestions = Object.values(QUESTIONS).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-2">
        <Lightbulb className="w-5 h-5 text-accent" />
        <h1 className="font-serif text-3xl font-bold text-gold">브레인스토밍</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-8">
        질문에 답하다 보면 80화가 채워져. 틀려도 돼. 일단 써.
        <span className="ml-2 text-xs opacity-60">({totalQuestions}개 질문)</span>
      </p>

      {/* Suggestions */}
      <section className="mb-10">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          지금 할 수 있는 것
        </h2>
        <div className="space-y-2">
          {suggestions.slice(0, 3).map((s, i) => (
            <Card key={i} className="bg-card/60 border-primary/10 hover:border-primary/30 transition-colors cursor-pointer">
              <CardContent className="p-3 flex items-start gap-3">
                <ArrowRight className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                <p className="text-sm text-foreground/80">{s}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Category tabs */}
      <section className="mb-6">
        <div className="flex gap-2 flex-wrap">
          {CATEGORY_INFO.map((cat) => {
            const count = QUESTIONS[cat.key].length;
            return (
              <button
                key={cat.key}
                onClick={() => { setCategory(cat.key); setCurrentQuestion(null); setSaveStatus(null); }}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors ${
                  category === cat.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                <cat.icon className="w-3 h-3" />
                {cat.label}
                <span className="opacity-60">({count})</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Question card */}
      <section className="mb-8">
        {currentQuestion ? (
          <Card className="border-primary/20">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Lightbulb className="w-4 h-4 text-primary" />
                </div>
                <p className="text-foreground leading-relaxed pt-1">
                  {currentQuestion}
                </p>
              </div>
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="생각나는 대로 써... 완벽 안 해도 돼."
                className="min-h-[120px] text-sm"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={saveAndNext} disabled={saving} className="gap-1.5">
                  {saving ? "저장 중..." : answer.trim() ? "저장하고 다음" : "건너뛰기"}
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
                <Button variant="outline" size="sm" onClick={pickRandom} className="gap-1.5">
                  <Shuffle className="w-3.5 h-3.5" />
                  다른 질문
                </Button>
                {saveStatus && (
                  <span className={`text-xs ${saveStatus.includes("실패") ? "text-destructive" : "text-accent"}`}>
                    {saveStatus}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center space-y-4">
              <Lightbulb className="w-8 h-8 mx-auto text-muted-foreground/30" />
              <p className="text-muted-foreground">
                카테고리를 고르고 질문을 뽑아봐
              </p>
              <Button onClick={pickRandom} className="gap-1.5">
                <Shuffle className="w-4 h-4" />
                질문 뽑기
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      {/* 반영하기 패널 */}
      {applyPanel && (
        <section className="mb-8">
          <Card className="border-accent/30 glow-gold">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <p className="text-sm font-medium text-gold">이 답변을 어디에 반영할까?</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {applyPanel.targets.map(t => {
                  const key = t.type === "character" ? `char:${t.id}` : t.type === "episode" ? `ep:${t.number}` : "world";
                  const label = t.type === "character" ? `${t.name}` : t.type === "episode" ? `${t.number}화` : "🌏 세계관";
                  const checked = applySelected.has(key);
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setApplySelected(prev => {
                          const next = new Set(prev);
                          if (next.has(key)) next.delete(key); else next.add(key);
                          return next;
                        });
                      }}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        checked
                          ? "bg-accent text-accent-foreground border-accent"
                          : "bg-secondary text-foreground/70 border-border hover:bg-accent/15 hover:text-accent"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={applyToTargets} disabled={applying || applySelected.size === 0 || applyDone} className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs gap-1">
                  {applyDone ? "✓ 반영됨!" : applying ? "반영 중..." : `${applySelected.size}개에 반영`}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setApplyPanel(null)} className="text-xs text-muted-foreground">
                  건너뛰기
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* History */}
      {history.length > 0 && (
        <section>
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            지금까지 나온 생각들 ({history.length})
          </h2>
          <div className="space-y-3">
            {history.map((item, i) => (
              <Card key={item.id ?? i} className="bg-card/40">
                <CardContent className="p-4 space-y-2">
                  <p className="text-xs text-muted-foreground">{item.q}</p>
                  <p className="text-sm text-foreground/80 whitespace-pre-wrap">
                    {item.a}
                  </p>
                  {item.created_at && (
                    <p className="text-[10px] text-muted-foreground/50">
                      {new Date(item.created_at).toLocaleDateString("ko-KR")}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
