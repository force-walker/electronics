import ja from './ja.json';
import en from './en.json';
import type { Lang } from '../types/circuit';

const dict = { ja, en } as const;

export function t(lang: Lang, key: string): string {
  return (dict[lang] as Record<string, string>)[key] ?? key;
}
