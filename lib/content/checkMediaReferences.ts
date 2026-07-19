import { existsSync } from 'node:fs';
import { join } from 'node:path';

// `mediaPath` est relatif à public/ (ex. "images/examples/example-cover.svg").
export function mediaFileExists(publicDir: string, mediaPath: string): boolean {
  return existsSync(join(publicDir, mediaPath));
}
