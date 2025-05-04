
import React from "react";
import MusicLibrary from "@/components/MusicLibrary";
import { SongProvider } from "@/context/SongContext";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Music Library</h1>
          <p className="text-gray-600">Manage your music collection</p>
        </header>
        
        <SongProvider>
          <MusicLibrary />
        </SongProvider>
      </div>
    </div>
  );
};

export default Index;
