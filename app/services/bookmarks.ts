import { createClient } from "@/lib/supabase/client"
import { Bookmark, BookmarkInput } from "../types/bookmark"

export const fetchBookmarks = async (): Promise<Bookmark[]> => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Service: fetchBookmarks error:", error)
    throw error
  }

  return (data ?? []) as Bookmark[]
}

export const fetchBookmarksByUser = async (userId: string): Promise<Bookmark[]> => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Service: fetchBookmarksByUser error:", error)
    throw error
  }

  return (data ?? []) as Bookmark[]
}

export const addBookmark = async (
  input: BookmarkInput,
  userId: string
): Promise<void> => {
  const supabase = createClient()

  console.log("Service: Adding bookmark:", { ...input, userId })

  const { error } = await supabase.from("bookmarks").insert({
    url: input.url,
    title: input.title,
    user_id: userId,
  })

  if (error) {
    console.error("Service: addBookmark error:", error)
    throw error
  }

  console.log("Service: Bookmark added successfully")
}

export const deleteBookmark = async (id: string): Promise<void> => {
  const supabase = createClient()

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError) {
    console.error("Service: Session error during delete:", sessionError)
    throw new Error("Authentication error. Please log in again.")
  }

  if (!session?.user) {
    console.warn("Service: No user session found for delete operation")
    throw new Error("Please log in to delete bookmarks")
  }

  console.log("Service: Deleting bookmark:", {
    id,
    userId: session.user.id,
  })

  // Fixed: Delete by id (and user_id for security via RLS)
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id)
    .eq("user_id", session.user.id)

  if (error) {
    console.error("Service: Error deleting bookmark:", error)
    throw error
  }

  console.log("Service: Bookmark deleted successfully:", id)
}
