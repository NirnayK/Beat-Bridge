"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Download, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Playlist } from "@/types/props";
import { useState } from "react";

interface playlistProps {
  playlists: Playlist[]
}

export default function PlaylistDownloadPage({ playlists }: playlistProps) {
  const [selectedPlaylists, setSelectedPlaylists] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const togglePlaylist = (id: number) => {
    setSelectedPlaylists((prev: number[]) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedPlaylists((prev: number[]) =>
      prev.length === playlists.length ? [] : playlists.map((p) => Number(p.id))
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
    <div className="flex-1 py-6 overflow-auto">
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
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <Image
            src={playlist.thumbnail}
            alt={`${playlist.name} thumbnail`}
            className="rounded-lg transition-all scale-105 hover:scale-110"
          />
        </div>
      </CardContent>
      <CardFooter className="p-3">
        <div className="grid grid-cols-[auto,1fr] items-center gap-y-1">
          <Checkbox
            checked={isSelected}
            onCheckedChange={togglePlaylist}
            className="mr-2"
          />
          <h3 className="font-semibold text-sm truncate">{playlist.name}</h3>
          <div />
          <p className="text-xs text-muted-foreground">{playlist.songs} songs</p>
        </div>
      </CardFooter>
    </Card>
  );
}
