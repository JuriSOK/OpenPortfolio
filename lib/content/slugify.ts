// Génère un slug déterministe conforme à schemas/common.ts::slugSchema
// (^[a-z0-9]+(-[a-z0-9]+)*$). Utilisé par la skill add-project pour proposer
// un slug à partir d'un titre, jamais pour renommer un slug existant.
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // supprime les diacritiques (accents)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
