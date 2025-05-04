
import React, { useState } from "react";
import { useSongContext, Song } from "@/context/SongContext";
import SongList from "./SongList";
import SongForm from "./SongForm";
import FilterForm from "./FilterForm";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MusicLibrary = () => {
  const { filteredSongs } = useSongContext();
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent className="pt-6">
          <FilterForm />
        </CardContent>
      </Card>

      <Tabs defaultValue="songs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="songs">Songs ({filteredSongs.length})</TabsTrigger>
          <TabsTrigger value="add">
            {editingSong ? 'Edit Song' : 'Add New Song'}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="songs">
          <Card>
            <CardContent className="pt-6">
              <SongList onEdit={setEditingSong} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="add">
          <Card>
            <CardContent className="pt-6">
              <SongForm 
                song={editingSong} 
                onSave={() => setEditingSong(null)} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MusicLibrary;
