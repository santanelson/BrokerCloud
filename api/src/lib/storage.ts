import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabase: SupabaseClient | null = null;

function getSupabase() {
  if (supabase) return supabase;
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase credentials (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY) are missing in environment variables.');
  }
  
  supabase = createClient(supabaseUrl, supabaseServiceKey);
  return supabase;
}

export async function generatePresignedUploadUrl(
  key: string,
  contentType: string
): Promise<{ uploadUrl: string; publicUrl: string }> {
  // Not used much since frontend uploads directly using anon key,
  // but keeping signature for compatibility if needed.
  throw new Error('Not implemented for Supabase yet')
}

export async function uploadFileToSupabaseStorage(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const client = getSupabase();
  
  const { data, error } = await client.storage
    .from('broker')
    .upload(fileName, fileBuffer, {
      contentType,
      upsert: true,
    })

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  const { data: publicUrlData } = client.storage
    .from('broker')
    .getPublicUrl(fileName)

  return publicUrlData.publicUrl
}
