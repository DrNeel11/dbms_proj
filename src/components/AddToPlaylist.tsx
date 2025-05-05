
import React, { useState } from "react";
import { usePlaylistContext } from "@/context/PlaylistContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ListPlus } from "lucide-react";
import { toast } from "sonner";

interface AddToPlaylistProps {
  songId: string;
}

const AddToPlaylist = ({ songId }: AddToPlaylistProps) => {
  const { playlists, addSongToPlaylist } = usePlaylistContext();
  const [open, setOpen] = useState(false);

  const handleAddToPlaylist = async (playlistId: string) => {
    await addSongToPlaylist(playlistId, songId);
    setOpen(false);
  };

  if (playlists.length === 0) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => toast.info("Create a playlist first before adding songs")}
      >
        <ListPlus className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <ListPlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add to Playlist</DialogTitle>
          <DialogDescription>
            Select a playlist to add this song to
          </DialogDescription>
        </DialogHeader>
        <Command>
          <CommandInput placeholder="Search playlists..." />
          <CommandList>
            <CommandEmpty>No playlists found</CommandEmpty>
            <CommandGroup>
              {playlists.map((playlist) => (
                <CommandItem
                  key={playlist.id}
                  onSelect={() => handleAddToPlaylist(playlist.id)}
                >
                  {playlist.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default AddToPlaylist;
