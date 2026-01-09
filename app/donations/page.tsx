"use client";

import { useState, FormEvent } from "react";

type DonationType = "supplies" | "blood";

type Donation =
  | {
      id: number;
      status: "available" | "matched" | "fulfilled";
      type: "supplies";
      itemName: string;
      category: string;
      quantity: number;
      expiryDate: string;
      city: string;
      state: string;
    }
  | {
      id: number;
      status: "available" | "matched" | "fulfilled";
      type: "blood";
      bloodGroup: string;
      units: number;
      preferredLocation: string;
      from: string;
      to: string;
    };

export default function DonationsPage() {
  // Filters
  const [filters, setFilters] = useState({
    status: "available",
    type: "" as "" | DonationType,
    category: "",
    from: "",
    to: "",
  });

  // Local list of donations (mock; later from API)
  const [donations, setDonations] = useState<Donation[]>([]);

  // Modal + form state
  const [showModal, setShowModal] = useState(false);
  const [donationType, setDonationType] = useState<DonationType>("supplies");

  const [suppliesForm, setSuppliesForm] = useState({
    donorId: 1,
    type: "supplies" as const,
    itemName: "",
    category: "",
    quantity: 0,
    expiryDate: "",
    city: "",
    state: "",
  });

  const [bloodForm, setBloodForm] = useState({
    donorId: 1,
    type: "blood" as const,
    bloodGroup: "O+",
    units: 1,
    preferredLocation: "",
    from: "",
    to: "",
    notes: "",
  });

  // Filter handlers
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Supplies form handlers
  const handleSuppliesChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSuppliesForm((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  // Blood form handlers
  const handleBloodChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setBloodForm((prev) => ({
      ...prev,
      [name]: name === "units" ? Number(value) : value,
    }));
  };

  // Submit create donation
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (donationType === "supplies") {
      const payload = {
        donorId: suppliesForm.donorId,
        type: "supplies" as const,
        itemName: suppliesForm.itemName,
        category: suppliesForm.category,
        quantity: suppliesForm.quantity,
        expiryDate: suppliesForm.expiryDate,
        location: {
          city: suppliesForm.city,
          state: suppliesForm.state,
        },
      };

      console.log("Create supplies donation payload:", payload);

      // Mock created donation
      const created: Donation = {
        id: Date.now(),
        status: "available",
        type: "supplies",
        itemName: payload.itemName,
        category: payload.category,
        quantity: payload.quantity,
        expiryDate: payload.expiryDate,
        city: payload.location.city,
        state: payload.location.state,
      };

      setDonations((prev) => [created, ...prev]);
    } else {
      const payload = {
        donorId: bloodForm.donorId,
        type: "blood" as const,
        bloodGroup: bloodForm.bloodGroup,
        units: bloodForm.units,
        preferredLocation: bloodForm.preferredLocation,
        availabilityWindow: {
          from: bloodForm.from,
          to: bloodForm.to,
        },
        notes: bloodForm.notes,
      };

      console.log("Create blood donation payload:", payload);

      const created: Donation = {
        id: Date.now(),
        status: "available",
        type: "blood",
        bloodGroup: payload.bloodGroup,
        units: payload.units,
        preferredLocation: payload.preferredLocation,
        from: payload.availabilityWindow.from,
        to: payload.availabilityWindow.to,
      };

      setDonations((prev) => [created, ...prev]);
    }

    setShowModal(false);
  };

  const filteredDonations = donations.filter((d) => {
    if (filters.status && d.status !== filters.status) return false;
    if (filters.type && d.type !== filters.type) return false;
    if (filters.category && d.type === "supplies") {
      if (
        !("category" in d) ||
        !d.category.toLowerCase().includes(filters.category.toLowerCase())
      ) {
        return false;
      }
    }
    // date range filters can be wired later
    return true;
  });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">My Donations</h1>
            <p className="text-sm text-slate-600">
              Track and manage your blood and medical supplies donations.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
          >
            Add Donation
          </button>
        </header>

        {/* Filters */}
        <section className="rounded-2xl border bg-white p-4 shadow-sm space-y-3">
          <h2 className="text-sm font-semibold text-slate-800">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
            <div className="space-y-1">
              <label className="font-medium text-slate-700">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="available">Available</option>
                <option value="matched">Matched</option>
                <option value="fulfilled">Fulfilled</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700">Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="">All</option>
                <option value="supplies">Supplies</option>
                <option value="blood">Blood</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700">Category</label>
              <input
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                placeholder="e.g. PPE, medicines"
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700">Date range</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  name="from"
                  value={filters.from}
                  onChange={handleFilterChange}
                  className="w-1/2 rounded-lg border px-2 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                />
                <input
                  type="date"
                  name="to"
                  value={filters.to}
                  onChange={handleFilterChange}
                  className="w-1/2 rounded-lg border px-2 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Donations table */}
        <section className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-800">Donations</h2>
            <span className="text-xs text-slate-500">
              {filteredDonations.length} records
            </span>
          </div>

          {filteredDonations.length === 0 ? (
            <p className="text-sm text-slate-500">
              No donations yet. Click “Add Donation” to create one.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-3 py-2 text-left">ID</th>
                    <th className="px-3 py-2 text-left">Type</th>
                    <th className="px-3 py-2 text-left">Details</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonations.map((d) => (
                    <tr key={d.id} className="border-t">
                      <td className="px-3 py-2 text-slate-800">{d.id}</td>
                      <td className="px-3 py-2 capitalize">
                        {d.type === "supplies" ? "Supplies" : "Blood"}
                      </td>
                      <td className="px-3 py-2 text-slate-700">
                        {d.type === "supplies" ? (
                          <span>
                            {d.itemName} • {d.category} • Qty {d.quantity} •{" "}
                            {d.city}, {d.state}
                          </span>
                        ) : (
                          <span>
                            {d.bloodGroup} • {d.units} units • {d.preferredLocation}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            d.status === "available"
                              ? "bg-emerald-50 text-emerald-700"
                              : d.status === "matched"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {d.status}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <button className="text-xs text-sky-600 hover:underline">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Add Donation modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Add Donation
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-sm text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>

            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setDonationType("supplies")}
                className={`flex-1 rounded-full border px-3 py-1 ${
                  donationType === "supplies"
                    ? "bg-sky-600 text-white border-sky-600"
                    : "bg-white text-slate-700 border-slate-200"
                }`}
              >
                Supplies
              </button>
              <button
                onClick={() => setDonationType("blood")}
                className={`flex-1 rounded-full border px-3 py-1 ${
                  donationType === "blood"
                    ? "bg-rose-600 text-white border-rose-600"
                    : "bg-white text-slate-700 border-slate-200"
                }`}
              >
                Blood
              </button>
            </div>

            {donationType === "supplies" ? (
              <form className="space-y-3 text-sm" onSubmit={handleSubmit}>
                <div className="space-y-1">
                  <label className="font-medium text-slate-800">Item name</label>
                  <input
                    name="itemName"
                    value={suppliesForm.itemName}
                    onChange={handleSuppliesChange}
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-800">Category</label>
                  <input
                    name="category"
                    value={suppliesForm.category}
                    onChange={handleSuppliesChange}
                    placeholder="e.g. PPE, medicines"
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-medium text-slate-800">Quantity</label>
                    <input
                      name="quantity"
                      type="number"
                      min={1}
                      value={suppliesForm.quantity}
                      onChange={handleSuppliesChange}
                      className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium text-slate-800">
                      Expiry date
                    </label>
                    <input
                      name="expiryDate"
                      type="date"
                      value={suppliesForm.expiryDate}
                      onChange={handleSuppliesChange}
                      className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-medium text-slate-800">City</label>
                    <input
                      name="city"
                      value={suppliesForm.city}
                      onChange={handleSuppliesChange}
                      className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium text-slate-800">State</label>
                    <input
                      name="state"
                      value={suppliesForm.state}
                      onChange={handleSuppliesChange}
                      className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-full border px-4 py-2 text-xs text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-sky-600 px-4 py-2 text-xs font-medium text-white hover:bg-sky-700"
                  >
                    Save / Submit Donation
                  </button>
                </div>
              </form>
            ) : (
              <form className="space-y-3 text-sm" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-medium text-slate-800">
                      Blood group
                    </label>
                    <select
                      name="bloodGroup"
                      value={bloodForm.bloodGroup}
                      onChange={handleBloodChange}
                      className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option>O+</option>
                      <option>O-</option>
                      <option>A+</option>
                      <option>A-</option>
                      <option>B+</option>
                      <option>B-</option>
                      <option>AB+</option>
                      <option>AB-</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium text-slate-800">Units</label>
                    <input
                      name="units"
                      type="number"
                      min={1}
                      value={bloodForm.units}
                      onChange={handleBloodChange}
                      className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-800">
                    Preferred location
                  </label>
                  <input
                    name="preferredLocation"
                    value={bloodForm.preferredLocation}
                    onChange={handleBloodChange}
                    placeholder="Hospital / clinic"
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-medium text-slate-800">
                      Available from
                    </label>
                    <input
                      name="from"
                      type="datetime-local"
                      value={bloodForm.from}
                      onChange={handleBloodChange}
                      className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium text-slate-800">
                      Available to
                    </label>
                    <input
                      name="to"
                      type="datetime-local"
                      value={bloodForm.to}
                      onChange={handleBloodChange}
                      className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-800">
                    Notes (optional)
                  </label>
                  <textarea
                    name="notes"
                    value={bloodForm.notes}
                    onChange={handleBloodChange}
                    rows={3}
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-full border px-4 py-2 text-xs text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-rose-600 px-4 py-2 text-xs font-medium text-white hover:bg-rose-700"
                  >
                    Save / Submit Donation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
