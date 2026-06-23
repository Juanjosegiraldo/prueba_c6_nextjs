"use client";

import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
      <button
        type="button"
        onClick={() => router.push("/")}
        className="text-lg font-bold"
      >
        RecetasApp
      </button>

      {/* flex-wrap lets the buttons drop to a new line instead of being
          clipped when the viewport gets narrow. */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Show the user name and protected links only when there is a session. */}
        {user ? (
          <>
            <Button size="sm" onPress={() => router.push("/favorites")}>
              Favoritos
            </Button>
            <span className="text-sm">Hola, {user.name}</span>
            <Button size="sm" onPress={handleLogout}>
              Cerrar sesión
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" onPress={() => router.push("/login")}>
              Iniciar sesión
            </Button>
            <Button size="sm" onPress={() => router.push("/register")}>
              Registrarse
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
