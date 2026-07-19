import type { NextConfig } from 'next';

// Export statique imposé par l'ADR-0003 : pas de runtime Node, donc pas de
// routes API, de Server Actions, ni de fonction `redirects()` (celles-ci ne
// fonctionnent qu'avec un serveur Next.js actif). La redirection "/" → "/fr"
// est donc gérée par une page statique (voir app/page.tsx), pas ici.
const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
