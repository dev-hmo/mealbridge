"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase/client";

export function CallbackHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await getSupabase().auth.exchangeCodeForSession(
        window.location.search
      );

      if (error) {
        console.error("Auth callback error:", error);
        router.push("/login?error=auth_failed");
        return;
      }

      if (data.user) {
        const { data: profile } = await getSupabase()
          .from("profiles")
          .select("id")
          .eq("id", data.user.id)
          .single();

        if (!profile) {
          await getSupabase().from("profiles").insert({
            id: data.user.id,
            full_name:
              data.user.user_metadata.full_name ||
              data.user.email?.split("@")[0] ||
              "User",
            role: "both",
          });
        }
      }

      router.push("/feed");
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-600">Signing you in...</p>
      </div>
    </div>
  );
}
