import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function generatePresignedUploadUrl(
  key: string,
  contentType: string
): Promise<{ uploadUrl: string; publicUrl: string }> {
  // Not used much since frontend uploads directly using anon key,
  // but keeping signature for compatibility if needed.
  throw new Error('Not implemented for Supabase yet')
}

export async function uploadFileToR2(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const { data, error } = await supabase.storage
    .from('broker')
    .upload(fileName, fileBuffer, {
      contentType,
      upsert: true,
    })

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  const { data: publicUrlData } = supabase.storage
    .from('broker')
    .getPublicUrl(fileName)

  return publicUrlData.publicUrl
}
