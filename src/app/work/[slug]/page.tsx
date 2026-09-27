import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NuqtaStaggeredMenu } from "@/components/NuqtaStaggeredMenu";
import { Footer } from "@/components/Footer";
import { CaseFilm, CaseHero } from "@/components/CaseMedia";
import { getProject, projects } from "@/lib/projects";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return {
    title: `${project.title} — Case Study | Nuqta`,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} — Nuqta`,
      description: project.summary,
      url: `https://nuqtaa.studio/work/${project.slug}`,
      images: [{ url: project.cover }],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const next = projects[(projects.indexOf(project) + 1) % projects.length];

  return (
    <>
      <NuqtaStaggeredMenu />
      <main className="case-page">
        <div className="case-inner">
          <div className="case-topline">
            <Link href="/#work">← All work</Link>
            <span>{project.category}</span>
          </div>
          <header className="case-header">
            <h1>{project.title}</h1>
            <p>{project.summary}</p>
          </header>
        </div>

        <CaseHero src={project.cover} alt={project.coverAlt} />

        <div className="case-inner">
          <section className="case-intro" aria-labelledby="case-overview">
            <h2 id="case-overview">The project</h2>
            <p>{project.introduction}</p>
          </section>

          <section className="case-direction" aria-labelledby="case-direction-heading">
            <div>
              <h2 id="case-direction-heading">Design direction</h2>
              <p>{project.direction}</p>
            </div>
            <ul>
              {project.details.map((detail) => <li key={detail}>{detail}</li>)}
            </ul>
          </section>

          <CaseFilm src={project.video} poster={project.listingCover} title={project.title} />

          <div className="case-external">
            <p>See the work for yourself.</p>
            <a href={project.website} target="_blank" rel="noopener noreferrer">Visit live site ↗</a>
          </div>

          <Link className="case-next" href={`/work/${next.slug}`}>
            <span>Next case study</span>
            <strong>{next.title}</strong>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
