
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
        <Card>
          <CardContent className="pt-6">
            <FilterForm />
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="songs">Songs ({filteredSongs.length})</TabsTrigger>
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
            <TabsTrigger value="add">
              {activeTab === "playlists" ? "New Playlist" : (editingSong ? 'Edit Song' : 'Add New Song')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="songs">
            <Card>
              <CardContent className="pt-6">
                <SongList onEdit={(song) => {
                  setEditingSong(song);
                  setActiveTab("add");
                }} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="playlists">
            <Card>
              <CardContent className="pt-6">
                <PlaylistList />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="add">
            <Card>
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
