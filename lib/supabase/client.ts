import { createBrowserClient } from '@supabase/ssr'

let supabaseClient: ReturnType<typeof createBrowserClient> | undefined

// Dummy object for SSR/build time - with proper method chaining
const dummyFrom = () => ({
  select: () => ({
    order: () => ({ data: null, error: null }),
    eq: () => ({
      order: () => ({ data: null, error: null }),
    }),
  }),
  insert: () => ({ error: null }),
  delete: () => ({
    eq: () => ({ error: null }),
  }),
})

const dummySupabase = {
  auth: {
    signInWithOAuth: async () => ({ data: null, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    signOut: async () => ({ error: null }),
  },
  from: dummyFrom,
  channel: () => ({
    on: () => ({ subscribe: () => () => {} }),
  }),
  removeChannel: () => {},
}

// Lazy initialization - only create client when called and in browser environment
export const supabase = (() => {
  if (typeof window === 'undefined') {
    return dummySupabase
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
    return dummySupabase
  }
  
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
}
