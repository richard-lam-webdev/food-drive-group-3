'use client';

import { useState } from 'react';
//import Image from 'next/image';

export default function Home() {
  const [shoppingCartVisible, setShoppingCartVisible] = useState(false);
  const [shoppingList, setShoppingList] = useState([{ id: 1, name: 'Maxi coton CARREFOUR BABY', price: 2.49, quantity: 1 }]);

  const toggleCart = () => {
    setShoppingCartVisible(!shoppingCartVisible);
  };

  const handleUploadPhoto = () => {
    // Simuler le processus d'IA pour ajouter des ingrédients
    const detectedIngredients = [
      { id: 2, name: 'Tomates', price: 3.99, quantity: 1 }, // Ajoute une quantité par défaut
    ];
    setShoppingList((prevList) => [...prevList, ...detectedIngredients]);
    alert('Ingrédients détectés et ajoutés au panier.');
  };

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Drive Express</h1>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Me connecter</button>
          <button
            onClick={toggleCart}
            className="relative px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Panier
            <span className="absolute top-0 right-0 px-2 py-1 bg-red-600 text-white text-xs rounded-full">
              {shoppingList.length}
            </span>
          </button>
        </div>
      </header>

      {/* Main Section */}
      <section className="flex flex-col items-center justify-center mt-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Commencez vos courses</h2>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg">
          Commencer les courses
        </button>

        {/* Upload photo for AI detection */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Utilisez l'IA pour ajouter des ingrédients
          </h3>
          <button
            onClick={handleUploadPhoto}
            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg"
          >
            Télécharger une photo
          </button>
        </div>
      </section>

      {/* Shopping Cart Modal */}
      {shoppingCartVisible && (
        <section className="fixed inset-0 bg-black bg-opacity-50 flex justify-end">
          <div className="bg-white w-full md:w-1/3 h-full p-6 relative">
            <button
              onClick={toggleCart}
              className="absolute top-4 right-4 text-xl text-gray-600"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Mon panier</h2>

            <div className="flex flex-col space-y-4">
              {shoppingList.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <p className="text-gray-600">Prix: {item.price} €</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-2 py-1 bg-gray-200 rounded">-</button>
                    <span>{item.quantity}</span>
                    <button className="px-2 py-1 bg-gray-200 rounded">+</button>
                  </div>
                </div>
              ))}
              <div className="mt-4">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg">
                  Voir mon panier ({shoppingList.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)} €)
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
