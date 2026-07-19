import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

export interface CollectionEntry {
  filePath: string;
  slug: string;
  data: unknown;
}

// Lit tous les fichiers .yml/.yaml d'un dossier de collection (content/<collection>/).
// Un dossier absent (collection pas encore utilisée) renvoie simplement une liste vide.
export function readCollection(collectionDir: string): CollectionEntry[] {
  let fileNames: string[];
  try {
    fileNames = readdirSync(collectionDir).filter(
      (name) => name.endsWith('.yml') || name.endsWith('.yaml'),
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }

  return fileNames.map((fileName) => {
    const filePath = join(collectionDir, fileName);
    const raw = readFileSync(filePath, 'utf-8');
    const data = parse(raw);
    const slug = fileName.replace(/\.ya?ml$/, '');
    return { filePath, slug, data };
  });
}
