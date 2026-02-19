export type Bookmark = {
  id: string
  url: string
  title: string
  created_at: string
  user_id: string
}

export type BookmarkInput = {
  url: string
  title: string
}
