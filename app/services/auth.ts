import { createClient } from "@/lib/supabase/client"

export const signInWithGoogle = async () => {
  const supabase = createClient()

  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${location.origin}/auth/callback`,
    },
  })
}

export const signOut = async () => {
  const supabase = createClient()
  await supabase.auth.signOut()
}
