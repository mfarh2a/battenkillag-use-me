import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import type { CategoryId } from "@/lib/site";

export type Faq = { q: string; a: string };

export type ArticleMeta = {
  slug: string;
  title: string;
  description: string;
  category: CategoryId;
  date: string;
  updated: string;
  keywords: string[];
  readingMinutes: number;
  faqs: Faq[];
};

export type Article = ArticleMeta & { html: string };

const DIR = path.join(process.cwd(), "content", "articles");

function toMeta(slug: string, data: Record<string, unknown>, body: string): ArticleMeta {
  const words = body.split(/\s+/).filter(Boolean).length;
  return {
    slug,
    title: String(data.title),
    description: String(data.description),
    category: data.category as CategoryId,
    date: String(data.date),
    updated: String(data.updated ?? data.date),
    keywords: Array.isArray(data.keywords) ? (data.keywords as string[]) : [],
    readingMinutes: Math.max(2, Math.round(words / 220)),
    faqs: Array.isArray(data.faqs) ? (data.faqs as Faq[]) : [],
  };
}

export async function getAllArticles(): Promise<ArticleMeta[]> {
  const files = (await readdir(DIR)).filter((f) => f.endsWith(".md"));
  const metas = await Promise.all(
    files.map(async (f) => {
      const raw = await readFile(path.join(DIR, f), "utf8");
      const { data, content } = matter(raw);
      return toMeta(f.replace(/\.md$/, ""), data, content);
    }),
  );
  return metas.sort((a, b) => (a.title > b.title ? 1 : -1));
}

export async function getArticle(slug: string): Promise<Article | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  try {
    const raw = await readFile(path.join(DIR, `${slug}.md`), "utf8");
    const { data, content } = matter(raw);
    const html = marked.parse(content.replace(/<!--[\s\S]*?-->/g, ""), { async: false }) as string;
    return { ...toMeta(slug, data, content), html };
  } catch {
    return null;
  }
}
