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

// Zod Schema for validation
const multiFormSchema = z.object({
  songFiles: z
    .array(
      z.object({
        file: z.any().refine((file) => file instanceof File, "Invalid file."),
      })
    )
    .nonempty("At least one song file is required.")
    .max(5, "You can only upload up to 5 files."),
  image: z.any().optional(),
  artist: z.string().optional(),
  album: z.string().optional(),
  yearOfRelease: z.string().optional(),
});

type MultiFormValues = z.infer<typeof multiFormSchema>;

export default function MultiForm() {
  const [isEncoding, setIsEncoding] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<MultiFormValues>({
    resolver: zodResolver(multiFormSchema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(null);  // Reset preview first to force re-rendering
      setTimeout(() => {
        setImagePreview(URL.createObjectURL(file)); // Update preview
        form.setValue("image", file); // Update form value
      }, 0);

      // Clear the file input value to allow re-selection of the same image
      e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    form.setValue("image", null); // Clear the form image value
  };

  // Function to handle file selection and size validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);
    const totalUploadedSize = files.reduce((acc, file) => acc + file.size, 0) + totalSize;

    // Validate total size and number of files
    if (totalUploadedSize > 100 * 1024 * 1024) {
      toast({ title: "Error", description: "Total file size exceeds 100MB." });
      return;
    }
    if (files.length + selectedFiles.length > 5) {
      toast({ title: "Error", description: "You can upload a maximum of 5 files." });
      return;
    }

    setTotalSize(totalUploadedSize);
    setFiles([...files, ...selectedFiles]);
  };

  // Remove file from the list
  const removeFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  // Form submission handler
  function onSubmit(data: MultiFormValues) {
    if (files.length === 0) {
      toast({ title: "Error", description: "Please upload at least one song file." });
      return;
    }

    setIsEncoding(true);
    setTimeout(() => {
      setIsEncoding(false);
      toast({
        title: "Encoding Complete",
        description: "Your music files have been successfully encoded.",
      });
    }, 2000);

    console.log({ ...data, songFiles: files });
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-2">
        {/* File Upload Input */}
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <Label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-600 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Music className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  MP3, AAC, WAV, or FLAC (Max 100MB, 5 files)
                </p>
              </div>
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                multiple
                accept=".mp3,.aac,.wav,.flac,"
                onChange={handleFileChange}
              />
            </Label>
          </div>

          {/* Display the list of uploaded files in a grid */}
          <div className="space-y-3">
            <h4 className="font-semibold">
              Uploaded Files (
              <span className="text-sm font-medium">
                Total Size: {totalSize ? (totalSize / 1024 / 1024).toFixed(2) : '0.00'} MB
              </span>
              ):
            </h4>
            {files.length === 0 ? (
              <p className="text-sm text-muted-foreground">No files uploaded.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-between items-center border p-2 rounded-md relative"
                  >
                    <p className="text-sm truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <X
                      className="absolute top-2 right-2 w-5 h-5 cursor-pointer text-white bg-gray-800 rounded-full p-1 hover:bg-gray-700"
                      onClick={() => removeFile(index)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="grid gap-6 md:grid-cols-2">
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
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG or JPG
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

          {/* Display Image Preview */}
          {imagePreview && (
            <div className="space-y-2">
              <Label>Cover Image Preview</Label>
              <div className="relative flex items-center justify-center h-64 w-full border-2 border-dashed rounded-lg bg-gray-50 dark:bg-gray-700">
                <Image
                  src={imagePreview}
                  alt="Cover Preview"
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  layout="fill"
                />
                <X
                  className="absolute top-[4px] right-[4px] w-6 h-6 cursor-pointer text-white bg-gray-800 rounded-full p-1 hover:bg-gray-700"
                  onClick={handleRemoveImage}
                />
              </div>
            </div>
          )}
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
