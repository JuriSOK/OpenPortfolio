// Contenu structurellement invalide détecté à la lecture (échec de
// schema.safeParse, doublon de slug, cardinalité singleton dépassée, ou
// relation vers un slug inexistant dans aucune entrée de la collection
// cible). Ne devrait jamais survenir après `npm run build` (prebuild bloque
// déjà tout contenu invalide), mais `npm run dev` ne déclenche pas prebuild.
export class ContentIntegrityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ContentIntegrityError';
  }
}

// contentDir racine absent ou inaccessible : anomalie de configuration
// (mauvais chemin, déploiement incomplet), distincte d'un contenu invalide.
export class ContentConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ContentConfigurationError';
  }
}
