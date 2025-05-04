
import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: string;
}

interface SongContextType {
  songs: Song[];
  addSong: (song: Omit<Song, 'id'>) => void;
  updateSong: (id: string, song: Omit<Song, 'id'>) => void;
  deleteSong: (id: string) => void;
  filteredSongs: Song[];
  setFilter: (filter: { artist?: string; album?: string; genre?: string }) => void;
}

const SongContext = createContext<SongContextType | undefined>(undefined);

// Initial mock data
const initialSongs: Song[] = [
  {
    id: '1',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    genre: 'Rock',
    duration: '5:55'
  },
  {
    id: '2',
    title: 'Billie Jean',
    artist: 'Michael Jackson',
    album: 'Thriller',
    genre: 'Pop',
    duration: '4:54'
  },
  {
    id: '3',
    title: 'Hotel California',
    artist: 'Eagles',
    album: 'Hotel California',
    genre: 'Rock',
    duration: '6:30'
  },
  {
    id: '4',
    title: 'Imagine',
    artist: 'John Lennon',
    album: 'Imagine',
    genre: 'Pop',
    duration: '3:04'
  }
];

export const SongProvider = ({ children }: { children: ReactNode }) => {
  const [songs, setSongs] = useState<Song[]>(initialSongs);
  const [filter, setFilter] = useState<{ artist?: string; album?: string; genre?: string }>({});

  // Generate a random ID for new songs
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addSong = (song: Omit<Song, 'id'>) => {
    const newSong = { ...song, id: generateId() };
    setSongs([...songs, newSong]);
  };

  const updateSong = (id: string, updatedSong: Omit<Song, 'id'>) => {
    setSongs(songs.map(song => song.id === id ? { ...updatedSong, id } : song));
  };

  const deleteSong = (id: string) => {
    setSongs(songs.filter(song => song.id !== id));
  };

  // Apply filters
  const filteredSongs = songs.filter(song => {
    if (filter.artist && !song.artist.toLowerCase().includes(filter.artist.toLowerCase())) return false;
    if (filter.album && !song.album.toLowerCase().includes(filter.album.toLowerCase())) return false;
    if (filter.genre && !song.genre.toLowerCase().includes(filter.genre.toLowerCase())) return false;
    return true;
  });

  return (
    <SongContext.Provider value={{ songs, addSong, updateSong, deleteSong, filteredSongs, setFilter }}>
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
