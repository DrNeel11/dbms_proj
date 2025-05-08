import React, { useState, useRef } from "react";
import { useSongContext, Song } from "@/context/SongContext";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash, Star, Play, Pause } from "lucide-react";
import AddToPlaylist from "./AddToPlaylist";
import { toast } from "sonner";

// Add type declarations for the electron window object
declare global {
  interface Window {
    electron?: {
      saveAudioFile: (file: File, filename: string) => Promise<void>;
      getAudioUrl: (path: string) => string;
    };
  }
}

interface SongListProps {
  onEdit: (song: Song) => void;
}

const SongList = ({ onEdit }: SongListProps) => {
  const { filteredSongs, deleteSong, loading, updateSong } = useSongContext();
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleRatingChange = async (song: Song, rating: number) => {
    try {
      await updateSong(song.id, { ...song, rating });
    } catch (error) {
      console.error("Error updating song rating:", error);
    }
  };

  const handlePlayPause = (song: Song) => {
    if (currentlyPlaying === song.id) {
      // Pause current song
      if (audioRef.current) {
        audioRef.current.pause();
        setCurrentlyPlaying(null);
      }
    } else {
      // Stop any currently playing song
      if (audioRef.current) {
        audioRef.current.pause();
      }

      // Play new song
      if (song.audio_path) {
        if (audioRef.current) {
          audioRef.current.src = song.audio_path;
          audioRef.current.play()
            .then(() => {
              setCurrentlyPlaying(song.id);
            })
            .catch((error) => {
              console.error('Error playing audio:', error);
              toast.error('Failed to play audio file');
            });
        }
      } else {
        toast.error('No audio file available for this song');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse">Loading songs...</div>
      </div>
    );
  }

  if (filteredSongs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No songs found. Add some songs or adjust your filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
      <audio ref={audioRef} />
      <Table>
        <TableHeader className="bg-slate-100 dark:bg-slate-800">
          <TableRow>
            <TableHead>Play</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Album</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSongs.map((song) => (
            <TableRow key={song.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePlayPause(song)}
                  className="p-1"
                >
                  {currentlyPlaying === song.id ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </TableCell>
              <TableCell className="font-medium">{song.title}</TableCell>
              <TableCell>{song.artist}</TableCell>
              <TableCell>{song.album}</TableCell>
              <TableCell>{song.genre}</TableCell>
              <TableCell>{song.duration}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="ghost"
                      size="sm"
                      className={`p-1 ${
                        song.rating && star <= song.rating
                          ? "text-yellow-500"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                      onClick={() => handleRatingChange(song, star)}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(song)}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AddToPlaylist songId={song.id} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    try {
                      await deleteSong(song.id);
                    } catch (error) {
                      // Error is already handled in the context
                    }
                  }}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SongList;
