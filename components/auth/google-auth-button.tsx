// components/auth/google-auth-button.tsx
import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/auth-provider"
import { useState } from "react"

export function GoogleAuthButton() {
  const { signInWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)
  
  const handleSignIn = async () => {
    try {
      setLoading(true)
      await signInWithGoogle()
    } catch (error) {
      console.error('Error signing in with Google:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      className="w-full flex items-center justify-center gap-2"
      onClick={handleSignIn}
      disabled={loading}
    >
      <svg
        className="h-5 w-5"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
      </svg>
      {loading ? 'Signing in...' : 'Continue with Google'}
    </Button>
  )
}