"use client";

import { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Download, Music, Search } from "lucide-react";
import pic from "/Users/nak/Downloads/01.webp";

interface Playlist {
  id: number;
  name: string;
  songs: number;
  thumbnail: StaticImageData;
}

const playlists: Playlist[] = [
  { id: 1, name: "React Rendezvous", songs: 25, thumbnail: pic },
  { id: 2, name: "Async Awakenings", songs: 40, thumbnail: pic },
  { id: 3, name: "The Art of Reusability", songs: 30, thumbnail: pic },
  { id: 4, name: "Stateful Symphony", songs: 50, thumbnail: pic },
  { id: 5, name: "Thinking Components", songs: 35, thumbnail: pic },
  { id: 6, name: "Functional Fury", songs: 20, thumbnail: pic },
];

export default function PlaylistDownloadPage() {
  const [selectedPlaylists, setSelectedPlaylists] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const togglePlaylist = (id: number) => {
    setSelectedPlaylists((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedPlaylists((prev) =>
      prev.length === playlists.length ? [] : playlists.map((p) => p.id)
    );
  };

  const handleDownload = () => {
    console.log("Downloading playlists:", selectedPlaylists);
    // Implement your download logic here
  };

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 overflow-auto">
      <PlaylistControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedPlaylists={selectedPlaylists}
        toggleAll={toggleAll}
        handleDownload={handleDownload}
        playlists={playlists}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPlaylists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            isSelected={selectedPlaylists.includes(playlist.id)}
            togglePlaylist={() => togglePlaylist(playlist.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface PlaylistControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedPlaylists: number[];
  toggleAll: () => void;
  handleDownload: () => void;
  playlists: Playlist[];
}

function PlaylistControls({
  searchTerm,
  setSearchTerm,
  selectedPlaylists,
  toggleAll,
  handleDownload,
  playlists,
}: PlaylistControlsProps) {
  return (
    <div className="flex justify-between items-center align-end mb-6">
      <div className="relative w-64">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search playlists"
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="space-x-2 flex align-end">
        <Button variant="outline" onClick={toggleAll}>
          {selectedPlaylists.length === playlists.length ? "Deselect All" : "Select All"}
        </Button>
        <Button onClick={handleDownload} disabled={selectedPlaylists.length === 0}>
          <div className="flex align-top">
            <Download className="mr-1 h-4 w-4" />
            <p>Download Selected ({selectedPlaylists.length})</p>
          </div>
        </Button>
      </div>
    </div>
  );
}

interface PlaylistCardProps {
  playlist: Playlist;
  isSelected: boolean;
  togglePlaylist: () => void;
}

function PlaylistCard({ playlist, isSelected, togglePlaylist }: PlaylistCardProps) {
  return (
    <Card className="flex flex-col">
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <Image
            src={playlist.thumbnail}
            alt={`${playlist.name} thumbnail`}
            layout="fill"
            objectFit="cover"
          />
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-3">
        <div className="flex items-center flex-1 min-w-0">
          <Checkbox
            checked={isSelected}
            onCheckedChange={togglePlaylist}
            className="mr-2"
          />
          <div className="truncate">
            <h3 className="font-semibold text-sm truncate">{playlist.name}</h3>
            <p className="text-xs text-muted-foreground">{playlist.songs} songs</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
