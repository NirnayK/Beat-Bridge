import { Payment, columns } from "./columns"

import { DataTable } from "@/components/ui/data-table"
import TabsLayout from "@/components/tab-layout"

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
  ]
}

export default async function DemoPage() {
  const data = await getData()

  const TabItems = [
    {
      value: "all",
      label: "All",
      content: <DataTable columns={columns} data={data} />,
    },
    {
      value: "spotify",
      label: "Spotify",
      content: <DataTable columns={columns} data={data} />,
    },
    {
      value: "youtube",
      label: "Youtube",
      content: <DataTable columns={columns} data={data} />,
    },
  ]


  return <TabsLayout tabs={TabItems} defaultTab="spotify" />;

}
