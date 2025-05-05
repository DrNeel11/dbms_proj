
import React from "react";
import { usePlaylistContext } from "@/context/PlaylistContext";
import { Song } from "@/context/SongContext";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash } from "lucide-react";

interface PlaylistSongListProps {
  playlistId: string;
  songs: Song[];
}

const PlaylistSongList = ({ playlistId, songs }: PlaylistSongListProps) => {
  const { removeSongFromPlaylist } = usePlaylistContext();

  if (songs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No songs in this playlist. Add some songs from the Songs tab.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Album</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {songs.map((song) => (
            <TableRow key={song.id}>
              <TableCell className="font-medium">{song.title}</TableCell>
              <TableCell>{song.artist}</TableCell>
              <TableCell>{song.album}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSongFromPlaylist(playlistId, song.id)}
                  className="text-red-500 hover:text-red-700"
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
