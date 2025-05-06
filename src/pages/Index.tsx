
import React from "react";
import MusicLibrary from "@/components/MusicLibrary";
import { SongProvider } from "@/context/SongContext";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:from-slate-900 dark:to-indigo-950 px-4 py-8">
      <div className="container mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600 inline-block text-transparent bg-clip-text mb-2">
            Music Library
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome {user?.email} to your music collection
          </p>
        </header>
        
        <SongProvider>
          <MusicLibrary />
        </SongProvider>
      </div>
    </div>
  );
};

export default Index;
