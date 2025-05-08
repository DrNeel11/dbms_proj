import { createStorageBucket } from './storage';

export async function initializeSupabase() {
  try {
    // Create storage bucket for audio files
    const { success, error } = await createStorageBucket();
    
    if (!success) {
      console.error('Failed to create storage bucket:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error initializing Supabase:', error);
    return false;
  }
} 