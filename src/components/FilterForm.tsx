
import React from "react";
import { useForm } from "react-hook-form";
import { useSongContext } from "@/context/SongContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FilterFormData {
  artist: string;
  album: string;
  genre: string;
}

const FilterForm = () => {
  const { setFilter } = useSongContext();

  const form = useForm<FilterFormData>({
    defaultValues: {
      artist: "",
      album: "",
      genre: "",
    },
  });

  const onSubmit = (data: FilterFormData) => {
    const filter: { artist?: string; album?: string; genre?: string } = {};
    
    if (data.artist.trim()) filter.artist = data.artist.trim();
    if (data.album.trim()) filter.album = data.album.trim();
    if (data.genre.trim()) filter.genre = data.genre.trim();
    
    setFilter(filter);
  };

  const resetFilters = () => {
    form.reset({
      artist: "",
      album: "",
      genre: "",
    });
    setFilter({});
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Filter Songs</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 sm:grid-cols-3"
        >
          <FormField
            control={form.control}
            name="artist"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Artist</FormLabel>
                <FormControl>
                  <Input placeholder="Filter by artist" {...field} />
                </FormControl>
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
                  <Input placeholder="Filter by album" {...field} />
                </FormControl>
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
                  <Input placeholder="Filter by genre" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="col-span-full flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={resetFilters}
            >
              Reset
            </Button>
            <Button type="submit">Apply Filters</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FilterForm;
