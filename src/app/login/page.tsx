"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@heroui/react";
import { loginUser } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Already logged in: skip the login form, go home.
  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await loginUser(email.trim(), password);
      if (result.code === 200 && result.data) {
        login(result.data); // save session in localStorage + context
        router.push("/");
        return;
      }
      setMessage(result.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  // Render nothing until the session is resolved (or while redirecting away).
  if (authLoading || user) return null;

  return (
    <main className="mx-auto w-full max-w-md p-4 sm:p-6">
      <h1 className="mb-4 text-2xl font-bold">Iniciar sesión</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          required
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
        />
        <Button type="submit" isDisabled={loading}>
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </Button>
      </form>
      {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
    </main>
  );
}
