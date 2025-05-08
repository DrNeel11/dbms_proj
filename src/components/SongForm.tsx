import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSongContext, Song } from "@/context/SongContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  artist: z.string().min(1, "Artist is required"),
  album: z.string().min(1, "Album is required"),
  genre: z.string().min(1, "Genre is required"),
  duration: z.string().regex(/^\d+:\d{2}$/, "Format must be m:ss or mm:ss"),
  rating: z.number().min(0).max(5).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface SongFormProps {
  song: Song | null;
  onSave: () => void;
  onCancel: () => void;
}

const SongForm = ({ song, onSave, onCancel }: SongFormProps) => {
  const { addSong, updateSong } = useSongContext();
  const isEditing = !!song;
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: song?.title || "",
      artist: song?.artist || "",
      album: song?.album || "",
      genre: song?.genre || "",
      duration: song?.duration || "",
      rating: song?.rating || 0,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        setAudioFile(file);
      } else {
        toast.error('Please select an audio file');
      }
    }
  };

  const uploadAudioFile = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const timestamp = new Date().getTime();
      const filename = `${timestamp}_${file.name}`;
      const filePath = `audio/${filename}`;

      const { error: uploadError } = await supabase.storage
        .from('songs')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('songs')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading audio file:', error);
      toast.error('Failed to upload audio file');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      let audioPath = song?.audio_path;

      if (audioFile) {
        const uploadedUrl = await uploadAudioFile(audioFile);
        if (!uploadedUrl) {
          toast.error('Failed to upload audio file');
          return;
        }
        audioPath = uploadedUrl;
      }

      if (isEditing && song) {
        await updateSong(song.id, {
          ...data,
          audio_path: audioPath,
        });
        toast.success("Song updated successfully");
      } else {
        await addSong({
          ...data,
          audio_path: audioPath,
        });
        toast.success("Song added successfully");
      }
      
      form.reset({
        title: "",
        artist: "",
        album: "",
        genre: "",
        duration: "",
        rating: 0,
      });
      setAudioFile(null);
      
      onSave();
    } catch (error) {
      console.error("Error saving song:", error);
      toast.error("Failed to save song. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 p-4 mb-4 rounded-md">
          <h2 className="text-xl font-semibold mb-2 text-purple-800 dark:text-purple-300">
            {isEditing ? "Edit Song" : "Add New Song"}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {isEditing ? "Update the song details below" : "Enter the details of your new song"}
          </p>
        </div>
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Song title" {...field} className="border-purple-200 focus:border-purple-400 dark:border-purple-800" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="artist"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Artist</FormLabel>
              <FormControl>
                <Input placeholder="Artist name" {...field} className="border-purple-200 focus:border-purple-400 dark:border-purple-800" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="album"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Album</FormLabel>
              <FormControl>
                <Input placeholder="Album name" {...field} className="border-purple-200 focus:border-purple-400 dark:border-purple-800" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="genre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genre</FormLabel>
              <FormControl>
                <Input placeholder="Genre" {...field} className="border-purple-200 focus:border-purple-400 dark:border-purple-800" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <Input placeholder="3:45" {...field} className="border-purple-200 focus:border-purple-400 dark:border-purple-800" />
              </FormControl>
              <FormDescription>
                Format: minutes:seconds (e.g., 3:45)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Audio File</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="border-purple-200 focus:border-purple-400 dark:border-purple-800"
              disabled={uploading}
            />
          </FormControl>
          <FormDescription>
            {uploading ? 'Uploading...' : audioFile ? `Selected: ${audioFile.name}` : 'Select an audio file'}
          </FormDescription>
        </FormItem>

        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel} 
            className="border-purple-200 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-900"
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            disabled={uploading}
          >
            {isEditing ? "Update Song" : "Add Song"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SongForm;
