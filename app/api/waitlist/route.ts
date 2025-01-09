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
    const { data: existingEntry } = await supabase
      .from('waitlist')
      .select()
      .eq('email', email)
      .single();

    if (existingEntry) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create new waitlist entry
    const { data, error } = await supabase
      .from('waitlist')
      .insert([
        {
          email,
          userType,
          signupDate: signupDate ? new Date(signupDate) : new Date(),
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json(
      { error: 'Failed to join waitlist' },
      { status: 500 }
    );
  }
}




// import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function POST(request: Request) {
//   try {
//     const { email, userType, signupDate } = await request.json();

//     // Validate input
//     if (!email || !userType) {
//       return NextResponse.json(
//         { error: 'Email and user type are required' },
//         { status: 400 }
//       );
//     }

//     // Check for existing waitlist entry
//     const existingEntry = await prisma.waitlist.findUnique({
//       where: { email },
//     });

//     if (existingEntry) {
//       return NextResponse.json(
//         { error: 'Email already registered' },
//         { status: 400 }
//       );
//     }

//     // Create new waitlist entry
//     const waitlistEntry = await prisma.waitlist.create({
//       data: {
//         email,
//         userType,
//         signupDate: new Date(signupDate),
//       },
//     });

//     return NextResponse.json(waitlistEntry, { status: 201 });
//   } catch (error) {
//     console.error('Waitlist error:', error);
//     return NextResponse.json(
//       { error: 'Failed to join waitlist' },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }