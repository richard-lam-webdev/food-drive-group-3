'use client';

import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nom: '',
    description: '',
    prix: '',
    quantite_stock: '',
    categorie_id: '',
  });

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = form.id ? 'PUT' : 'POST';
    const url = form.id ? `/api/products/${form.id}` : '/api/products';

    await fetch(url, {
      method,
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' },
    });

    fetchProducts();
    setForm({ id: null, nom: '', description: '', prix: '', quantite_stock: '', categorie_id: '' });
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  const handleEdit = (product: any) => {
    setForm(product);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (status === 'loading') {
    return <p>Chargement...</p>;
  }

  if (!session) {
    return <p>Accès refusé. Veuillez vous connecter.</p>;
  }

  if (session.user.role === 'admin') {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Dashboard Admin</h1>
        <p>Bienvenue, {session.user.name}. Vous avez accès aux fonctionnalités d'administration.</p>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Se déconnecter
        </button>

        {/* Formulaire pour Ajouter / Modifier un produit */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="text"
            placeholder="Nom"
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            className="block p-2 border rounded w-full"
            required
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="block p-2 border rounded w-full"
          />
          <input
            type="number"
            placeholder="Prix"
            value={form.prix}
            onChange={(e) => setForm({ ...form, prix: e.target.value })}
            className="block p-2 border rounded w-full"
            required
          />
          <input
            type="number"
            placeholder="Quantité en stock"
            value={form.quantite_stock}
            onChange={(e) => setForm({ ...form, quantite_stock: e.target.value })}
            className="block p-2 border rounded w-full"
            required
          />
          <input
            type="number"
            placeholder="ID Catégorie"
            value={form.categorie_id}
            onChange={(e) => setForm({ ...form, categorie_id: e.target.value })}
            className="block p-2 border rounded w-full"
            required
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            {form.id ? 'Modifier' : 'Ajouter'}
          </button>
        </form>

        {/* Liste des produits */}
        <table className="w-full mt-8 border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Nom</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Prix</th>
              <th className="border border-gray-300 px-4 py-2">Quantité</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
              <tr key={product.id}>
                <td className="border border-gray-300 px-4 py-2">{product.nom}</td>
                <td className="border border-gray-300 px-4 py-2">{product.description}</td>
                <td className="border border-gray-300 px-4 py-2">{product.prix} €</td>
                <td className="border border-gray-300 px-4 py-2">{product.quantite_stock}</td>
                <td className="border border-gray-300 px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
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
