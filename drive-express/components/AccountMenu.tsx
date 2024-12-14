'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function AccountMenu() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex space-x-4">
        <Link
          href="/register"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          M'inscrire
        </Link>
        <Link
          href="/login"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Me connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="flex space-x-4">
      <Link
        href="/dashboard"
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
      >
        Dashboard
      </Link>
      <Link
        href="/profile"
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
      >
        Voir mon profil
      </Link>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Se déconnecter
      </button>
    </div>
  );
}
