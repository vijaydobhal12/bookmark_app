import { createClient } from "@/lib/supabase/client"
import { Bookmark, BookmarkInput } from "../types/bookmark"

export const fetchBookmarks = async (): Promise<Bookmark[]> => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export const fetchBookmarksByUser = async (userId: string): Promise<Bookmark[]> => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export const addBookmark = async (input: BookmarkInput, userId: string): Promise<void> => {
  const supabase = createClient()

  const { error } = await supabase.from("bookmarks").insert({
    url: input.url,
    title: input.title,
    user_id: userId,
  })

  if (error) throw error
}

export const deleteBookmark = async (id: string): Promise<void> => {
  const supabase = createClient()

  const { error } = await supabase.from("bookmarks").delete().eq("id", id)

  if (error) throw error
}
