import { createBrowserClient } from '@supabase/ssr'

let supabaseClient: ReturnType<typeof createBrowserClient> | undefined

// Lazy initialization - only create client when called and in browser environment
export const supabase = (() => {
  if (typeof window === 'undefined') {
    // Return a dummy object during SSR/build time
    return {
      auth: {
        signInWithOAuth: async () => ({ data: null, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        signOut: async () => ({ error: null }),
      },
    }
  }
  
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )
  }
  
  return supabaseClient
})()

// Factory export for compatibility with `createClient` imports
export const createClient = () => {
  if (typeof window === 'undefined') {
    // Return a dummy object during SSR/build time
    return {
      auth: {
        signInWithOAuth: async () => ({ data: null, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        signOut: async () => ({ error: null }),
      },
    }
  }
  
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
}

