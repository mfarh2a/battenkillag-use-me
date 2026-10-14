import { readFile } from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";

// Reads a markdown file from the /content folder and turns it into HTML.
// HTML comments (editing notes) are removed before rendering.
export async function renderContent(file: string): Promise<string> {
  const raw = await readFile(path.join(process.cwd(), "content", file), "utf8");
  const withoutComments = raw.replace(/<!--[\s\S]*?-->/g, "");
  return marked.parse(withoutComments, { async: false }) as string;
}
