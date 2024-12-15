'use client';

import { signOut, useSession } from 'next-auth/react';

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Chargement...</p>;
  }

  if (!session) {
    return <p>Accès refusé. Veuillez vous connecter.</p>;
  }

  if (session.user.role === 'admin') {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p>Bienvenue, {session.user.name}. Vous avez accès aux fonctionnalités d'administration.</p>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Se déconnecter
        </button>
      </div>
    );
  }
  

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Se déconnecter
        </button>
      </div>
      <p>Bienvenue, {session.user.name} !</p>
      <p>Email : {session.user.email}</p>
      <p>Rôle : {session.user.role}</p>
    </div>
  );
}
