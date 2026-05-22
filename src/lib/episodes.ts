import { createClient } from "@/lib/supabase/client";

const PROJECT = "joseonbi";

async function getUserId(): Promise<string> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error("로그인이 필요합니다");
  return session.user.id;
}

export interface Episode {
  number: number;
  title: string;
  content: string;
}

// scratch 테이블에 [ep:N] 접두사로 저장
// 제목은 [ep-title:N] 접두사로 저장

export async function getEpisodes(): Promise<Episode[]> {
  const supabase = createClient();
  const { data } = (await supabase
    .from("scratch" as never)
    .select("*")
    .eq("user_id" as never, (await getUserId()) as never)
    .eq("moved_to" as never, PROJECT as never)
    .order("created_at" as never, { ascending: true } as never)) as {
    data: { id: string; content: string; created_at: string }[] | null;
  };

  if (!data) return [];

  const episodes: Map<number, Episode> = new Map();

  for (let i = 1; i <= 80; i++) {
    episodes.set(i, { number: i, title: "", content: "" });
  }

  for (const row of data) {
    const titleMatch = row.content.match(/^\[ep-title:(\d+)\]\s*(.*)/);
    if (titleMatch) {
      const num = parseInt(titleMatch[1]);
      if (episodes.has(num)) {
        episodes.get(num)!.title = titleMatch[2];
      }
      continue;
    }

    const epMatch = row.content.match(/^\[ep:(\d+)\]\s*([\s\S]*)/);
    if (epMatch) {
      const num = parseInt(epMatch[1]);
      if (episodes.has(num)) {
        // 최신 내용으로 덮어쓰기
        episodes.get(num)!.content = epMatch[2];
      }
    }
  }

  return Array.from(episodes.values());
}

export async function getEpisode(number: number): Promise<Episode> {
  const episodes = await getEpisodes();
  return episodes.find((ep) => ep.number === number) || { number, title: "", content: "" };
}

export async function saveEpisodeContent(number: number, content: string) {
  const supabase = createClient();
  await supabase
    .from("scratch" as never)
    .insert({
      content: `[ep:${number}] ${content}`,
      moved_to: PROJECT,
      user_id: await getUserId(),
    } as never);
}

export async function saveEpisodeTitle(number: number, title: string) {
  const supabase = createClient();
  await supabase
    .from("scratch" as never)
    .insert({
      content: `[ep-title:${number}] ${title}`,
      moved_to: PROJECT,
      user_id: await getUserId(),
    } as never);
}
