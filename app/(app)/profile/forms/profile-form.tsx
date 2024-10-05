"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input"; // Assuming PasswordInput is already created

// Zod validation schema for sign-up or sign-in
const profileFormSchema = z.object({
  email: z
    .string({
      required_error: "Email is required.",
    })
    .email({
      message: "Please enter a valid email.",
    }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }) // Minimum length
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." }) // Lowercase
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." }) // Uppercase
    .regex(/\d/, { message: "Password must contain at least one number." }) // Digit
    .regex(/[\W_]/, { message: "Password must contain at least one special character." }) // Special character
    .refine((password) => password.length >= 8, {
      message: "Password must be at least 8 characters.",
    }),
  confirmPassword: z
    .string()
    .min(6, {
      message: "Confirm password must be at least 6 characters.",
    })
    .optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"], // path to confirm password field
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm({ type }: { type: "sign-in" | "sign-up" }) {

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
  });

  function onSubmit(data: ProfileFormValues) {
    if (type === "sign-up") {
      // Handle sign-up logic here
      toast({
        title: "Sign Up Success",
        description: `Welcome ${data.email}! Your account has been created.`,
      });
    } else if (type === "sign-in") {
      // Handle sign-in logic here
      toast({
        title: "Sign In Success",
        description: `Welcome back, ${data.email}!`,
      });
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormDescription>
                Please enter your email address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput field={field} placeholder="Enter your password" />
              </FormControl>
              <FormDescription>
                {type === "sign-up" ? "Create a secure password." : "Enter your password."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password Field (only for sign-up) */}
        {type === "sign-up" && (
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput field={field} placeholder="Confirm your password" />
                </FormControl>
                <FormDescription>
                  Please confirm your password.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Sign In / Sign Up Button */}
        <Button type="submit">
          {type === "sign-up" ? "Sign Up" : "Sign In"}
        </Button>
      </form>
    </FormProvider>
  );
}
