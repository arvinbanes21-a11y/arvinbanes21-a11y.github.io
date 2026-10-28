import { INITIAL_PROJECTS } from '@/lib/types';
import ProjectDetail from './ProjectDetail';

// Static export (GitHub Pages) needs every project page pre-built.
export function generateStaticParams() {
  return INITIAL_PROJECTS.map((project) => ({ slug: project.slug }));
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  return <ProjectDetail slug={params.slug} />;
}
