import BaseLayout from "@/components/base-layout";

const sidebarNavItems = [
  {
    title: "Playlists",
    href: "/playlist-download",
  },
  {
    title: "Songs",
    href: "/playlist-download/all-songs",
  },
  {
    title: "Downloaded Songs",
    href: "/playlist-download/downloaded",
  },
];

export default function PlaylistLayout({ children }: { children: React.ReactNode }) {
  return (
    <BaseLayout
      sidebarNavItems={sidebarNavItems}
      contentMaxWidth="max-w-full"
    >
      {children}
    </BaseLayout>
  );
}
