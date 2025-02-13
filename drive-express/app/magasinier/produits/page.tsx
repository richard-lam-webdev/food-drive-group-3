"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";


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

interface ProductFormState {
  id: number | null;
  nom: string;
  description: string;
  prix: string;
  quantite_stock: string;
  categorie_nom: string;
}

export default function ProduitsMagasinier() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [productForm, setProductForm] = useState<ProductFormState>({
    id: null,
    nom: "",
    description: "",
    prix: "",
    quantite_stock: "",
    categorie_nom: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = productForm.id ? "PUT" : "POST";
    const url = productForm.id
      ? `/api/products/${productForm.id}`
      : "/api/products";

    try {
      const res = await fetch(url, {
        method,
        body: JSON.stringify(productForm),
        headers: { "Content-Type": "application/json" },
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
        nom: "",
        description: "",
        prix: "",
        quantite_stock: "",
        categorie_nom: "",
      });
    } catch (error) {
      console.error("Erreur lors de la soumission du produit :", error);
    }
  };

  const handleProductDelete = async (id: number) => {
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (error) {
      console.error("Erreur lors de la suppression du produit :", error);
    }
  };

  const handleProductEdit = (product: Product) => {
    setProductForm({
      id: product.id,
      nom: product.nom,
      description: product.description,
      prix: product.prix.toString(),
      quantite_stock: product.quantite_stock.toString(),
      categorie_nom: product.Categories?.nom || "",
    });
  };

  if (status === "loading") return <p>Chargement...</p>;
  if (!session || !session.user.role || !["admin", "magasinier"].includes(session.user.role)) {
    return <p>Accès refusé. Veuillez vous connecter en tant que magasinier ou administrateur.</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Gestion des Produits (Magasinier)</h1>

      <form onSubmit={handleProductSubmit} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="nom" className="font-semibold">
            Nom
          </label>
          <input
            id="nom"
            type="text"
            placeholder="Nom"
            value={productForm.nom}
            onChange={(e) =>
              setProductForm({ ...productForm, nom: e.target.value })
            }
            className="block p-2 border rounded w-full"
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="description" className="font-semibold">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Description"
            value={productForm.description}
            onChange={(e) =>
              setProductForm({ ...productForm, description: e.target.value })
            }
            className="block p-2 border rounded w-full"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="prix" className="font-semibold">
            Prix (€)
          </label>
          <input
            id="prix"
            type="number"
            placeholder="Prix"
            value={productForm.prix}
            onChange={(e) =>
              setProductForm({ ...productForm, prix: e.target.value })
            }
            className="block p-2 border rounded w-full"
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="quantite_stock" className="font-semibold">
            Quantité en stock
          </label>
          <input
            id="quantite_stock"
            type="number"
            placeholder="Quantité en stock"
            value={productForm.quantite_stock}
            onChange={(e) =>
              setProductForm({ ...productForm, quantite_stock: e.target.value })
            }
            className="block p-2 border rounded w-full"
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="categorie" className="font-semibold">
            Catégorie
          </label>
          <select
            id="categorie"
            value={productForm.categorie_nom}
            onChange={(e) =>
              setProductForm({ ...productForm, categorie_nom: e.target.value })
            }
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
        </div>

        <div className="space-y-1">
          <label htmlFor="file-input" className="font-semibold">
            Image
          </label>
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
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          {productForm.id ? "Modifier" : "Ajouter"}
        </button>
      </form>

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
