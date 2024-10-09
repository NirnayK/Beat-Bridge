import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

import { TabItem } from "@/types/props";

interface TabsLayoutProps {
  tabs: TabItem[];
  defaultTab: string;
}

export default function TabsLayout({ tabs, defaultTab }: TabsLayoutProps) {
  return (
    <div className="h-full px-4 lg:px-8">
      <Tabs defaultValue={defaultTab} className="h-full space-y-6">
        <div className="space-between flex items-center">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="relative">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="border-none p-0 outline-none">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
