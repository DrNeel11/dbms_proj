
import React, { useState, useEffect } from "react";
import { usePlaylistContext, PlaylistWithSongs } from "@/context/PlaylistContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ListMusic, Plus, Trash } from "lucide-react";
import PlaylistSongList from "./PlaylistSongList";

const PlaylistList = () => {
  const { playlists, loading, deletePlaylist, getPlaylistSongs } = usePlaylistContext();
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [playlistWithSongs, setPlaylistWithSongs] = useState<PlaylistWithSongs | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (selectedPlaylist && isDialogOpen) {
      const loadPlaylistSongs = async () => {
        const songs = await getPlaylistSongs(selectedPlaylist);
        const playlist = playlists.find(p => p.id === selectedPlaylist);
        if (playlist) {
          setPlaylistWithSongs({
            ...playlist,
            songs
          });
        }
      };
      
      loadPlaylistSongs();
    } else {
      setPlaylistWithSongs(null);
    }
  }, [selectedPlaylist, isDialogOpen, getPlaylistSongs, playlists]);

  const handleViewPlaylist = (playlistId: string) => {
    setSelectedPlaylist(playlistId);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedPlaylist(null);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse">Loading playlists...</div>
      </div>
    );
  }

  if (playlists.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No playlists found. Create a playlist using the form.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {playlists.map((playlist) => (
        <Card key={playlist.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle>{playlist.name}</CardTitle>
            <CardDescription>
              {playlist.description || 'No description'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center text-sm text-gray-500">
              <ListMusic className="h-4 w-4 mr-1" />
              <span>Created on {new Date(playlist.created_at).toLocaleDateString()}</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleViewPlaylist(playlist.id)}
            >
              View Songs
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-500 hover:text-red-700"
              onClick={() => deletePlaylist(playlist.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{playlistWithSongs?.name}</DialogTitle>
            <DialogDescription>
              {playlistWithSongs?.description || 'No description'}
            </DialogDescription>
          </DialogHeader>
          {playlistWithSongs && (
            <PlaylistSongList 
              playlistId={playlistWithSongs.id} 
              songs={playlistWithSongs.songs} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlaylistList;
