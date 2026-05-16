// 가뭄해갈사 조선비 — 80부작 웹소설

export const TOTAL_EPISODES = 80;
export const TARGET_CHARS = 5000;

export interface Character {
  id: string;
  name: string;
  description: string;
}

export const CHARACTERS: Character[] = [
  {
    id: "joseonbi",
    name: "조선비",
    description: "주인공",
  },
  {
    id: "joseonbi-dad",
    name: "조선비 아빠",
    description: "조선비의 아버지",
  },
  {
    id: "joseonbi-gdalchi",
    name: "조선비 깔치",
    description: "조선비의 깔치",
  },
];
