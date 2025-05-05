
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePlaylistContext } from "@/context/PlaylistContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(1, "Playlist name is required"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface PlaylistFormProps {
  onSuccess?: (playlistId: string) => void;
}

const PlaylistForm = ({ onSuccess }: PlaylistFormProps) => {
  const { createPlaylist } = usePlaylistContext();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const playlistId = await createPlaylist(data.name, data.description);
      
      if (playlistId && onSuccess) {
        onSuccess(playlistId);
      }
      
      form.reset({
        name: "",
        description: "",
      });
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My Playlist" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your playlist" 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">Create Playlist</Button>
        </div>
      </form>
    </Form>
  );
};

export default PlaylistForm;
