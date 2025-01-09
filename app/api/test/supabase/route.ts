// app/api/test/supabase/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  try {
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Try to fetch a single row from the waitlist table
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .limit(1);

    if (error) {
      throw error;
    }

    // Return success response with connection status
    return NextResponse.json({
      status: 'success',
      message: 'Successfully connected to Supabase',
      connectionTest: {
        canConnect: true,
        canQuery: true,
        databaseAccess: true,
        firstRow: data?.[0] || null
      }
    });

  } catch (error: any) {
    console.error('Supabase connection test error:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Failed to connect to Supabase',
      error: error.message,
      connectionTest: {
        canConnect: false,
        canQuery: false,
        databaseAccess: false,
        details: error
      }
    }, { status: 500 });
  }
}