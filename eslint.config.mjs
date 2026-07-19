import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

// eslint-config-next 16 exporte des configs "flat" natives (tableaux) : on
// les importe directement plutôt que via @eslint/eslintrc/FlatCompat, qui
// est conçu pour convertir des configs *legacy* (.eslintrc) et provoque une
// erreur ("Converting circular structure to JSON") quand on lui passe une
// config déjà flat.
const eslintConfig = [
  {
    ignores: ['out/**', '.next/**', 'node_modules/**', 'next-env.d.ts', 'coverage/**'],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
];

export default eslintConfig;
