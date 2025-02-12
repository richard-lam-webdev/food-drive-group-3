// components/MagasinierProtectedPage.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

export default function MagasinierProtectedPage({ children }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && (!session || !["magasinier", "admin"].includes(session.user.role))) {
      router.push("/unauthorized");
    }
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return <p>Chargement...</p>;
  }

  return <>{children}</>;
}
