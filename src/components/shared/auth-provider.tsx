"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSupabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/use-auth-store";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/callback"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await getSupabase().auth.getUser();
      setUser(user);
      setLoading(false);

      if (!user && !PUBLIC_PATHS.includes(pathname)) {
        router.push("/login");
      }
    };

    getUser();

    const {
      data: { subscription },
    } = getSupabase().auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === "SIGNED_IN") {
        router.push("/feed");
      }
      if (event === "SIGNED_OUT") {
        router.push("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading, router, pathname]);

  return <>{children}</>;
}
