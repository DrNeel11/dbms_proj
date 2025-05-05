
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

const MusicLibrary = () => {
  const { filteredSongs } = useSongContext();
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [activeTab, setActiveTab] = useState("songs");

  return (
    <PlaylistProvider>
      <div className="grid gap-6">
        <Card className="border border-purple-100 dark:border-purple-900 shadow-md dark:bg-slate-800">
          <CardContent className="pt-6">
            <FilterForm />
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-purple-100 dark:bg-slate-800">
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
            <TabsTrigger 
              value="add" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
              {activeTab === "playlists" ? "New Playlist" : (editingSong ? 'Edit Song' : 'Add New Song')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="songs">
            <Card className="border border-purple-100 dark:border-purple-900 bg-white dark:bg-slate-800 shadow-md">
              <CardContent className="pt-6">
                <SongList onEdit={(song) => {
                  setEditingSong(song);
                  setActiveTab("add");
                }} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="playlists">
            <Card className="border border-purple-100 dark:border-purple-900 bg-white dark:bg-slate-800 shadow-md">
              <CardContent className="pt-6">
                <PlaylistList />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="add">
            <Card className="border border-purple-100 dark:border-purple-900 bg-white dark:bg-slate-800 shadow-md">
              <CardContent className="pt-6">
                {activeTab === "playlists" ? (
                  <PlaylistForm onSuccess={() => setActiveTab("playlists")} />
                ) : (
                  <SongForm 
                    song={editingSong} 
                    onSave={() => {
                      setEditingSong(null);
                      setActiveTab("songs");
                    }} 
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PlaylistProvider>
  );
};

export default MusicLibrary;
