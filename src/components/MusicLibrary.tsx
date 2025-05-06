
import React, { useState } from "react";
import { useSongContext, Song } from "@/context/SongContext";
import { PlaylistProvider } from "@/context/PlaylistContext";
import { useAuth } from "@/context/AuthContext";
import SongList from "./SongList";
import SongForm from "./SongForm";
import FilterForm from "./FilterForm";
import PlaylistForm from "./PlaylistForm";
import PlaylistList from "./PlaylistList";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Music, ListPlus, LogOut, User } from "lucide-react";

const MusicLibrary = () => {
  const { filteredSongs } = useSongContext();
  const { user, userProfile, signOut } = useAuth();
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
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <User className="h-5 w-5 mr-2 text-purple-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {userProfile?.display_name || user?.email}
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={signOut}
            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-4 w-4 mr-1" /> Sign Out
          </Button>
        </div>

        <Card className="border border-purple-100 dark:border-purple-900 shadow-md dark:bg-slate-800">
          <CardContent className="pt-6">
            <FilterForm />
          </CardContent>
        </Card>

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

            <div className="mt-4">
              <TabsContent value="songs">
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
              
              <TabsContent value="playlists">
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
            </div>
          </Tabs>
        </div>
      </div>
    </PlaylistProvider>
  );
};

export default MusicLibrary;
