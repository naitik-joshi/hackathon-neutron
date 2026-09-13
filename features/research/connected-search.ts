import "server-only";
import { listProjects } from "@/features/projects/queries";
import { listAreas, listPublications, listResearchers } from "./queries";
import { publishedOnly, rankSearchDocuments } from "./search-ranking";

export async function searchPublicResearch(query: string) {
  const [areas, researchers, projects, publications] = await Promise.all([
    listAreas(),
    listResearchers(),
    listProjects({ limit: 100 }),
    listPublications("", 100),
  ]);

  return {
    areas: rankSearchDocuments(
      areas.map((area) => ({
        item: area,
        primary: area.name,
        secondary: [area.description],
      })),
      query,
    ).map(({ item }) => item),
    researchers: rankSearchDocuments(
      researchers.map((researcher) => ({
        item: researcher,
        primary: researcher.name,
        secondary: [researcher.position, researcher.bio],
        connections: researcher.areas.map((area) => area.name),
      })),
      query,
    ).map(({ item }) => item),
    projects: rankSearchDocuments(
      projects.map((project) => ({
        item: project,
        primary: project.title,
        secondary: [project.summary, project.status],
        connections: [
          ...project.areas.map((area) => area.name),
          ...project.researchers.map((researcher) => researcher.name),
        ],
      })),
      query,
    ).map(({ item }) => item),
    publications: rankSearchDocuments(
      publishedOnly(publications).map((publication) => ({
        item: publication,
        primary: publication.title,
        secondary: [
          publication.abstract,
          publication.doi ?? "",
          publication.year?.toString() ?? "",
        ],
        connections: [
          ...publication.areas.map((area) => area.name),
          ...publication.authors.map((author) => author.name),
          ...publication.projects.map((project) => project.title),
        ],
      })),
      query,
    ).map(({ item }) => item),
  };
}
