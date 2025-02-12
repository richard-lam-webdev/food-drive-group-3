"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (res?.error) {
      setError("Erreur : Identifiants incorrects.");
    } else {
      const session = await fetch("/api/auth/session").then((res) => res.json());

      if (session?.user?.role) {
        if (session.user.role === "admin") {
          router.push("/dashboard");
        } else if (session.user.role === "magasinier") {
          router.push("/magasinier/dashboard");
        } else if (session.user.role === "client") {
          router.push("/");
        } else {
          setError("Rôle non reconnu.");
        }
      } else {
        setError("Impossible de récupérer le rôle utilisateur.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-80">
        <h2 className="text-2xl font-bold text-center mb-4">Connexion</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="px-4 py-2 border rounded-lg"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="px-4 py-2 border rounded-lg"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
