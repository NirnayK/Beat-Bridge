"use client"

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";

const spotifyFormSchema = z.object({
  user_id: z
    .string()
    .min(1, {
      message: "User ID is required.",
    }),
  client_id: z
    .string()
    .min(1, {
      message: "Client ID is required.",
    })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "Client ID must only contain alphanumeric characters.",
    }),
  client_secret: z
    .string()
    .min(1, {
      message: "Client Secret is required.",
    }),
});

type SpotifyFormValues = z.infer<typeof spotifyFormSchema>;

// Default values (can be fetched from a database or API)
// const defaultValues: SpotifyFormValues = {
//   user_id: "987ytghji87ytnji87",
//   client_id: "2345tgvcdertyujn",
//   client_secret: "vgy78ui876gthu87",
// };

export function SpotifyForm() {
  const [isEditing, setIsEditing] = useState(false); // Manage edit state

  const form = useForm<SpotifyFormValues>({
    resolver: zodResolver(spotifyFormSchema),
    // defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: SpotifyFormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    setIsEditing(false);
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="user_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter your Spotify User ID" {...field} readOnly={!isEditing} />
              </FormControl>
              <FormDescription>
                This is your User ID which you can get from the Spotify Spotify Section
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="client_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter your Spotify Client ID" {...field} readOnly={!isEditing} />
              </FormControl>
              <FormDescription>
                This is your Client ID which you can get from the Spotify Developers
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="client_secret"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Secret</FormLabel>
              <FormControl>
                <PasswordInput field={field} placeholder="Enter your Spotify Client Secret" readOnly={!isEditing} />
              </FormControl>
              <FormDescription>
                This is your Client Secret which you can get from the Spotify Developers
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Toggle between Edit and View modes */}
        {isEditing ? (
          <div className="flex space-x-4">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button type="button" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </form>
    </FormProvider>
  );
}
