import path from 'path';
import { fileURLToPath } from 'url';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname  = path.dirname(__filename);

export const rootDir    = path.resolve(__dirname, '..');
export const viewsDir   = path.join(rootDir, 'views');
export const publicDir  = path.join(rootDir, 'public');
export const dataDir    = path.join(rootDir, 'data');