'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Role = 'donor' | 'ngo' | 'facility';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('donor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Login failed');
        return;
      }

      const data = await res.json();
      // data should look like: { token: '...', user: { id, role, name } }
      // TODO: store token somewhere (cookie, localStorage, etc.)
      router.push('/dashboard');
    } catch (err) {
      setError('Network error, please try again');
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-3xl shadow"
      >
        <h1 className="text-2xl font-semibold mb-4 text-gray-900">Login</h1>

        

        {/* Email */}
        <label className="block text-sm font-medium mb-1 text-black">
          Email
        </label>
        <input
          type="email"
          className="w-full border border-gray-400 rounded-xl px-3 py-2 mb-4
             text-gray-900 placeholder-gray-500 bg-white"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <label className="block text-sm font-medium mb-1 text-black">
          Password
        </label>
        <input
          type="password"
          className="w-full border border-gray-400 rounded-xl px-3 py-2 mb-4
             text-gray-900 placeholder-gray-500 bg-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="button"
          className="text-sm text-blue-600 mb-4 hover:underline"
        >
          Forgot password?
        </button>

        {/* Login button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        {error && (
          <p className="text-red-500 text-sm mt-3">
            {error}
          </p>
        )}

        {/* Register links */}
        <div className="mt-4 text-sm text-gray-900">
          <p>
            Register as{' '}
            <a href="/register/donor" className="text-blue-700 font-medium hover:underline">
              Donor
            </a>{' '}
            /{' '}
            <a href="/register/ngo" className="text-blue-700 font-medium hover:underline">
              NGO
            </a>{' '}
            /{' '}
            <a href="/register/facility" className="text-blue-700 font-medium hover:underline">
              Facility
            </a>
          </p>
        </div>
      </form>
    </main>
  );
}
