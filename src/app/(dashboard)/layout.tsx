"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import { getSupabase } from "@/lib/supabase/client";
import { NotificationBell } from "@/components/notification/notification-bell";

const NAV_ITEMS = [
  { href: "/feed", label: "Browse Food", icon: "🏠" },
  { href: "/listing/new", label: "Add Listing", icon: "➕" },
  { href: "/my-listings", label: "My Listings", icon: "📦" },
  { href: "/claims", label: "My Claims", icon: "🤝" },
  { href: "/notifications", label: "Notifications", icon: "🔔" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();

  const handleSignOut = async () => {
    await getSupabase().auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <Link href="/feed" className="text-2xl font-bold text-green-600">
            MealBridge
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-green-50 text-green-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="px-4 py-2 text-sm text-gray-500 truncate">
            {user?.email}
          </div>
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/feed" className="text-xl font-bold text-green-600">
            MealBridge
          </Link>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <button onClick={handleSignOut} className="text-sm text-red-600">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-0 pt-16 md:pt-0">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
