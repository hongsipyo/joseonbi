"use client";

import { useState } from "react";
import { MessageSquare, Eye, ThumbsUp, ThumbsDown, ArrowLeft, Pencil, Flame } from "lucide-react";

interface Cmt { id: string; nick: string; ip: string; text: string; time: string; up: number; }
interface Post {
  id: string; tag: string; title: string; nick: string; ip: string; date: string;
  views: number; up: number; down: number; body: string; comments: Cmt[]; hot?: boolean;
}

const SEED: Post[] = [
  {
    id: "p1", tag: "일반", hot: true, title: "조선비 깔치 새끼 사이다 언제 터짐?", nick: "ㅇㅇ", ip: "118.43",
    date: "10:42", views: 2841, up: 142, down: 3,
    body: "아 진짜 탐관오리 깔치 그 새끼 18화째 떵떵거리는거 보고있으니까 속 터져 죽겠노ㅋㅋㅋ 작가양반 제발 다음화에서 목 좀 쳐주셈... 사이다 언제 옴?? 고구마 그만 먹이고",
    comments: [
      { id: "c1", nick: "ㅇㅇ", ip: "211.36", text: "ㅇㅇ 나도 깔치 나올때마다 혈압 오름 ㅋㅋㅋ", time: "10:45", up: 18 },
      { id: "c2", nick: "조선비매니아", ip: "1.221", text: "원래 빌런이 길게 살아야 카타르시스 크다 참아라~노", time: "10:51", up: 11 },
      { id: "c3", nick: "ㅇㅇ", ip: "39.7", text: "이거 80부작이라 아직 4분의1임 멀었다ㅋㅋ", time: "11:02", up: 24 },
    ],
  },
  {
    id: "p2", tag: "고찰", title: "[고찰] 가뭄 떡밥 = 왕권 은유인듯 (스압주의)", nick: "사학과형", ip: "112.156",
    date: "09:15", views: 4120, up: 203, down: 6,
    body: "조선비에서 계속 나오는 가뭄이 단순 자연재해가 아니라 흔들리는 왕권의 은유라고 봄. 비를 내리게 하는 기우제 = 민심, 조선비가 우물 파는 장면 = 아래로부터의 개혁 의지. 작가가 깔아둔 사극 코드가 ㅈㄴ 치밀함. 후반부에 분명히 한번 뒤집힌다에 한표 건다",
    comments: [
      { id: "c1", nick: "ㅇㅇ", ip: "175.223", text: "와 이거 읽고 소름 다시 정주행하러간다", time: "09:33", up: 51 },
      { id: "c2", nick: "ㅇㅇ", ip: "203.99", text: "사학과형 다음 고찰글도 부탁함 추천박고감", time: "09:40", up: 14 },
    ],
  },
  {
    id: "p3", tag: "짤", title: "오늘자 조선비 우물 파는 장면.jpg", nick: "ㅇㅇ", ip: "121.88",
    date: "08:50", views: 1109, up: 67, down: 1,
    body: "(이미지) 조선비가 맨손으로 우물 파면서 우는 컷 다시 봤는데 또 눈물남 ㅅㅂ... 이 장면 명장면 박제각",
    comments: [{ id: "c1", nick: "ㅇㅇ", ip: "58.29", text: "ㅠㅠㅠ 조선비 손 다 까졌는데 거기서 웃는거 반칙임", time: "09:01", up: 22 }],
  },
  {
    id: "p4", tag: "일반", title: "작가양반 연재속도 좀ㅋㅋ 손가락 갈아넣는중?", nick: "고구마먹는중", ip: "106.101",
    date: "08:12", views: 893, up: 44, down: 2,
    body: "아 다음화 언제나오노... 매주 화목 연재라매 목요일인데 왜 안올라옴 ㅋㅋㅋ 작가양반 설마 또 휴재? 80부작 완결 보려면 우리 다 할배될듯ㅋㅋ 그래도 응원함 추천좀",
    comments: [{ id: "c1", nick: "ㅇㅇ", ip: "117.111", text: "퀄 유지하려면 이정도 속도가 맞긴함 닥추하고감", time: "08:20", up: 9 }],
  },
  {
    id: "p5", tag: "일반", title: "조선비갤 형들 연재 기다리는동안 뭐함?", nick: "ㅇㅇ", ip: "223.38",
    date: "07:44", views: 502, up: 19, down: 0,
    body: "다음화 기다리는거 너무 힘들다... 형들은 기다리는동안 뭐하노. 나는 1화부터 재탕 4회차 도는중ㅋㅋ 볼때마다 새로운 복선 보임 ㄹㅇ",
    comments: [{ id: "c1", nick: "ㅇㅇ", ip: "175.196", text: "재탕은 국룰이지 ㅋㅋㅋ 나도 3회차", time: "07:50", up: 7 }],
  },
  {
    id: "p6", tag: "고찰", title: "조선비 영상화 가야됨 사극드라마 각 ㄷㄷ", nick: "드라마덕", ip: "39.118",
    date: "07:10", views: 661, up: 28, down: 1,
    body: "이거 그냥 사극 드라마 각인데?? 가뭄 배경에 민초들 봉기, 조선비 서사 구조가 딱 16부작 미니시리즈 감임. 캐스팅 누구할지 댓글로 ㄱㄱ 조선비 역은 무조건 신인이어야 맛",
    comments: [{ id: "c1", nick: "ㅇㅇ", ip: "117.99", text: "깔치는 중견배우 한명 박아야 빌런 무게감 나옴", time: "07:18", up: 13 }],
  },
];

const TAGS = ["전체", "일반", "고찰", "짤"];

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(SEED);
  const [open, setOpen] = useState<string | null>(null);
  const [tag, setTag] = useState("전체");
  const [cmt, setCmt] = useState("");

  const post = posts.find((p) => p.id === open);
  const list = tag === "전체" ? posts : posts.filter((p) => p.tag === tag);

  const vote = (id: string, dir: "up" | "down") =>
    setPosts((ps) => ps.map((p) => (p.id === id ? { ...p, [dir]: p[dir] + 1 } : p)));

  const addCmt = () => {
    if (!cmt.trim() || !post) return;
    setPosts((ps) => ps.map((p) => p.id === post.id ? {
      ...p, comments: [...p.comments, { id: `n${Date.now()}`, nick: "ㅇㅇ", ip: "127.0", text: cmt.trim(), time: "방금", up: 0 }],
    } : p));
    setCmt("");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* 갤러리 헤더 */}
      <div className="mb-4 flex items-end justify-between border-b-2 border-primary/40 pb-2">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gold">조선비 갤러리</h1>
          <p className="text-xs text-muted-foreground">가뭄해갈사 마이너 갤러리 · 독자들이 노는 곳</p>
        </div>
        <span className="text-[11px] text-muted-foreground">실시간 {posts.length}글 · 접속 198</span>
      </div>

      {!post ? (
        <>
          {/* 말머리 탭 */}
          <div className="mb-2 flex items-center gap-1 text-xs">
            {TAGS.map((t) => (
              <button key={t} onClick={() => setTag(t)}
                className={`rounded px-2.5 py-1 font-medium transition ${tag === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}>
                {t}
              </button>
            ))}
            <button className="ml-auto flex items-center gap-1 rounded bg-secondary px-2.5 py-1 font-bold text-foreground hover:bg-secondary/70">
              <Pencil className="h-3 w-3" /> 글쓰기
            </button>
          </div>

          {/* 글 목록 (디시 테이블) */}
          <div className="overflow-hidden rounded-lg border border-border/50">
            <div className="grid grid-cols-[40px_1fr_70px_44px_44px] gap-1 border-b border-border/50 bg-secondary/40 px-2 py-1.5 text-[11px] font-semibold text-muted-foreground">
              <span className="text-center">번호</span><span>제목</span><span>글쓴이</span><span className="text-center">조회</span><span className="text-center">추천</span>
            </div>
            {list.map((p, i) => (
              <button key={p.id} onClick={() => setOpen(p.id)}
                className="grid w-full grid-cols-[40px_1fr_70px_44px_44px] items-center gap-1 border-b border-border/30 px-2 py-2 text-left text-[13px] transition hover:bg-secondary/40">
                <span className="text-center text-xs text-muted-foreground/60">{list.length - i}</span>
                <span className="truncate text-foreground/90">
                  <span className={`mr-1.5 text-[10px] font-bold ${p.tag === "고찰" ? "text-accent" : p.tag === "짤" ? "text-primary" : "text-muted-foreground"}`}>[{p.tag}]</span>
                  {p.title}
                  <span className="ml-1 text-[11px] font-bold text-primary">[{p.comments.length}]</span>
                  {p.hot && <Flame className="ml-1 inline h-3 w-3 text-accent" />}
                </span>
                <span className="truncate text-[11px] text-muted-foreground">{p.nick}<span className="text-muted-foreground/40">({p.ip})</span></span>
                <span className="text-center text-[11px] text-muted-foreground/70">{p.views}</span>
                <span className="text-center text-[11px] font-bold text-primary">{p.up}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        /* 글 상세 */
        <div className="animate-float-up">
          <button onClick={() => setOpen(null)} className="mb-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> 목록
          </button>
          <div className="rounded-lg border border-border/50 glass p-5">
            <div className="border-b border-border/40 pb-3">
              <h2 className="text-lg font-bold text-foreground">
                <span className="mr-1.5 text-sm font-bold text-accent">[{post.tag}]</span>{post.title}
              </h2>
              <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted-foreground">
                <span>{post.nick}<span className="text-muted-foreground/40">({post.ip})</span></span>
                <span>{post.date}</span>
                <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{post.views}</span>
              </div>
            </div>
            <p className="whitespace-pre-wrap py-5 text-sm leading-relaxed text-foreground/90">{post.body}</p>

            {/* 추천/비추 */}
            <div className="flex justify-center gap-2 py-3">
              <button onClick={() => vote(post.id, "up")} className="flex flex-col items-center rounded-lg border border-primary/30 bg-primary/10 px-6 py-2 transition hover:bg-primary/20 glow-jusa">
                <ThumbsUp className="h-4 w-4 text-primary" /><span className="mt-0.5 text-sm font-bold text-primary">{post.up}</span>
              </button>
              <button onClick={() => vote(post.id, "down")} className="flex flex-col items-center rounded-lg border border-border/50 px-6 py-2 transition hover:bg-secondary">
                <ThumbsDown className="h-4 w-4 text-muted-foreground" /><span className="mt-0.5 text-sm font-bold text-muted-foreground">{post.down}</span>
              </button>
            </div>

            {/* 댓글 */}
            <div className="mt-2 border-t border-border/40 pt-3">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-foreground"><MessageSquare className="h-3.5 w-3.5 text-accent" />전체 댓글 {post.comments.length}</p>
              <div className="space-y-2.5">
                {post.comments.map((c) => (
                  <div key={c.id} className="flex items-start gap-2 text-[13px]">
                    <span className="shrink-0 text-[11px] text-muted-foreground">{c.nick}<span className="text-muted-foreground/40">({c.ip})</span></span>
                    <span className="flex-1 text-foreground/85">{c.text}</span>
                    <span className="shrink-0 text-[10px] text-muted-foreground/50">{c.time}</span>
                    <span className="flex shrink-0 items-center gap-0.5 text-[10px] text-primary"><ThumbsUp className="h-2.5 w-2.5" />{c.up}</span>
                  </div>
                ))}
              </div>
              {/* 댓글 작성 */}
              <div className="mt-4 flex gap-2">
                <input value={cmt} onChange={(e) => setCmt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCmt()}
                  placeholder="ㅇㅇ (익명) 댓글 달기..." className="flex-1 rounded-lg border border-border/50 bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-accent/40" />
                <button onClick={addCmt} className="rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-primary/90">등록</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
