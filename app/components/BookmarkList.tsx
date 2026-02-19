import BookmarkItem from "./BookmarkItem"

export default function BookmarkList({ bookmarks, onDelete }: any) {
  return (
    <div className="space-y-2">
      {bookmarks.map((b: any) => (
        <BookmarkItem key={b.id} bookmark={b} onDelete={onDelete} />
      ))}
    </div>
  )
}
