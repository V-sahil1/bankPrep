import { BadgeCheck, ClipboardList, Clock, FileQuestion, Info } from "lucide-react";
import { EmptyState, LinkButton, PageHeader, Panel } from "@/components/app/common";
import { StartMockButton } from "@/features/mock-tests/start-mock-button";
import { formatDate } from "@/lib/dates";
import { requireUserPage } from "@/lib/session";
import { listMockTests } from "@/services/mock-tests";

export const metadata = { title: "Mock Tests" };

export default async function MockTestsPage() {
  const user = await requireUserPage();
  const tests = await listMockTests(user.id);

  const byExam = new Map<string, { name: string; tests: typeof tests }>();
  for (const test of tests) {
    const group = byExam.get(test.exam.id) ?? { name: test.exam.name, tests: [] };
    group.tests.push(test);
    byExam.set(test.exam.id, group);
  }

  return (
    <>
      <PageHeader title="Mock Tests" description="Timed tests with each exam's sections, section timers and negative marking." />
      {tests.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No mock tests yet" description="An administrator needs to create a mock test." />
      ) : (
        <div className="space-y-8">
          {[...byExam.entries()].map(([examId, group]) => (
            <section key={examId} aria-labelledby={`exam-${examId}`}>
              <h2 id={`exam-${examId}`} className="mb-3 text-base font-semibold">
                {group.name}
              </h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {group.tests.map((test) => {
                  const running = test.attempts.find((a) => a.status === "IN_PROGRESS");
                  const lastDone = test.attempts.find((a) => a.status === "SUBMITTED");
                  return (
                    <Panel key={test.id} className="flex flex-col">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold">{test.title}</h3>
                          {test.description && <p className="mt-0.5 text-xs text-muted-foreground">{test.description}</p>}
                        </div>
                        {running ? (
                          <LinkButton href={`/mock-tests/attempt/${running.id}`} size="sm" variant="outline">
                            Resume
                          </LinkButton>
                        ) : (
                          <StartMockButton mockTestId={test.id} minutes={test.totalMinutes} title={test.title} />
                        )}
                      </div>
                      <p className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground tabular-nums">
                        <span className="flex items-center gap-1">
                          <FileQuestion className="size-3.5" aria-hidden /> {test.totalQuestions} questions
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5" aria-hidden /> {test.totalMinutes} min
                        </span>
                      </p>
                      <table className="w-full text-xs">
                        <caption className="sr-only">Sections of {test.title}</caption>
                        <thead className="text-muted-foreground">
                          <tr>
                            <th scope="col" className="py-1 text-left font-medium">Section</th>
                            <th scope="col" className="py-1 text-right font-medium">Qs</th>
                            <th scope="col" className="py-1 text-right font-medium">Min</th>
                            <th scope="col" className="py-1 text-right font-medium">Marks</th>
                            <th scope="col" className="py-1 text-right font-medium">Negative</th>
                          </tr>
                        </thead>
                        <tbody className="tabular-nums">
                          {test.sections.map((section) => (
                            <tr key={section.name} className="border-t border-border/60">
                              <td className="py-1">{section.name}</td>
                              <td className="py-1 text-right">{section.questionCount}</td>
                              <td className="py-1 text-right">{section.minutes}</td>
                              <td className="py-1 text-right">{section.marksPerQuestion}</td>
                              <td className="py-1 text-right">-{section.negativeMarks}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                        {test.patternVerified ? (
                          <span className="flex items-center gap-1 text-success">
                            <BadgeCheck className="size-3.5" aria-hidden /> Pattern verified by an administrator
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-muted-foreground" title={test.patternNotes ?? undefined}>
                            <Info className="size-3.5" aria-hidden /> Practice pattern. Check the latest official notification.
                          </span>
                        )}
                        {lastDone && (
                          <LinkButton href={`/mock-tests/attempt/${lastDone.id}/results`} variant="link" size="xs" className="h-auto p-0">
                            Last score {lastDone.score}/{lastDone.maxScore} · {formatDate(lastDone.startedAt)}
                          </LinkButton>
                        )}
                      </div>
                    </Panel>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
