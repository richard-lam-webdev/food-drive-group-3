'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Utilisateurs() {
  const { data: session, status } = useSession();

  const [users, setUsers] = useState([]);
  const [userForm, setUserForm] = useState({
    id: null,
    nom: '',
    email: '',
    role: '',
  });

   const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = userForm.id ? 'PUT' : 'POST';
    const url = '/api/users';

    await fetch(url, {
      method,
      body: JSON.stringify(userForm),
      headers: { 'Content-Type': 'application/json' },
    });

    fetchUsers();
    setUserForm({ id: null, nom: '', email: '', role: '' });
  };

  const handleUserDelete = async (id: number) => {
    await fetch('/api/users', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' },
    });
    fetchUsers();
  };

  const handleUserEdit = (user: any) => {
    setUserForm({
      id: user.id,
      nom: user.nom,
      email: user.email,
      role: user.role,
    });
  };

  if (status === 'loading') {
    return <p>Chargement...</p>;
  }

  if (!session || session.user.role !== 'admin') {
    return <p>Accès refusé. Veuillez vous connecter en tant qu’administrateur.</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Gestion des Utilisateurs</h1>

      <form onSubmit={handleUserSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nom"
          value={userForm.nom}
          onChange={(e) => setUserForm({ ...userForm, nom: e.target.value })}
          className="block p-2 border rounded w-full"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={userForm.email}
          onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
          className="block p-2 border rounded w-full"
          required
        />
        <select
          value={userForm.role}
          onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
          className="block p-2 border rounded w-full"
          required
        >
          <option value="">Sélectionnez un rôle</option>
          <option value="admin">Admin</option>
          <option value="magasinier">Magasinier</option>
          <option value="client">Utilisateur</option>
        </select>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          {userForm.id ? 'Modifier' : 'Ajouter'}
        </button>
      </form>

      <table className="w-full mt-8 border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Nom</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Rôle</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.nom}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.role}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={() => handleUserEdit(user)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleUserDelete(user.id)}
                  className="px-2 py-1 bg-red-600 text-white rounded"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
