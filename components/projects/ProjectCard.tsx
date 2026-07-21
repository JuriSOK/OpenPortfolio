import Image from 'next/image';
import Link from 'next/link';

// alt est déjà résolu par l'appelant (mapProjectToView.ts) : chaîne vide si
// le média source est decorative:true (pattern WAI standard, alt="" suffit).
// Aucun champ `decorative` séparé ici : une seule source de vérité pour la
// normalisation, jamais ce composant.
export interface ProjectCardProps {
  // Optionnel : la route de fiche détaillée (/projects/[slug]) n'existe pas
  // encore (PR6 réduite à la liste — décision PO). Tant qu'aucun href n'est
  // fourni, la carte ne doit jamais produire de lien cassé : le titre est un
  // texte non interactif plutôt qu'un faux bouton ou un texte "bientôt
  // disponible". Une future PR de fiche projet renseignera href.
  href?: string;
  title: string;
  summary: string;
  typeLabel: string;
  dateRangeLabel: string;
  technologies: string[];
  image?: { src: string; alt: string };
}

export default function ProjectCard({
  href,
  title,
  summary,
  typeLabel,
  dateRangeLabel,
  technologies,
  image,
}: ProjectCardProps) {
  return (
    <li>
      <article className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
        {image ? (
          <div className="relative aspect-[16/9] overflow-hidden rounded-md bg-gray-100 dark:bg-gray-900">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              loading="lazy"
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div
            className="aspect-[16/9] rounded-md bg-gray-100 dark:bg-gray-900"
            aria-hidden="true"
          />
        )}

        <div className="flex items-center justify-between gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>{typeLabel}</span>
          <span>{dateRangeLabel}</span>
        </div>

        <h2 className="text-lg font-semibold">
          {href ? (
            <Link
              href={href}
              className="underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>

        <p className="text-sm text-gray-700 dark:text-gray-300">{summary}</p>

        <ul className="flex flex-wrap gap-2">
          {technologies.map((technology) => (
            <li
              key={technology}
              className="rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-700 dark:border-gray-700 dark:text-gray-300"
            >
              {technology}
            </li>
          ))}
        </ul>
      </article>
    </li>
  );
}
