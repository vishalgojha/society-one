import { supabase } from '@/api/supabaseClient';

export async function uploadFile(file, bucket = 'visitor-media') {
  const extension = file.name?.split('.').pop() ?? 'bin';
  const path = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: false,
    contentType: file.type || undefined,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
