import { supabase } from './client';

export const STORAGE_BUCKET_NAME = 'songs';

export async function createStorageBucket() {
  try {
    // Just verify the bucket exists
    const { data: bucket, error } = await supabase
      .storage
      .getBucket(STORAGE_BUCKET_NAME);

    if (error) {
      console.error('Error accessing bucket:', error);
      return { success: false, error };
    }

    console.log('Storage bucket is accessible');
    return { success: true };
  } catch (error) {
    console.error('Error in createStorageBucket:', error);
    return { success: false, error };
  }
}

export async function uploadAudioFile(file: File): Promise<string | null> {
  try {
    const timestamp = new Date().getTime();
    const filename = `${timestamp}_${file.name}`;
    const filePath = `audio/${filename}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading audio file:', error);
    return null;
  }
}

export async function deleteAudioFile(filePath: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error deleting audio file:', error);
    return false;
  }
} 