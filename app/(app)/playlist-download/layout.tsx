import BaseLayout from "@/components/base-layout";

const sidebarNavItems = [
  {
    title: "Spotify",
    href: "/playlist-download/spotify",
  },
  {
    title: "Youtube",
    href: "/playlist-download/youtube",
  },
  {
    title: "All Songs",
    href: "/playlist-download/all-songs",
  },
  {
    title: "Downloaded",
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
