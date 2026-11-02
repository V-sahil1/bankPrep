import { prisma } from "@/lib/prisma";
import { TOPIC_CONTENT, type SeedTopicContent } from "@/prisma/seed-data/topic-content";

export type CheatSheet = {
  key: string;
  topicName: string;
  subjectSlug: string;
  subjectName: string;
  /** Null when the topic isn't in the current catalog, so there is nothing to practise yet. */
  practiceHref: string | null;
  intro: string | null;
  formulas: { title: string; expression: string; description: string | null }[];
  rules: string[];
  shortcuts: string[];
  mistakes: string[];
};

const titleFromSlug = (slug: string) =>
  slug
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

function fromContent(content: SeedTopicContent): Pick<CheatSheet, "intro" | "formulas" | "rules" | "shortcuts" | "mistakes"> {
  return {
    intro: content.intro,
    formulas: (content.formulas ?? []).map((f) => ({ title: f.title, expression: f.expression, description: f.description ?? null })),
    rules: content.concepts ?? [],
    shortcuts: content.shortcuts ?? [],
    mistakes: content.mistakes ?? [],
  };
}

/**
 * Every cheat sheet in the app, in syllabus order. Formulas and notes stored against
 * a topic win, so admin edits show up; the bundled topic content fills in the rest.
 */
export async function getCheatSheets(): Promise<CheatSheet[]> {
  const subjects = await prisma.subject.findMany({
    orderBy: { order: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      topics: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          name: true,
          formulas: { orderBy: { order: "asc" } },
          notes: { orderBy: { order: "asc" } },
        },
      },
    },
  });

  const sheets: CheatSheet[] = [];
  const used = new Set<string>();

  for (const subject of subjects) {
    for (const topic of subject.topics) {
      const key = `${subject.slug}/${topic.name}`;
      const bundled = TOPIC_CONTENT[key];
      used.add(key);

      const notes = (kind: string) => topic.notes.filter((n) => n.kind === kind).map((n) => n.content);
      const stored = topic.formulas.length > 0 || topic.notes.length > 0;
      if (!stored && !bundled) continue;

      sheets.push({
        key,
        topicName: topic.name,
        subjectSlug: subject.slug,
        subjectName: subject.name,
        practiceHref: `/practice?subject=${subject.id}&topic=${topic.id}`,
        ...(stored
          ? {
              intro: notes("INTRODUCTION")[0] ?? null,
              formulas: topic.formulas.map((f) => ({ title: f.title, expression: f.expression, description: f.description })),
              rules: notes("CONCEPT"),
              shortcuts: notes("SHORTCUT"),
              mistakes: notes("COMMON_MISTAKE"),
            }
          : fromContent(bundled)),
      });
    }
  }

  // Bundled sheets for topics the catalog doesn't have (yet) are still worth reading.
  for (const [key, content] of Object.entries(TOPIC_CONTENT)) {
    if (used.has(key)) continue;
    const [subjectSlug, topicName] = key.split("/");
    const subject = subjects.find((s) => s.slug === subjectSlug);
    sheets.push({
      key,
      topicName,
      subjectSlug,
      subjectName: subject?.name ?? titleFromSlug(subjectSlug),
      practiceHref: null,
      ...fromContent(content),
    });
  }

  return sheets;
}
