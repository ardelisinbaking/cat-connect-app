import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function forgotPasswordAction(formData: FormData) {
  'use server';
  
  try {
    const email = formData.get('email') as string;
    
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    })

    if (resetError) {
      return { error: resetError.message }
    }

    return { success: 'Check your email for the reset link' }
    
  } catch (err) {
    return { error: 'Failed to send reset email' }
  }
}