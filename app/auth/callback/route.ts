// app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      
      // Exchange the code for a session
      const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
      if (sessionError) throw sessionError

      // Get the user's type from the database
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      if (user) {
        // Query the User table to get the user type
        const { data: userData, error: dbError } = await supabase
          .from('User')
          .select('userType')
          .eq('id', user.id)
          .single()
        
        if (dbError) throw dbError

        // Determine redirect path based on user type
        let redirectPath = '/cats' // default redirect
        
        if (userData?.userType === 'CAT_OWNER') {
          redirectPath = '/cats/my-cats'//for cat owners to manage their cats
        } else if (userData?.userType === 'CAT_LOVER') {
          redirectPath = '/cats'//for cat lovers to browse available cats
        }
        
        return NextResponse.redirect(new URL(redirectPath, request.url))
      }
    }

    // If no code or user found, redirect to home page
    return NextResponse.redirect(new URL('/', request.url))
    
  } catch (error) {
    console.error('Auth callback error:', error)
    // Redirect to login page with error parameter
    return NextResponse.redirect(new URL('/login?error=auth_callback_error', request.url))
  }
}