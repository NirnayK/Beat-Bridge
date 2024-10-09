"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormProvider, useForm } from "react-hook-form";
import { Image as ImageIcon, Music, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define Zod Schema
const singleFormSchema = z.object({
  name: z.string().min(1, { message: "Song name is required." }),
  songFile: z.any().refine((file) => file instanceof File, "Song file is required"),
  image: z.any().optional(),
  artist: z.string().optional(),
  album: z.string().optional(),
  yearOfRelease: z.string().optional(),
});

type SingleFormValues = z.infer<typeof singleFormSchema>;

// Encapsulated Form Input Component
const FileInput = ({
  label,
  name,
  accept,
  description,
  Icon,
}: {
  label: string;
  name: keyof SingleFormValues;
  accept: string;
  description: string;
  Icon: React.ComponentType<{ className: string }>;
}) => {
  return (
    <FormField
      name={name}
      render={({ field: { onChange, ...rest } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor={`dropzone-${name}`}
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Icon className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
                </div>
                <Input
                  id={`dropzone-${name}`}
                  type="file"
                  className="hidden"
                  accept={accept}
                  onChange={(e) => onChange(e.target.files?.[0])}
                  {...rest}
                />
              </label>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default function SingleForm() {
  const [isEncoding, setIsEncoding] = useState(false);

  const form = useForm<SingleFormValues>({
    resolver: zodResolver(singleFormSchema),
  });

  function onSubmit(data: SingleFormValues) {
    setIsEncoding(true);
    // Simulate encoding process
    setTimeout(() => {
      setIsEncoding(false);
      toast({
        title: "Encoding Complete",
        description: "Your music file has been successfully encoded.",
      });
    }, 2000);

    console.log(data);
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-2">
        {/* Song Name Input */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Song Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the song name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* File Inputs */}
        <div className="grid gap-6 md:grid-cols-2">
          <FileInput
            label="Song File"
            name="songFile"
            accept=".mp3,.wav,.flac"
            description="MP3, WAV, or FLAC"
            Icon={Music}
          />
          <FileInput
            label="Cover Image"
            name="image"
            accept="image/*"
            description="PNG or JPG (MAX. 2MB)"
            Icon={ImageIcon}
          />
        </div>

        {/* Artist, Album, Year Inputs */}
        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="artist"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Artist</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the artist name" {...field} />
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
                  <Input placeholder="Enter the album name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="yearOfRelease"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year of Release</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="YYYY" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isEncoding} className="w-full">
          {isEncoding ? (
            <>
              <Upload className="mr-2 h-4 w-4 animate-spin" />
              Encoding...
            </>
          ) : (
            <>
              <Music className="mr-2 h-4 w-4" />
              Encode Music
            </>
          )}
        </Button>
      </form>
    </FormProvider>
  );
}
