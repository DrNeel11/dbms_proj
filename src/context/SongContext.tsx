import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: string;
  rating: number | null;
  audio_path: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  user_id?: string | null;
}

interface SongContextType {
  songs: Song[];
  loading: boolean;
  addSong: (song: Omit<Song, 'id'>) => Promise<void>;
  updateSong: (id: string, song: Omit<Song, 'id'>) => Promise<void>;
  deleteSong: (id: string) => Promise<void>;
  filteredSongs: Song[];
  setFilter: (filter: { artist?: string; album?: string; genre?: string }) => void;
}

const SongContext = createContext<SongContextType | undefined>(undefined);

export const SongProvider = ({ children }: { children: ReactNode }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{ artist?: string; album?: string; genre?: string }>({});

  // Fetch songs from Supabase
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('songs')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setSongs(data || []);
      } catch (error) {
        console.error('Error fetching songs:', error);
        toast.error('Failed to load songs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  // Add a new song to Supabase
  const addSong = async (song: Omit<Song, 'id'>) => {
    try {
      // Insert song without user_id since we modified the RLS policy
      const { data, error } = await supabase
        .from('songs')
        .insert([{
          ...song,
          audio_path: song.audio_path || null
        }])
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        setSongs([data[0], ...songs]);
        toast.success('Song added successfully');
      }
    } catch (error) {
      console.error('Error adding song:', error);
      toast.error('Failed to add song. Please try again.');
      throw error;
    }
  };

  // Update an existing song in Supabase
  const updateSong = async (id: string, updatedSong: Omit<Song, 'id'>) => {
    try {
      const { error } = await supabase
        .from('songs')
        .update(updatedSong)
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setSongs(songs.map(song => song.id === id ? { ...updatedSong, id } : song));
      toast.success('Song updated successfully');
    } catch (error) {
      console.error('Error updating song:', error);
      toast.error('Failed to update song. Please try again.');
      throw error;
    }
  };

  // Delete a song from Supabase
  const deleteSong = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('songs')
        .delete()
        .eq('id', id)
        .select(); // Add this to expose silent failures
      
      if (error) {
        throw error;
      }
  
      if (!data || data.length === 0) {
        console.warn('No row deleted. Possibly blocked by RLS or ID mismatch.');
      }
  
      setSongs(songs.filter(song => song.id !== id));
      toast.success('Song deleted successfully');
    } catch (error) {
      console.error('Error deleting song:', error);
      toast.error('Failed to delete song. Please try again.');
      throw error;
    }
  };
  

  // Apply filters
  const filteredSongs = songs.filter(song => {
    if (filter.artist && !song.artist.toLowerCase().includes(filter.artist.toLowerCase())) return false;
    if (filter.album && !song.album.toLowerCase().includes(filter.album.toLowerCase())) return false;
    if (filter.genre && !song.genre.toLowerCase().includes(filter.genre.toLowerCase())) return false;
    return true;
  });

  return (
    <SongContext.Provider value={{ songs, loading, addSong, updateSong, deleteSong, filteredSongs, setFilter }}>
      {children}
    </SongContext.Provider>
  );
};

export const useSongContext = () => {
  const context = useContext(SongContext);
  if (context === undefined) {
    throw new Error('useSongContext must be used within a SongProvider');
  }
  return context;
};
