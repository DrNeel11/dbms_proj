
import React from "react";
import { usePlaylistContext } from "@/context/PlaylistContext";
import { Song, useSongContext } from "@/context/SongContext";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash, Star, StarOff } from "lucide-react";

interface PlaylistSongListProps {
  playlistId: string;
  songs: Song[];
}

const PlaylistSongList = ({ playlistId, songs }: PlaylistSongListProps) => {
  const { removeSongFromPlaylist } = usePlaylistContext();
  const { updateSong } = useSongContext();

  const handleRatingChange = async (song: Song, rating: number) => {
    try {
      await updateSong(song.id, { ...song, rating });
    } catch (error) {
      console.error("Error updating song rating:", error);
    }
  };

  if (songs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No songs in this playlist. Add some songs from the Songs tab.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
      <Table>
        <TableHeader className="bg-slate-100 dark:bg-slate-800">
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Album</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {songs.map((song) => (
            <TableRow key={song.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <TableCell className="font-medium">{song.title}</TableCell>
              <TableCell>{song.artist}</TableCell>
              <TableCell>{song.album}</TableCell>
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
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSongFromPlaylist(playlistId, song.id)}
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

export default PlaylistSongList;
