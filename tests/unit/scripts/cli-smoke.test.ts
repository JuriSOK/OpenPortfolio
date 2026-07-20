import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '../../..');
const TSX_BIN = join(REPO_ROOT, 'node_modules/.bin/tsx');

function runScript(scriptRelativePath: string, args: string[], stdin?: string) {
  try {
    const stdout = execFileSync(TSX_BIN, [join(REPO_ROOT, scriptRelativePath), ...args], {
      input: stdin ?? '',
      encoding: 'utf-8',
      cwd: REPO_ROOT,
    });
    return { status: 0, stdout, stderr: '' };
  } catch (error) {
    const execError = error as { status: number | null; stdout: string; stderr: string };
    return { status: execError.status ?? 1, stdout: execError.stdout, stderr: execError.stderr };
  }
}

// Instantané récursif d'un dossier (chemins relatifs + contenu) pour
// prouver qu'un CLI en principe read-only n'a strictement rien écrit.
function snapshotDir(dir: string): Record<string, string> {
  const snapshot: Record<string, string> = {};
  if (!existsSync(dir)) return snapshot;

  const walk = (current: string) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const fullPath = join(current, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else {
        snapshot[fullPath] = readFileSync(fullPath, 'utf-8');
      }
    }
  };
  walk(dir);
  return snapshot;
}

describe('slugify CLI', () => {
  it('entrée valide -> code 0, slug sur stdout uniquement', () => {
    const result = runScript('scripts/slugify.ts', ['Développeur Full-Stack']);
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe('developpeur-full-stack');
  });

  it('entrée invalide (argument manquant) -> code non nul, diagnostic sur stderr', () => {
    const result = runScript('scripts/slugify.ts', []);
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });
});

describe('check-project-draft CLI', () => {
  let tempDir: string;
  let contentDir: string;
  let publicDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'add-project-cli-smoke-'));
    contentDir = join(tempDir, 'content');
    publicDir = join(tempDir, 'public');
    mkdirSync(join(contentDir, 'projects'), { recursive: true });
    mkdirSync(join(contentDir, 'skills'), { recursive: true });
    mkdirSync(publicDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  const validCandidate = (contentDirArg: string, publicDirArg: string) => ({
    mode: 'create',
    slug: 'smoke-project',
    contentDir: contentDirArg,
    publicDir: publicDirArg,
    candidate: {
      slug: 'smoke-project',
      status: 'draft',
      type: 'personal',
      title: { fr: 'Projet fictif' },
      summary: { fr: 'Résumé' },
      problem: { fr: 'Problème' },
      solution: { fr: 'Solution' },
      role: { fr: 'Développeur' },
      technologies: ['TypeScript'],
      startDate: '2024-01-01',
    },
  });

  it('entrée valide -> code 0, {"valid":true} uniquement sur stdout', () => {
    const before = snapshotDir(tempDir);
    const result = runScript(
      'scripts/check-project-draft.ts',
      [],
      JSON.stringify(validCandidate(contentDir, publicDir)),
    );

    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe('{"valid":true}');

    const after = snapshotDir(tempDir);
    expect(after).toEqual(before);
  });

  it('entrée invalide (JSON malformé) -> code non nul, diagnostic sur stderr', () => {
    const result = runScript('scripts/check-project-draft.ts', [], 'ceci nest pas du json');
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });

  it('candidat invalide -> code non nul, aucune écriture disque, chemins confinés au dossier temporaire', () => {
    const before = snapshotDir(tempDir);
    const payload = validCandidate(contentDir, publicDir);
    payload.candidate.technologies = [];

    const result = runScript('scripts/check-project-draft.ts', [], JSON.stringify(payload));

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('technologies');
    // Les seuls chemins mentionnés dans le diagnostic pointent vers le
    // dossier temporaire de test, jamais vers les vrais content/ ou public/
    // du dépôt.
    expect(result.stderr).not.toContain(join(REPO_ROOT, 'content'));
    expect(result.stderr).not.toContain(join(REPO_ROOT, 'public'));

    const after = snapshotDir(tempDir);
    expect(after).toEqual(before);
  });

  it('reste strictement read-only même quand contentDir/publicDir sont omis (défaut vers le dépôt réel)', () => {
    const beforeProjects = snapshotDir(join(REPO_ROOT, 'content/projects'));
    const beforeSkills = snapshotDir(join(REPO_ROOT, 'content/skills'));

    const result = runScript(
      'scripts/check-project-draft.ts',
      [],
      JSON.stringify({
        mode: 'create',
        slug: 'smoke-project-default-dirs',
        candidate: {
          slug: 'smoke-project-default-dirs',
          status: 'draft',
          type: 'personal',
          title: { fr: 'Projet fictif' },
          summary: { fr: 'Résumé' },
          problem: { fr: 'Problème' },
          solution: { fr: 'Solution' },
          role: { fr: 'Développeur' },
          technologies: ['TypeScript'],
          startDate: '2024-01-01',
        },
      }),
    );

    expect(result.status).toBe(0);
    expect(snapshotDir(join(REPO_ROOT, 'content/projects'))).toEqual(beforeProjects);
    expect(snapshotDir(join(REPO_ROOT, 'content/skills'))).toEqual(beforeSkills);
  });
});

describe('merge-project-patch CLI', () => {
  const existing = {
    slug: 'demo-project',
    status: 'draft',
    type: 'personal',
    title: { fr: 'Titre FR' },
    summary: { fr: 'Résumé FR' },
    problem: { fr: 'Problème FR' },
    solution: { fr: 'Solution FR' },
    role: { fr: 'Rôle FR' },
    technologies: ['TypeScript'],
    startDate: '2024-01-01',
  };

  it('entrée valide -> code 0, {merged, staleTranslationFields} sur stdout uniquement', () => {
    const result = runScript(
      'scripts/merge-project-patch.ts',
      [],
      JSON.stringify({ existing, patch: { featuredRank: 4 } }),
    );

    expect(result.status).toBe(0);
    const parsed = JSON.parse(result.stdout);
    expect(parsed.merged.featuredRank).toBe(4);
    expect(parsed.staleTranslationFields).toEqual([]);
  });

  it('tentative de changement de slug -> code non nul, diagnostic sur stderr', () => {
    const result = runScript(
      'scripts/merge-project-patch.ts',
      [],
      JSON.stringify({ existing, patch: { slug: 'autre-slug' } }),
    );

    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });

  it("n'écrit jamais aucun fichier (git status du dépôt inchangé)", () => {
    const statusBefore = execFileSync('git', ['status', '--short'], {
      cwd: REPO_ROOT,
      encoding: 'utf-8',
    });
    runScript(
      'scripts/merge-project-patch.ts',
      [],
      JSON.stringify({ existing, patch: { featuredRank: 1 } }),
    );
    const statusAfter = execFileSync('git', ['status', '--short'], {
      cwd: REPO_ROOT,
      encoding: 'utf-8',
    });
    expect(statusAfter).toBe(statusBefore);
  });
});
