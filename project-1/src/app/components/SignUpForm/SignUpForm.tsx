"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignUpForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [desk, setDesk] = useState("ro"); // Default to Romania
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, desk }),
      });

      if (response.ok) {
        setSuccess("Account created! Redirecting...");
        setTimeout(() => router.push("/"), 2000);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create account.");
      }
    } catch (error) {
      setError("Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div>
        <label htmlFor="desk" className="block text-sm font-medium text-gray-700">
          Select Desk (Country)
        </label>
        <select
          id="desk"
          value={desk}
          onChange={(e) => setDesk(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="ro">Romania</option>
          <option value="it">Italy</option>
          <option value="de">Germany</option>
          <option value="fr">France</option>
          <option value="es">Spain</option>
          <option value="pl">Poland</option>
          <option value="nl">Netherlands</option>
        </select>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-500">{success}</p>}
      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Sign Up
      </button>
      <div className="text-center mt-4">
        <p className="text-sm">
          Already have an account?{" "}
          <Link href="/" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </form>
  );
};

export default SignUpForm;
