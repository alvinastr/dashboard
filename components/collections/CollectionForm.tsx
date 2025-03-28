"use client";

import { Separator } from "../ui/separator";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "../ui/textarea";
import ImageUpload from "../custom ui/ImageUpload";
// Replace next/router with next/navigation
import { useRouter } from "next/navigation";
import { useState } from "react";
import { set } from "mongoose";
import toast from "react-hot-toast";

const formSchema = z.object({
  title: z.string().min(2).max(20),
  description: z.string().min(2).max(500).trim(),
  image: z.string(),
});

const CollectionForm = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
          title: "",
          description: "",
          image: "",
        },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        console.log("Submitting values:", values); // Debugging: Log form values
        setLoading(true);
        const res = await fetch("/api/collections", {
            method: "POST",
            headers: { "Content-Type": "application/json" }, // Ensure headers are set
            body: JSON.stringify(values),
        });
        if (res.ok) {
            setLoading(false);
            toast.success("Collection created successfully");
            router.push("/collections");
        } else {
            const error = await res.text(); // Log server error message
            console.error("Error response:", error);
            toast.error(`Failed to create collection: ${error}`);
        }
    } catch (err) {
        console.log("[collections_POST]", err);
        toast.error("Failed to create collection");
    }
  };

  return (
    <div className="p-10">
      <p className="text-heading2-bold">Create Collection</p>
      <Separator className="w-full bg-grey-1 mt-4 mb-7" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description" rows={5} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    onChange={(url) => {
                        console.log("Image field updated with URL:", url); // Debugging: Log image field update
                        field.onChange(url); // Update the form field
                    }}
                    onRemove={() => {
                        console.log("Image field cleared"); // Debugging: Log image field cleared
                        field.onChange(""); // Clear the form field
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-10">
            <Button type="submit" className="bg-blue-1 text-white">Submit</Button>
            <Button type="button" onClick={() => router.push("/collections")} className="bg-blue-1 text-white">Discard</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CollectionForm;
