import { promises as fs } from 'fs';
import path from 'path';

export async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const res = path.resolve(dir, entry.name);
      return entry.isDirectory() ? walk(res) : Promise.resolve([res]);
    })
  );
  return Array.prototype.concat(...files);
}

export async function replaceInFiles(dir: string, replacements: Record<string, string>) {
  const files = await walk(dir);
  const tsFiles = files.filter((file) => file.endsWith('.ts') || file.endsWith('.json'));

  for (const file of tsFiles) {
    let content = await fs.readFile(file, 'utf8');
    for (const [placeholder, value] of Object.entries(replacements)) {
      const regex = new RegExp(placeholder, 'g');
      content = content.replace(regex, value);
    }
    await fs.writeFile(file, content, 'utf8');
  }
}

export async function removeGitFolder(gitPath: string) {
  await fs.rm(gitPath, { recursive: true, force: true });
}