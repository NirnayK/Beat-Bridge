"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormProvider, useForm } from "react-hook-form";
import { Image as ImageIcon, Music, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export default function SingleForm() {
  const [isEncoding, setIsEncoding] = useState(false);
  const [songFile, setSongFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<SingleFormValues>({
    resolver: zodResolver(singleFormSchema),
  });

  // Handle song file upload
  const handleSongFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSongFile(file); // Save song file details
      form.setValue("songFile", file); // Set the file in the form
    }
  };

  // Handle image file upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Preview the image
      form.setValue("image", file); // Set the image in the form
    }
  };

  // Remove the uploaded image
  const handleRemoveImage = () => {
    setImagePreview(null);
    form.setValue("image", null); // Reset the image in the form
  };

  // Form submission handler
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
                <Input placeholder="Enter the song name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* File Inputs with 1x4 Grid Layout */}
        <div className="grid grid-cols-4 gap-6 md:grid-cols-4">
          {/* Song File Card (Placeholder or Uploaded File) */}
          <FormField
            control={form.control}
            name="songFile"
            render={() => (
              <FormItem>
                <FormLabel>Song File</FormLabel>
                <FormControl>
                  <div className="flex items-center justify-center w-full">
                    <Label
                      htmlFor="dropzone-song"
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Music className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          Upload Song
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          MP3, WAV, or FLAC
                        </p>
                      </div>
                      <Input
                        id="dropzone-song"
                        type="file"
                        className="hidden"
                        accept=".mp3,.wav,.flac"
                        onChange={handleSongFileChange}
                      />
                    </Label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>Song Preview
            <div>
              {!songFile ? (
                <div className="relative mt-2 p-2 border rounded-md bg-gray-200 dark:bg-gray-900 h-48 w-full flex flex-col items-center justify-center">
                  <Music className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    You can see the uploaded file here
                  </p>
                </div>
              ) : (
                <div>
                  <div className="relative mt-2 p-2 border rounded-md bg-gray-300 dark:bg-gray-800 h-48 w-full flex flex-col items-center justify-center">
                    <p className="text-sm font-medium truncate">{songFile?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Size: {(songFile?.size ?? 0 / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <X
                      className="absolute top-[4px] right-[4px] w-6 h-6 cursor-pointer text-white bg-gray-800 rounded-full p-1 hover:bg-gray-700"
                      onClick={() => setSongFile(null)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>



          {/* Image Upload Card (Placeholder or Uploaded Image) */}
          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel>Cover Image</FormLabel>
                <FormControl>
                  <div className="flex items-center justify-center w-full">
                    <Label
                      htmlFor="dropzone-image"
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          Upload Image
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG or JPG (MAX. 2MB)
                        </p>
                      </div>
                      <Input
                        id="dropzone-image"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            Image Preview
            {!imagePreview ? (
              <div className="relative mt-2 p-2 border rounded-md bg-gray-200 dark:bg-gray-900 h-48 w-full flex flex-col items-center justify-center">
                <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  You can see the uploaded image here
                </p>
              </div>
            ) : (
              <div className="relative mt-2 border rounded-md h-48 w-full">
                <Image
                  src={imagePreview}
                  alt="Image Preview"
                  className="rounded-md object-cover w-full h-full"
                  fill={true}
                />
                <X
                  className="absolute top-[4px] right-[4px] w-6 h-6 cursor-pointer text-white bg-gray-800 rounded-full p-1 hover:bg-gray-700"
                  onClick={handleRemoveImage}
                />
              </div>
            )}
          </div>
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
    </FormProvider >
  );
}
