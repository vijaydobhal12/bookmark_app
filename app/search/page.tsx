"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import Loader from "@/app/components/Loader"
import { Search as SearchIcon, LogOut, Trash2, Link2, X, ExternalLink, FileSearch } from "lucide-react"

export default function Search() {
  const [user, setUser] = useState<any>(null)
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredBookmarks, setFilteredBookmarks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }: any) => {
      if (!data?.user) {
        window.location.href = "/auth/login"
      } else {
        setUser(data.user)
        fetchBookmarks(data.user.id)
      }
    })

    const channel = supabase
      .channel("bookmarks-search")
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

  // Filter bookmarks when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBookmarks([])
    } else {
      const filtered = bookmarks.filter(
        (b) =>
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.url.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredBookmarks(filtered)
    }
  }, [searchQuery, bookmarks])

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
    setFilteredBookmarks(filteredBookmarks.filter(b => b.id !== id))
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

  const clearSearch = () => {
    setSearchQuery("")
  }

  return (
    <div className="page-container">
      <div className="header">
        <h1 className="header-title">Search Bookmarks</h1>
        <div className="header-actions">
          <button onClick={logout} className="icon-btn" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="search-container animate-fade-in">
        <div className="search-input-wrapper">
          <SearchIcon size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by title or URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            autoFocus
          />
          {searchQuery && (
            <button onClick={clearSearch} className="search-clear" title="Clear search">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      <div className="mt-6">
        {loading ? (
          <Loader />
        ) : searchQuery.trim() === "" ? (
          <div className="empty-state animate-fade-in">
            <div className="empty-state-icon">
              <SearchIcon size={36} />
            </div>
            <div className="empty-state-title">Search for bookmarks</div>
            <div className="empty-state-description">
              Enter a search term to find your bookmarks
            </div>
          </div>
        ) : filteredBookmarks.length === 0 ? (
          <div className="empty-state animate-fade-in">
            <div className="empty-state-icon">
              <FileSearch size={36} />
            </div>
            <div className="empty-state-title">No results found</div>
            <div className="empty-state-description">
              No bookmarks matching "{searchQuery}"
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <p className="results-count">
              Found <span className="font-semibold text-[var(--primary)]">{filteredBookmarks.length}</span> bookmark(s)
            </p>
            <div className="space-y-3 mt-4">
              {filteredBookmarks.map((b, index) => (
                <div 
                  key={b.id} 
                  className="bookmark-card"
                  style={{ animationDelay: `${index * 0.05}s` }}
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
          </div>
        )}
      </div>
    </div>
  )
}
