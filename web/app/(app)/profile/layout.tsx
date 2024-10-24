import BaseLayout from "@/components/base-layout";

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/profile",
  },
  {
    title: "Spotify",
    href: "/profile/spotify",
  },
  {
    title: "Youtube",
    href: "/profile/youtube",
  },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <BaseLayout
      title="Settings"
      description="Manage your account settings."
      sidebarNavItems={sidebarNavItems}
    >
      {children}
    </BaseLayout>
  );
}
