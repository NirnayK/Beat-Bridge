import { StaticImageData } from "next/image";

export interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

export interface Playlist {
  id: number;
  name: string;
  songs: number;
  thumbnail: StaticImageData | string;
}
