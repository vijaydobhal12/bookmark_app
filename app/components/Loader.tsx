"use client"

export default function Loader() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-[var(--secondary-dark)]"></div>
        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-t-[var(--primary)] animate-spin"></div>
      </div>
    </div>
  )
}
