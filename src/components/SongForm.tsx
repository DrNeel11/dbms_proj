
import React from "react";
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
});

type FormData = z.infer<typeof formSchema>;

interface SongFormProps {
  song: Song | null;
  onSave: () => void;
}

const SongForm = ({ song, onSave }: SongFormProps) => {
  const { addSong, updateSong } = useSongContext();
  const isEditing = !!song;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: song?.title || "",
      artist: song?.artist || "",
      album: song?.album || "",
      genre: song?.genre || "",
      duration: song?.duration || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing && song) {
        await updateSong(song.id, {
          title: data.title,
          artist: data.artist,
          album: data.album,
          genre: data.genre,
          duration: data.duration
        });
        toast.success("Song updated successfully");
      } else {
        await addSong({
          title: data.title,
          artist: data.artist,
          album: data.album,
          genre: data.genre,
          duration: data.duration
        });
        toast.success("Song added successfully");
      }
      
      form.reset({
        title: "",
        artist: "",
        album: "",
        genre: "",
        duration: "",
      });
      
      onSave();
    } catch (error) {
      console.error("Error saving song:", error);
      toast.error("Failed to save song. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Song title" {...field} />
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
                <Input placeholder="Artist name" {...field} />
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
                <Input placeholder="Album name" {...field} />
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
                <Input placeholder="Genre" {...field} />
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
                <Input placeholder="3:45" {...field} />
              </FormControl>
              <FormDescription>
                Format: minutes:seconds (e.g., 3:45)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">
            {isEditing ? "Update Song" : "Add Song"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SongForm;
