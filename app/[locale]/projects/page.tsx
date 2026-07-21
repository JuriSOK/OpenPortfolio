import ProjectCard from '../../../components/projects/ProjectCard';
import { getProjects } from '../../../lib/content/getContent';
import type { Locale } from '../layout';
import { getProjectsCopy } from './copy';
import { toProjectCardView } from './mapProjectToView';

export default async function ProjectsListPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const copy = getProjectsCopy(locale);
  const projects = getProjects();

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12">
      <h1 className="text-2xl font-bold">{copy.listHeading}</h1>

      {projects.length === 0 ? (
        <p role="status">{copy.empty}</p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} {...toProjectCardView(project, locale)} />
          ))}
        </ul>
      )}
    </main>
  );
}
