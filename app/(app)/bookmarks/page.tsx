import { Bookmark } from "lucide-react";
import { EmptyState, LinkButton, PageHeader } from "@/components/app/common";
import { BookmarksView } from "@/features/bookmarks/bookmarks-view";
import { requireUserPage } from "@/lib/session";
import { getBookmarks } from "@/services/notebook";

export const metadata = { title: "Bookmarks" };

export default async function BookmarksPage() {
  const user = await requireUserPage();
  const bookmarks = await getBookmarks(user.id);
  return (
    <>
      <PageHeader title="Bookmarks" description="Questions you saved, grouped by subject and topic." />
      {bookmarks.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No bookmarks yet"
          description="Use the bookmark icon on any question to save it here for later."
          action={<LinkButton href="/practice">Start practising</LinkButton>}
        />
      ) : (
        <BookmarksView bookmarks={bookmarks} />
      )}
    </>
  );
}
