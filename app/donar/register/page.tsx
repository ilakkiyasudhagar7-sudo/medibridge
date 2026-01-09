"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DonorRegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    organization: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    password: "",
    isBloodDonor: true,
    bloodGroup: "A+",
    lastDonationDate: "",
    medicalNotes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      role: "donor",
      ...form,
    };

    console.log("Donor register payload:", payload);

    // TODO: replace with real API call
    // const res = await fetch("/api/register", { ... });
    // const data = await res.json(); // { user, token }
    // router.push("/dashboard");

    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm space-y-6">
        <header className="space-y-1">
          <p className="text-xs text-sky-600 font-semibold uppercase tracking-wide">
            Donor
          </p>
          <h1 className="text-xl font-semibold text-slate-900">
            Create Donor Account
          </h1>
          <p className="text-sm text-slate-600">
            Register to donate blood units or medical equipment and track your impact.
          </p>
        </header>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-800">Name</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Your full name"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-800">
              Organization (optional)
            </label>
            <input
              name="organization"
              type="text"
              value={form.organization}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Org / company"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-800">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="you@example.com"
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
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="+91..."
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
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
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
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-800">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Create a password"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="isBloodDonor"
              name="isBloodDonor"
              type="checkbox"
              checked={form.isBloodDonor}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label htmlFor="isBloodDonor" className="text-sm text-slate-800">
              I am willing to donate blood
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-800">
                Blood group
              </label>
              <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>O+</option>
                <option>O-</option>
                <option>AB+</option>
                <option>AB-</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-800">
                Last donation date
              </label>
              <input
                name="lastDonationDate"
                type="date"
                value={form.lastDonationDate}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-800">
              Medical notes (optional)
            </label>
            <textarea
              name="medicalNotes"
              value={form.medicalNotes}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
              rows={3}
              placeholder="Any important medical details"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-sky-600 py-2 text-sm font-medium text-white hover:bg-sky-700"
          >
            Create Donor Account
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
