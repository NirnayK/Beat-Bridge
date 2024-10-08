"use client"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const youtubeFormSchema = z.object({
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

type YoutubeFormValues = z.infer<typeof youtubeFormSchema>;

export function YoutubeForm() {
  const [isEditing, setIsEditing] = useState(false); // Manage edit state

  const form = useForm<YoutubeFormValues>({
    resolver: zodResolver(youtubeFormSchema),
    mode: "onChange",
  });

  function onSubmit(data: YoutubeFormValues) {
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
                <Input placeholder="Enter your Youtube User ID" {...field} readOnly={!isEditing} />
              </FormControl>
              <FormDescription>
                This is your User ID which you can get from the Youtube Youtube Section
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
                <Input placeholder="Enter your Youtube Client ID" {...field} readOnly={!isEditing} />
              </FormControl>
              <FormDescription>
                This is your Client ID which you can get from the Youtube Developers
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
                <PasswordInput field={field} placeholder="Enter your Youtube Client Secret" readOnly={!isEditing} />
              </FormControl>
              <FormDescription>
                This is your Client Secret which you can get from the Youtube Developers
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
