"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import Loader from "@/app/components/Loader"
import { Search, LogOut, Plus, Trash2, Link2, Bookmark, ExternalLink, User } from "lucide-react"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [filteredBookmarks, setFilteredBookmarks] = useState<any[]>([])
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    // Check for session with retry mechanism to handle race condition
    const checkSession = async () => {
      let attempts = 0
      const maxAttempts = 3
      
      while (attempts < maxAttempts) {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setUser(session.user)
          // Fetch bookmarks after user is set
          fetchBookmarks(session.user.id)
          return
        }
        
        // If no session, wait a bit and retry (handles delayed session propagation)
        if (attempts < maxAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }
        attempts++
      }
      
      // If still no session after retries, redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = "/auth/login"
      }
    }

    checkSession()

    const channel = supabase
      .channel("bookmarks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        () => user && fetchBookmarks(user.id)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBookmarks(bookmarks)
    } else {
      const filtered = bookmarks.filter(
        (b) =>
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.url.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredBookmarks(filtered)
    }
  }, [searchQuery, bookmarks])

  const fetchBookmarks = async (userId?: string) => {
    setLoading(true)
    const currentUserId = userId || user?.id
    
    let query = supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false })
    
    // Filter by user_id if available (security - show only user's bookmarks)
    if (currentUserId) {
      query = query.eq("user_id", currentUserId)
    }
    
    const { data, error } = await query

    if (error) {
      console.error("Error fetching bookmarks:", error)
      setBookmarks([])
      setFilteredBookmarks([])
    } else {
      setBookmarks(data || [])
      setFilteredBookmarks(data || [])
    }
    setLoading(false)
  }

  const addBookmark = async () => {
    // Check if user is authenticated
    if (!user) {
      setSuccessMessage("Please log in to add bookmarks")
      setTimeout(() => setSuccessMessage(""), 3000)
      return
    }

    if (!url || !title) {
      setSuccessMessage("Please fill in both URL and title")
      setTimeout(() => setSuccessMessage(""), 3000)
      return
    }

    setSaving(true)
    console.log("Adding bookmark for user:", user.id)
    
    const { data, error } = await supabase.from("bookmarks").insert({
      url,
      title,
      user_id: user.id,
    })

    console.log("Insert result:", { data, error })

    if (error) {
      console.error("Error adding bookmark:", error)
      setSuccessMessage("Failed to add bookmark: " + error.message)
      setTimeout(() => setSuccessMessage(""), 3000)
    } else {
      setSuccessMessage("Bookmark added successfully!")
      setTimeout(() => setSuccessMessage(""), 3000)
      // Refresh bookmarks to show the new one
      await fetchBookmarks()
    }

    setUrl("")
    setTitle("")
    setSaving(false)
  }

  const removeBookmark = async (id: string) => {
    setDeleting(id)
    await supabase.from("bookmarks").delete().eq("id", id)
    setDeleting(null)
    setSuccessMessage("Bookmark deleted successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/auth/login"
  }

  const recentBookmarks = filteredBookmarks.slice(0, 5)

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
  }

  // Get user avatar URL and display name - check multiple sources for avatar
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || user?.user_metadata?.avatarUrl
  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const initial = fullName.charAt(0).toUpperCase()

  console.log("User metadata:", user?.user_metadata)
  console.log("Avatar URL:", avatarUrl)

  return (
    <div className="page-container">
      <div className="header">
        <div className="header-left">
          <h1 className="header-title">Bookmarks</h1>
        </div>
        <div className="header-actions">
          <div className="user-info" title={fullName}>
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={fullName} 
                className="user-avatar"
              />
            ) : (
              <div className="user-avatar-fallback" title={fullName}>
                {initial}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`icon-btn ${showSearch ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : ''}`}
            title="Search"
          >
            <Search size={20} />
          </button>
          <button onClick={logout} className="icon-btn" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="mb-4 animate-fade-in">
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-modern"
            autoFocus
          />
        </div>
      )}

      {successMessage && (
        <div className="mb-4 toast-success animate-fade-in">
          {successMessage}
        </div>
      )}

      <div className="card mb-6 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <Plus size={20} className="text-[var(--primary)]" />
          <span className="font-semibold text-[var(--text-primary)]">Add New Bookmark</span>
        </div>
        <div className="space-y-3">
          <input
            className="input-modern"
            placeholder="Bookmark Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="input-modern"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={addBookmark}
            disabled={saving}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            {saving ? "Adding..." : "Add Bookmark"}
          </button>
        </div>
      </div>

      <div>
        <div className="section-header">
          <h2 className="section-title">Recent</h2>
          <span className="badge badge-primary">{recentBookmarks.length}</span>
        </div>
        
        {loading ? (
          <Loader />
        ) : recentBookmarks.length === 0 ? (
          <div className="empty-state animate-fade-in">
            <div className="empty-state-icon">
              <Bookmark size={36} />
            </div>
            <div className="empty-state-title">
              {searchQuery ? "No bookmarks found" : "No bookmarks yet"}
            </div>
            <div className="empty-state-description">
              {searchQuery 
                ? "Try adjusting your search terms" 
                : "Add your first bookmark using the form above!"}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {recentBookmarks.map((b, index) => (
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

        {searchQuery && filteredBookmarks.length > 0 && (
          <p className="text-sm text-[var(--text-muted)] mt-4 text-center">
            Showing {filteredBookmarks.length} of {bookmarks.length} bookmarks
          </p>
        )}
      </div>
    </div>
  )
}
