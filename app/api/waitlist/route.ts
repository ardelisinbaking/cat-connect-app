// app/api/waitlist/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { email, userType, signupDate } = await request.json();

    // Validate input
    if (!email || !userType) {
      return NextResponse.json(
        { error: 'Email and user type are required' },
        { status: 400 }
      );
    }

    // Check for existing waitlist entry
    const { data: existingEntries, error: existingError } = await supabase
      .from('Waitlist')
      .select()
      .eq('email', email)

      if (existingError) {
        console.error('Error checking existing entry:', existingError);
        throw existingError;
      }

    if (existingEntries && existingEntries.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create new waitlist entry
    const { data, error: insertError } = await supabase
      .from('Waitlist')
      .insert([
        {
          email,
          userType,
          signupDate: signupDate ? new Date(signupDate) : new Date(),
        },
      ])
      .select()

    if (insertError) {

      console.error('Error inserting data:', {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint 
    });
      throw insertError;
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json(
      { error: 'Failed to join waitlist', details: error },
      { status: 500 }
    );
  }
}
