'use client';

import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();

  // États pour les produits
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({
    id: null,
    nom: '',
    description: '',
    prix: '',
    quantite_stock: '',
    categorie_nom: '',
  });

  // États pour les catégories
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');

  // Fetch produits
  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  // Fetch catégories
  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Soumission formulaire produit
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = productForm.id ? 'PUT' : 'POST';
    const url = productForm.id ? `/api/products/${productForm.id}` : '/api/products';

    await fetch(url, {
      method,
      body: JSON.stringify(productForm),
      headers: { 'Content-Type': 'application/json' },
    });

    fetchProducts();
    setProductForm({
      id: null,
      nom: '',
      description: '',
      prix: '',
      quantite_stock: '',
      categorie_nom: '',
    });
  };

  // Supprimer produit
  const handleProductDelete = async (id: number) => {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  // Modifier produit
  const handleProductEdit = (product: any) => {
    setProductForm({
      ...product,
      categorie_nom: product.Categories?.nom || '', // Pré-remplir le nom de la catégorie
    });
  };

  // Ajouter catégorie
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/categories', {
      method: 'POST',
      body: JSON.stringify({ nom: categoryName }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      setCategoryName('');
      fetchCategories();
    } else {
      alert('Erreur lors de la création de la catégorie');
    }
  };

  if (status === 'loading') {
    return <p>Chargement...</p>;
  }

  if (!session || session.user.role !== 'admin') {
    return <p>Accès refusé. Veuillez vous connecter en tant qu’administrateur.</p>;
  }

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

      {/* Section Produits */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Gestion des Produits</h2>
        <form onSubmit={handleProductSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nom"
            value={productForm.nom}
            onChange={(e) => setProductForm({ ...productForm, nom: e.target.value })}
            className="block p-2 border rounded w-full"
            required
          />
          <textarea
            placeholder="Description"
            value={productForm.description}
            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
            className="block p-2 border rounded w-full"
          />
          <input
            type="number"
            placeholder="Prix"
            value={productForm.prix}
            onChange={(e) => setProductForm({ ...productForm, prix: e.target.value })}
            className="block p-2 border rounded w-full"
            required
          />
          <input
            type="number"
            placeholder="Quantité en stock"
            value={productForm.quantite_stock}
            onChange={(e) => setProductForm({ ...productForm, quantite_stock: e.target.value })}
            className="block p-2 border rounded w-full"
            required
          />
          <select
            value={productForm.categorie_nom}
            onChange={(e) => setProductForm({ ...productForm, categorie_nom: e.target.value })}
            className="block p-2 border rounded w-full"
            required
          >
            <option value="">Sélectionnez une catégorie</option>
            {categories.map((category: any) => (
              <option key={category.id} value={category.nom}>
                {category.nom}
              </option>
            ))}
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            {productForm.id ? 'Modifier' : 'Ajouter'}
          </button>
        </form>

        {/* Table des Produits */}
        <table className="w-full mt-8 border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">Nom</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Prix</th>
              <th className="border px-4 py-2">Quantité</th>
              <th className="border px-4 py-2">Catégorie</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
              <tr key={product.id}>
                <td className="border px-4 py-2">{product.nom}</td>
                <td className="border px-4 py-2">{product.description}</td>
                <td className="border px-4 py-2">{product.prix} €</td>
                <td className="border px-4 py-2">{product.quantite_stock}</td>
                <td className="border px-4 py-2">{product.Categories?.nom}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button onClick={() => handleProductEdit(product)} className="px-2 py-1 bg-yellow-500 text-white rounded">
                    Modifier
                  </button>
                  <button onClick={() => handleProductDelete(product.id)} className="px-2 py-1 bg-red-600 text-white rounded">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Section Catégories */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Gestion des Catégories</h2>
        <form onSubmit={handleCategorySubmit} className="flex space-x-4">
          <input
            type="text"
            placeholder="Nom de la catégorie"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="px-4 py-2 border rounded w-full"
            required
          />
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Ajouter
          </button>
        </form>

        <ul className="mt-4 space-y-2">
          {categories.map((category: any) => (
            <li key={category.id} className="p-2 border rounded">
              {category.nom}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
