
import React from "react";
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
import { Edit, Trash } from "lucide-react";
import AddToPlaylist from "./AddToPlaylist";

interface SongListProps {
  onEdit: (song: Song) => void;
}

const SongList = ({ onEdit }: SongListProps) => {
  const { filteredSongs, deleteSong, loading } = useSongContext();

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse">Loading songs...</div>
      </div>
    );
  }

  if (filteredSongs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No songs found. Add some songs or adjust your filters.
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
            <TableHead>Genre</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSongs.map((song) => (
            <TableRow key={song.id}>
              <TableCell className="font-medium">{song.title}</TableCell>
              <TableCell>{song.artist}</TableCell>
              <TableCell>{song.album}</TableCell>
              <TableCell>{song.genre}</TableCell>
              <TableCell>{song.duration}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(song)}
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

export default SongList;
