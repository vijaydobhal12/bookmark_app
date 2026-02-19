"use client"

import { useState } from "react"

export default function BookmarkForm({ onAdd }: any) {
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")

  return (
    <div className="space-y-2">
      <input
        className="border p-2 w-full"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="border p-2 w-full"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        onClick={() => {
          onAdd(url, title)
          setUrl("")
          setTitle("")
        }}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Add Bookmark
      </button>
    </div>
  )
}
