"use client";

import { useEffect, useState } from "react";

type Profile = {
  nom: string | null;
  prenom: string | null;
  email: string;
  adresse: {
    numeroRue: string | null;
    codePostal: string | null;
    ville: string | null;
  };
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        if (!res.ok) {
          throw new Error('Erreur lors du chargement du profil');
        }
        const data: Profile = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <p className="text-xl text-gray-600">Chargement du profil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (!profile) return <div className="min-h-screen flex items-center justify-center">Aucun profil trouvé.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Mon Profil</h1>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Nom :</span>
            <span className="text-gray-800">{profile.nom || "Non défini"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Prénom :</span>
            <span className="text-gray-800">{profile.prenom || "Non défini"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Email :</span>
            <span className="text-gray-800">{profile.email}</span>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-bold text-gray-700 mb-3">Adresse</h2>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Numéro/Rue :</span>
              <span className="text-gray-800">{profile.adresse.numeroRue || "Non défini"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Code Postal :</span>
              <span className="text-gray-800">{profile.adresse.codePostal || "Non défini"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Ville :</span>
              <span className="text-gray-800">{profile.adresse.ville || "Non défini"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
