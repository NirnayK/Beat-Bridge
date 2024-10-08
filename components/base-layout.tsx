import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/sidebar-nav";

interface LayoutProps {
  children: React.ReactNode;
  title?: string; // Optional title
  description?: string; // Optional description
  sidebarNavItems: { title: string; href: string }[]; // Sidebar items dynamic
  contentMaxWidth?: string; // New optional prop for dynamic max-width
}

export default function BaseLayout({
  children,
  title,
  description,
  sidebarNavItems,
  contentMaxWidth = "lg:max-w-3xl", // Default value if not provided
}: LayoutProps) {
  return (
    <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        {/* Only render this div if title or description is provided */}
        {(title || description) && (
          <div className="space-y-0.5">
            {title && <h2 className="text-2xl font-bold tracking-tight">{title}</h2>}
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>
        )}
        {(title || description) && <Separator className="my-6" />}
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className={`flex-1 ${contentMaxWidth}`}>{children}</div> {/* Applied dynamic width */}
        </div>
      </div>
    </div>
  );
}
