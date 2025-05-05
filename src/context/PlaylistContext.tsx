
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Song } from './SongContext';

export interface Playlist {
  id: string;
  name: string;
  description: string | null;
  user_id: string;
  created_at: string;
}

export interface PlaylistWithSongs extends Playlist {
  songs: Song[];
}

interface PlaylistContextType {
  playlists: Playlist[];
  loading: boolean;
  createPlaylist: (name: string, description?: string) => Promise<string | null>;
  updatePlaylist: (id: string, data: { name?: string; description?: string }) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  getPlaylistSongs: (playlistId: string) => Promise<Song[]>;
  addSongToPlaylist: (playlistId: string, songId: string) => Promise<void>;
  removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const PlaylistProvider = ({ children }: { children: ReactNode }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch playlists from Supabase
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        // Get the current user's session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // If no session, return empty array
          setPlaylists([]);
          return;
        }
        
        setLoading(true);
        const { data, error } = await supabase
          .from('playlists')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setPlaylists(data || []);
      } catch (error) {
        console.error('Error fetching playlists:', error);
        toast.error('Failed to load playlists. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  // Create a new playlist
  const createPlaylist = async (name: string, description?: string): Promise<string | null> => {
    try {
      // Get the current user's session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('You must be logged in to create a playlist');
        return null;
      }
      
      const { data, error } = await supabase
        .from('playlists')
        .insert([{ 
          name, 
          description: description || null,
          user_id: session.user.id
        }])
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        setPlaylists([data[0], ...playlists]);
        toast.success('Playlist created successfully');
        return data[0].id;
      }
      
      return null;
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast.error('Failed to create playlist. Please try again.');
      return null;
    }
  };

  // Update a playlist
  const updatePlaylist = async (id: string, data: { name?: string; description?: string }) => {
    try {
      const { error } = await supabase
        .from('playlists')
        .update(data)
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setPlaylists(playlists.map(playlist => 
        playlist.id === id ? { ...playlist, ...data } : playlist
      ));
      
      toast.success('Playlist updated successfully');
    } catch (error) {
      console.error('Error updating playlist:', error);
      toast.error('Failed to update playlist. Please try again.');
    }
  };

  // Delete a playlist
  const deletePlaylist = async (id: string) => {
    try {
      const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setPlaylists(playlists.filter(playlist => playlist.id !== id));
      toast.success('Playlist deleted successfully');
    } catch (error) {
      console.error('Error deleting playlist:', error);
      toast.error('Failed to delete playlist. Please try again.');
    }
  };

  // Get songs in a playlist
  const getPlaylistSongs = async (playlistId: string): Promise<Song[]> => {
    try {
      const { data, error } = await supabase
        .from('playlist_songs')
        .select('song_id, songs(*)')
        .eq('playlist_id', playlistId);
      
      if (error) {
        throw error;
      }
      
      return data?.map(item => item.songs as Song) || [];
    } catch (error) {
      console.error('Error fetching playlist songs:', error);
      toast.error('Failed to load playlist songs.');
      return [];
    }
  };

  // Add a song to a playlist
  const addSongToPlaylist = async (playlistId: string, songId: string) => {
    try {
      const { error } = await supabase
        .from('playlist_songs')
        .insert([{ 
          playlist_id: playlistId, 
          song_id: songId 
        }]);
      
      if (error) {
        // Check if it's a duplicate error
        if (error.code === '23505') {
          toast.error('This song is already in the playlist');
          return;
        }
        throw error;
      }
      
      toast.success('Song added to playlist');
    } catch (error) {
      console.error('Error adding song to playlist:', error);
      toast.error('Failed to add song to playlist. Please try again.');
    }
  };

  // Remove a song from a playlist
  const removeSongFromPlaylist = async (playlistId: string, songId: string) => {
    try {
      const { error } = await supabase
        .from('playlist_songs')
        .delete()
        .match({ 
          playlist_id: playlistId, 
          song_id: songId 
        });
      
      if (error) {
        throw error;
      }
      
      toast.success('Song removed from playlist');
    } catch (error) {
      console.error('Error removing song from playlist:', error);
      toast.error('Failed to remove song from playlist. Please try again.');
    }
  };

  return (
    <PlaylistContext.Provider value={{ 
      playlists, 
      loading, 
      createPlaylist, 
      updatePlaylist, 
      deletePlaylist, 
      getPlaylistSongs, 
      addSongToPlaylist, 
      removeSongFromPlaylist 
    }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylistContext = () => {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error('usePlaylistContext must be used within a PlaylistProvider');
  }
  return context;
};
