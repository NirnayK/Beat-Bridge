import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import MultiForm from "./multi-form";
import SingleForm from "./single-form";

export default function EncodeIt() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6">Encode Your Music</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Enhance your music files with rich metadata and custom images. Make your
        music collection truly yours with our powerful encoding tool.
      </p>
      <div className="bg-card rounded-lg shadow-lg p-6">
        <Tabs defaultValue="single-file">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single-file">Single File</TabsTrigger>
            <TabsTrigger value="multi-file">Multi File</TabsTrigger>
          </TabsList>
          <TabsContent value="single-file">
            <SingleForm />
          </TabsContent>
          <TabsContent value="multi-file">
            <MultiForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
