// tests/api/supabase/connection.ts

//test the connection at any time by running: npx tsx tests/api/supabase/connection.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function testConnection() {
  console.log('URL:', supabaseUrl);
  console.log('Key starts with:', supabaseServiceKey.substring(0, 6));
  try {
    // Try to fetch a single row from the waitlist table
    const { data, error } = await supabase
      .from('Waitlist')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Detailed error:', error);
      throw error;
    }

    // Return success response with connection status
    return({
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
    
    return({
      status: 'error',
      message: 'Failed to connect to Supabase',
      error: error.message,
      connectionTest: {
        canConnect: false,
        canQuery: false,
        databaseAccess: false,
        details: error
      }
    )
  }
}

// You can test the connection by running this file directly with Node
// if (require.main === module) {
//   testConnection()
//     .then(result => console.log(JSON.stringify(result, null, 2)))
//     .catch(console.error);
// }
