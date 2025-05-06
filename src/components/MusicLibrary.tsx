
import React, { useState } from "react";
import { useSongContext, Song } from "@/context/SongContext";
import { PlaylistProvider } from "@/context/PlaylistContext";
import SongList from "./SongList";
import SongForm from "./SongForm";
import FilterForm from "./FilterForm";
import PlaylistForm from "./PlaylistForm";
import PlaylistList from "./PlaylistList";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Music, ListPlus } from "lucide-react";

const MusicLibrary = () => {
  const { filteredSongs } = useSongContext();
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [activeTab, setActiveTab] = useState("songs");
  const [showSongForm, setShowSongForm] = useState(false);
  const [showPlaylistForm, setShowPlaylistForm] = useState(false);

  const handleAddNewSong = () => {
    setEditingSong(null);
    setShowSongForm(true);
    setShowPlaylistForm(false);
  };

  const handleCreatePlaylist = () => {
    setShowPlaylistForm(true);
    setShowSongForm(false);
  };

  const handleSongSave = () => {
    setEditingSong(null);
    setShowSongForm(false);
    setActiveTab("songs");
  };

  const handlePlaylistCreated = () => {
    setShowPlaylistForm(false);
    setActiveTab("playlists");
  };

  return (
    <PlaylistProvider>
      <div className="grid gap-6">
        <Card className="border border-purple-100 dark:border-purple-900 shadow-md dark:bg-slate-800">
          <CardContent className="pt-6">
            <FilterForm />
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mb-4">
          <div className="w-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-between items-center">
                <TabsList className="bg-purple-100 dark:bg-slate-800">
                  <TabsTrigger 
                    value="songs" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
                    Songs ({filteredSongs.length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="playlists" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
                    Playlists
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex gap-2">
                  {activeTab === "songs" && (
                    <Button 
                      onClick={handleAddNewSong}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Add New Song
                    </Button>
                  )}
                  {activeTab === "playlists" && (
                    <Button 
                      onClick={handleCreatePlaylist}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      <ListPlus className="mr-1 h-4 w-4" />
                      New Playlist
                    </Button>
                  )}
                </div>
              </div>

              <TabsContent value="songs" className="mt-4">
                {showSongForm ? (
                  <Card className="border border-purple-100 dark:border-purple-900 bg-white dark:bg-slate-800 shadow-md">
                    <CardContent className="pt-6">
                      <SongForm 
                        song={editingSong} 
                        onSave={handleSongSave}
                        onCancel={() => {
                          setEditingSong(null);
                          setShowSongForm(false);
                        }}
                      />
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border border-purple-100 dark:border-purple-900 bg-white dark:bg-slate-800 shadow-md">
                    <CardContent className="pt-6">
                      <SongList onEdit={(song) => {
                        setEditingSong(song);
                        setShowSongForm(true);
                      }} />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="playlists" className="mt-4">
                {showPlaylistForm ? (
                  <Card className="border border-purple-100 dark:border-purple-900 bg-white dark:bg-slate-800 shadow-md">
                    <CardContent className="pt-6">
                      <PlaylistForm 
                        onSuccess={handlePlaylistCreated}
                        onCancel={() => setShowPlaylistForm(false)} 
                      />
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border border-purple-100 dark:border-purple-900 bg-white dark:bg-slate-800 shadow-md">
                    <CardContent className="pt-6">
                      <PlaylistList />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PlaylistProvider>
  );
};

export default MusicLibrary;
