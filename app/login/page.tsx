"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

async function handleLogin() {

  setError("");

  const formData = new URLSearchParams();

  formData.append("username", username);
  formData.append("password", password);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    }
  );

  if (!response.ok) {
    setError("Invalid credentials");
    return;
  }

  const data = await response.json();

  localStorage.setItem(
    "token",
    data.access_token
  );
  
  localStorage.setItem(
  "role",
  data.role
);

  router.push("/");
}

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-stone-950 border border-stone-800 rounded-3xl p-8">

        <h1 className="text-4xl font-bold text-yellow-400 mb-8 text-center">
          Admin Login
        </h1>

        <div className="space-y-5">

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            className="w-full bg-black border border-stone-700 rounded-2xl px-4 py-4 text-white outline-none focus:border-yellow-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full bg-black border border-stone-700 rounded-2xl px-4 py-4 text-white outline-none focus:border-yellow-500"
          />

          {error && (
            <p className="text-red-500 text-sm">
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-4 rounded-2xl transition"
          >
            Login
          </button>

        </div>

      </div>

    </main>
  );
}