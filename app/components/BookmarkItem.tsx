import { Bookmark } from "../types/bookmark";

interface BookmarkItemProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
}

export default function BookmarkItem({ bookmark, onDelete }: BookmarkItemProps) {
  return (
    <div className="border p-4 rounded shadow">
      <h3 className="font-bold">{bookmark.title}</h3>
      <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
        {bookmark.url}
      </a>
      <p className="text-sm text-gray-500">Created: {new Date(bookmark.created_at).toLocaleDateString()}</p>
      <button
        onClick={() => onDelete(bookmark.id)}
        className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
      >
        Delete
      </button>
    </div>
  );
}
