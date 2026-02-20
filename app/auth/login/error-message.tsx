"use client"

import { useSearchParams } from "next/navigation"
import { AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ErrorMessage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  if (!error) {
    return null
  }

  return (
    <div className="error-container" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <AlertCircle size={64} color="#dc2626" style={{ marginBottom: '16px' }} />
        <h1 style={{ fontSize: '24px', marginBottom: '12px' }}>Authentication Failed</h1>
        <p style={{ color: '#666', marginBottom: '24px' }}>
          There was a problem logging you in. Please try again.
        </p>
        
        {error === "auth_failed" && (
          <div style={{
            backgroundColor: '#fee2e2',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '24px',
            fontSize: '14px'
          }}>
            <strong>Troubleshooting:</strong>
            <ul style={{ textAlign: 'left', marginTop: '8px', paddingLeft: '20px' }}>
              <li>Make sure your Vercel environment variables are set</li>
              <li>Check that your Supabase redirect URLs include your Vercel URL</li>
              <li>Verify Google OAuth is enabled in Supabase</li>
            </ul>
          </div>
        )}

        <Link 
          href="/auth/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            backgroundColor: '#2563eb',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none'
          }}
        >
          <ArrowLeft size={20} />
          Try Again
        </Link>
      </div>
    </div>
  )
}
