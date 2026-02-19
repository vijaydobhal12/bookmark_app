"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import Loader from "@/app/components/Loader"
import { LogOut, Trash2, Link2, Bookmark, ExternalLink } from "lucide-react"

export default function Saved() {
  const [user, setUser] = useState<any>(null)
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = "/auth/login"
      } else {
        setUser(data.user)
        fetchBookmarks(data.user.id)
      }
    })

    const channel = supabase
      .channel("bookmarks-saved")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        () => {
          if (user) fetchBookmarks(user.id)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchBookmarks = async (userId: string) => {
    setLoading(true)
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    setBookmarks(data || [])
    setLoading(false)
  }

  const removeBookmark = async (id: string) => {
    setDeleting(id)
    await supabase.from("bookmarks").delete().eq("id", id)
    setDeleting(null)
    setBookmarks(bookmarks.filter(b => b.id !== id))
  }

  const logout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/auth/login"
  }

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
  }

  return (
    <div className="page-container">
      <div className="header">
        <h1 className="header-title">Saved Bookmarks</h1>
        <div className="header-actions">
          <button onClick={logout} className="icon-btn" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : bookmarks.length === 0 ? (
        <div className="empty-state animate-fade-in">
          <div className="empty-state-icon">
            <Bookmark size={36} />
          </div>
          <div className="empty-state-title">No saved bookmarks</div>
          <div className="empty-state-description">
            Go to Home to add some bookmarks!
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((b, index) => (
            <div 
              key={b.id} 
              className="bookmark-card animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bookmark-favicon">
                <Link2 size={20} className="text-[var(--text-muted)]" />
              </div>
              <div className="bookmark-info">
                <div className="bookmark-title">{b.title}</div>
                <div className="bookmark-url">{getDomain(b.url)}</div>
              </div>
              <div className="flex items-center gap-2">
                <a 
                  href={b.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="icon-btn"
                  title="Open link"
                >
                  <ExternalLink size={16} />
                </a>
                <button 
                  onClick={() => removeBookmark(b.id)}
                  disabled={deleting === b.id}
                  className="icon-btn icon-btn-danger"
                  title="Delete"
                >
                  {deleting === b.id ? (
                    <div className="spinner w-4 h-4" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
