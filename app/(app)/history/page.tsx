import { History } from "lucide-react";
import { EmptyState, LinkButton, PageHeader, Panel, PanelTitle } from "@/components/app/common";
import { formatDateTime, formatDuration } from "@/lib/dates";
import { requireUserPage } from "@/lib/session";
import { getHistory, percent } from "@/services/analytics";

export const metadata = { title: "Study History" };

const SCOPE_LABEL: Record<string, string> = {
  BOOKMARKS: "Bookmarks",
  MISTAKES: "Mistake retry",
  PYQ: "Previous year questions",
};
const STATUS_LABEL = { IN_PROGRESS: "In progress", COMPLETED: "Completed", ABANDONED: "Discarded" };

export default async function HistoryPage() {
  const user = await requireUserPage();
  const { sessions, attempts } = await getHistory(user.id);

  if (sessions.length === 0 && attempts.length === 0) {
    return (
      <>
        <PageHeader title="Study History" />
        <EmptyState
          icon={History}
          title="Nothing here yet"
          description="Your practice sessions and mock tests will be listed here."
          action={<LinkButton href="/practice">Start practising</LinkButton>}
        />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Study History" description="Practice sessions and mock tests, newest first." />
      <div className="space-y-6">
        <Panel>
          <PanelTitle>Practice sessions</PanelTitle>
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No practice sessions yet.</p>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="w-full min-w-xl text-sm">
                <thead className="text-xs text-muted-foreground">
                  <tr>
                    <th scope="col" className="py-1.5 text-left font-medium">Session</th>
                    <th scope="col" className="py-1.5 text-left font-medium">Started</th>
                    <th scope="col" className="py-1.5 text-left font-medium">Mode</th>
                    <th scope="col" className="py-1.5 text-right font-medium">Score</th>
                    <th scope="col" className="py-1.5 text-right font-medium">Accuracy</th>
                    <th scope="col" className="py-1.5 text-right font-medium">Time</th>
                    <th scope="col" className="py-1.5 text-right font-medium"><span className="sr-only">Open</span></th>
                  </tr>
                </thead>
                <tbody className="tabular-nums">
                  {sessions.map((session) => {
                    const attempted = session.correctCount + session.incorrectCount;
                    const running = session.status === "IN_PROGRESS";
                    return (
                      <tr key={session.id} className="border-t">
                        <td className="py-2 pr-3">
                          <span className="block font-medium">{session.topic?.name ?? SCOPE_LABEL[session.scope] ?? "Practice"}</span>
                          <span className="block text-xs text-muted-foreground">
                            {[session.exam?.shortName ?? (session.scope === "COMMON_TOPIC" ? "Common practice" : null), STATUS_LABEL[session.status]].filter(Boolean).join(" · ")}
                          </span>
                        </td>
                        <td className="py-2 pr-3 whitespace-nowrap text-muted-foreground">{formatDateTime(session.startedAt)}</td>
                        <td className="py-2 pr-3">{session.mode === "TEST" ? "Test" : "Practice"}</td>
                        <td className="py-2 text-right">{session.correctCount}/{session.questionCount}</td>
                        <td className="py-2 text-right">{attempted ? `${percent(session.correctCount, attempted)}%` : "–"}</td>
                        <td className="py-2 text-right whitespace-nowrap">{formatDuration(session.timeSpentSec)}</td>
                        <td className="py-2 text-right">
                          <LinkButton
                            variant="ghost"
                            size="sm"
                            href={running ? `/practice/session/${session.id}` : `/practice/session/${session.id}/results`}
                          >
                            {running ? "Resume" : "Review"}
                          </LinkButton>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <Panel>
          <PanelTitle>Mock tests</PanelTitle>
          {attempts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No mock tests yet.</p>
          ) : (
            <ul className="divide-y">
              {attempts.map((attempt) => {
                const running = attempt.status === "IN_PROGRESS";
                return (
                  <li key={attempt.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{attempt.mockTest.title}</span>
                      <span className="block text-xs text-muted-foreground">
                        {formatDateTime(attempt.startedAt)} · {running ? "In progress" : `Score ${attempt.score}/${attempt.maxScore}`}
                      </span>
                    </span>
                    <LinkButton
                      variant="ghost"
                      size="sm"
                      href={running ? `/mock-tests/attempt/${attempt.id}` : `/mock-tests/attempt/${attempt.id}/results`}
                    >
                      {running ? "Resume" : "Review"}
                    </LinkButton>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
