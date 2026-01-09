"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NgoRegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    ngoName: "",
    registrationId: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      role: "ngo",
      ...form,
    };

    console.log("NGO register payload:", payload);
    // TODO: POST to /api/register then redirect
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm space-y-6">
        <header className="space-y-1">
          <p className="text-xs text-violet-600 font-semibold uppercase tracking-wide">
            NGO / MediBridge team
          </p>
          <h1 className="text-xl font-semibold text-slate-900">
            Create NGO Account
          </h1>
          <p className="text-sm text-slate-600">
            Register your organization to coordinate and route donations.
          </p>
        </header>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-800">
              NGO name
            </label>
            <input
              name="ngoName"
              type="text"
              value={form.ngoName}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-800">
              Registration ID
            </label>
            <input
              name="registrationId"
              type="text"
              value={form.registrationId}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-800">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-800">Phone</label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-800">City</label>
              <input
                name="city"
                type="text"
                value={form.city}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-800">State</label>
              <input
                name="state"
                type="text"
                value={form.state}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-800">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-violet-600 py-2 text-sm font-medium text-white hover:bg-violet-700"
          >
            Create NGO Account
          </button>
        </form>

        <p className="text-xs text-slate-500 text-center">
          Back to{" "}
          <Link href="/" className="underline">
            home
          </Link>
        </p>
      </div>
    </main>
  );
}
