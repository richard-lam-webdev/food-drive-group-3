"use client";
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface Product {
  id: number;
  nom: string;
  description: string;
  prix: number;
  quantite_stock: number;
  Categories?: {
    nom: string;
  };
}

interface Category {
  id: number;
  nom: string;
}

export default function Produits() {
  const { data: session, status } = useSession();

  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({
    id: null as number | null,
    nom: '',
    description: '',
    prix: '',
    quantite_stock: '',
    categorie_nom: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [categories, setCategories] = useState([]);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Soumission du formulaire produit
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = productForm.id ? 'PUT' : 'POST';
    const url = productForm.id ? `/api/products/${productForm.id}` : '/api/products';

    const res = await fetch(url, {
      method,
      body: JSON.stringify(productForm),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();

    if (imageFile && data.id) {
      const formData = new FormData();
      formData.append("productId", data.id);
      formData.append("image", imageFile);

      await fetch("/api/products/upload-image", {
        method: "POST",
        body: formData,
      });
      setImageFile(null);
    }

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

  const handleProductDelete = async (id: number) => {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  const handleProductEdit = (product: Product) => {
    setProductForm({
      ...product,
      prix: product.prix.toString(),
      quantite_stock: product.quantite_stock.toString(),
      categorie_nom: product.Categories?.nom || '',
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
      <h1 className="text-3xl font-bold mb-4">Gestion des Produits</h1>

      {/* Formulaire d'ajout de produit */}
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
          {categories.map((category: Category) => (
            <option key={category.id} value={category.nom}>
              {category.nom}
            </option>
          ))}
        </select>
        {/* Champ d'upload d'image */}
        <input
          id="file-input" 
          type="file"
          accept="image/png, image/jpeg"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setImageFile(e.target.files[0]);
            }
          }}
          className="block p-2 border rounded w-full"
        />

        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          {productForm.id ? 'Modifier' : 'Ajouter'}
        </button>
      </form>

      {/* Liste des produits */}
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
          {products.map((product: Product) => (
            <tr key={product.id}>
              <td className="border px-4 py-2">{product.nom}</td>
              <td className="border px-4 py-2">{product.description}</td>
              <td className="border px-4 py-2">{product.prix} €</td>
              <td className="border px-4 py-2">{product.quantite_stock}</td>
              <td className="border px-4 py-2">{product.Categories?.nom}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={() => handleProductEdit(product)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleProductDelete(product.id)}
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
