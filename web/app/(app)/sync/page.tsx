import { Playlist } from "@/types/props";
import PlaylistDownloadPage from "./components/playlists";
import TabsLayout from "@/components/tab-layout";
import pic from "@/public/01.webp";

const playlists: Playlist[] = [
  { id: 1, name: "React Rendezvous", songs: 25, thumbnail: pic },
  { id: 2, name: "Async Awakenings", songs: 40, thumbnail: pic },
  { id: 3, name: "The Art of Reusability", songs: 30, thumbnail: pic },
  { id: 4, name: "Stateful Symphony", songs: 50, thumbnail: pic },
  { id: 5, name: "Thinking Components", songs: 35, thumbnail: pic },
  { id: 6, name: "Functional Fury", songs: 20, thumbnail: pic },
];

const TabItems = [
  {
    value: "all",
    label: "All",
    content: (<div className="px-3"><PlaylistDownloadPage playlists={playlists} /></div>)
  },
  {
    value: "spotify",
    label: "Spotify",
    content: (<div className="px-3"><PlaylistDownloadPage playlists={playlists} /></div>)
  },
  {
    value: "youtube",
    label: "Youtube",
    content: (<div className="px-3"><PlaylistDownloadPage playlists={playlists} /></div>)
  },
];

export default function PlaylistPage() {

  return <TabsLayout tabs={TabItems} defaultTab="spotify" />;
}
