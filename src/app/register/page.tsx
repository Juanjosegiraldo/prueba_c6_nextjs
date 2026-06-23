"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@heroui/react";
import { registerUser } from "@/services/auth";
import { validateRegistration } from "@/helpers/validation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Already logged in: this page makes no sense, send the user home.
  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    // Client-side mirror of the server rules: instant feedback before the call.
    const localError = validateRegistration({ name, email, password });
    if (localError) {
      setMessage(localError);
      return;
    }
    if (password !== confirm) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser(name.trim(), email.trim(), password);
      if (result.code === 201) {
        router.push("/login");
        return;
      }
      setMessage(result.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  // Render nothing until the session is resolved (or while redirecting away),
  // so a logged-in user never sees the form flash.
  if (authLoading || user) return null;

  return (
    <main className="mx-auto w-full max-w-md p-4 sm:p-6">
      <h1 className="mb-4 text-2xl font-bold">Crear cuenta</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre"
          required
        />
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          required
        />
        <div className="flex flex-col gap-1">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
          />
          {/* Hint moved out of the placeholder so it never overflows the input. */}
          <p className="text-xs text-gray-500">
            Mínimo 8 caracteres, con al menos una letra y un número.
          </p>
        </div>
        <Input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirmar contraseña"
          required
        />
        <Button type="submit" isDisabled={loading}>
          {loading ? "Creando..." : "Registrarse"}
        </Button>
      </form>
      {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
    </main>
  );
}
