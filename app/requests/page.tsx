"use client";

import { useState, FormEvent } from "react";

type RequestType = "supplies" | "blood";
type Priority = "high" | "medium" | "low";
type Status = "open" | "allocated" | "dispatched" | "received";

type Request =
  | {
      id: number;
      facilityId: number;
      type: "supplies";
      itemName: string;
      category: string;
      quantity: number;
      priority: Priority;
      neededBy: string;
      isEmergency: boolean;
      status: Status;
      matchedDonationId?: number | null;
    }
  | {
      id: number;
      facilityId: number;
      type: "blood";
      bloodGroup: string;
      units: number;
      priority: Priority;
      neededBy: string;
      isEmergency: boolean;
      status: Status;
      matchedDonationId?: number | null;
    };

export default function RequestsPage() {
  // Filters
  const [filters, setFilters] = useState({
    type: "" as "" | RequestType,
    priority: "" as "" | Priority,
    status: "" as "" | Status,
    category: "",
  });

  // Local list of requests (mock; later from API)
  const [requests, setRequests] = useState<Request[]>([]);

  // Modal + form state
  const [showModal, setShowModal] = useState(false);
  const [reqType, setReqType] = useState<RequestType>("supplies");

  // For now, assume logged‑in facilityId = 123
  const FACILITY_ID = 123;

  const [suppliesForm, setSuppliesForm] = useState({
    facilityId: FACILITY_ID,
    type: "supplies" as const,
    itemName: "",
    category: "",
    quantity: 0,
    priority: "high" as Priority,
    neededBy: "",
    isEmergency: false,
    notes: "",
  });

  const [bloodForm, setBloodForm] = useState({
    facilityId: FACILITY_ID,
    type: "blood" as const,
    bloodGroup: "A+",
    units: 1,
    priority: "high" as Priority,
    neededBy: "",
    isEmergency: false,
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as any;
    setSuppliesForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "quantity"
          ? Number(value)
          : value,
    }));
  };

  // Blood form handlers
  const handleBloodChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as any;
    setBloodForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "units"
          ? Number(value)
          : value,
    }));
  };

  // Submit create request
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (reqType === "supplies") {
      const payload = {
        facilityId: suppliesForm.facilityId,
        type: "supplies" as const,
        itemName: suppliesForm.itemName,
        category: suppliesForm.category,
        quantity: suppliesForm.quantity,
        priority: suppliesForm.priority,
        neededBy: suppliesForm.neededBy, // YYYY-MM-DD
        isEmergency: suppliesForm.isEmergency,
        notes: suppliesForm.notes,
      };

      console.log("Create supplies request payload:", payload);

      const created: Request = {
        id: Date.now(),
        facilityId: payload.facilityId,
        type: "supplies",
        itemName: payload.itemName,
        category: payload.category,
        quantity: payload.quantity,
        priority: payload.priority,
        neededBy: payload.neededBy,
        isEmergency: payload.isEmergency,
        status: "open",
        matchedDonationId: null,
      };

      setRequests((prev) => [created, ...prev]);
    } else {
      const payload = {
        facilityId: bloodForm.facilityId,
        type: "blood" as const,
        bloodGroup: bloodForm.bloodGroup,
        units: bloodForm.units,
        priority: bloodForm.priority,
        neededBy: bloodForm.neededBy, // YYYY-MM-DDTHH:mm
        isEmergency: bloodForm.isEmergency,
        notes: bloodForm.notes,
      };

      console.log("Create blood request payload:", payload);

      const created: Request = {
        id: Date.now(),
        facilityId: payload.facilityId,
        type: "blood",
        bloodGroup: payload.bloodGroup,
        units: payload.units,
        priority: payload.priority,
        neededBy: payload.neededBy,
        isEmergency: payload.isEmergency,
        status: "open",
        matchedDonationId: null,
      };

      setRequests((prev) => [created, ...prev]);
    }

    setShowModal(false);
  };

  const filteredRequests = requests.filter((r) => {
    if (filters.type && r.type !== filters.type) return false;
    if (filters.priority && r.priority !== filters.priority) return false;
    if (filters.status && r.status !== filters.status) return false;
    if (filters.category && r.type === "supplies") {
      if (
        !("category" in r) ||
        !r.category.toLowerCase().includes(filters.category.toLowerCase())
      ) {
        return false;
      }
    }
    return true;
  });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Facility Requests</h1>
            <p className="text-sm text-slate-600">
              Create and track blood and supply requests from your facility.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
          >
            New Request
          </button>
        </header>

        {/* Filters */}
        <section className="rounded-2xl border bg-white p-4 shadow-sm space-y-3">
          <h2 className="text-sm font-semibold text-slate-800">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
            <div className="space-y-1">
              <label className="font-medium text-slate-700">Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="">All</option>
                <option value="supplies">Supplies</option>
                <option value="blood">Blood</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700">Priority</label>
              <select
                name="priority"
                value={filters.priority}
                onChange={handleFilterChange}
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="">All</option>
                <option value="open">Open</option>
                <option value="allocated">Allocated</option>
                <option value="dispatched">Dispatched</option>
                <option value="received">Received</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700">Category</label>
              <input
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                placeholder="e.g. PPE, ICU drugs"
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
        </section>

        {/* Requests table */}
        <section className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-800">Requests</h2>
            <span className="text-xs text-slate-500">
              {filteredRequests.length} records
            </span>
          </div>

          {filteredRequests.length === 0 ? (
            <p className="text-sm text-slate-500">
              No requests yet. Click “New Request” to create one.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-3 py-2 text-left">ID</th>
                    <th className="px-3 py-2 text-left">Type</th>
                    <th className="px-3 py-2 text-left">Details</th>
                    <th className="px-3 py-2 text-left">Priority</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Emergency</th>
                    <th className="px-3 py-2 text-left">Matched donation</th>
                    <th className="px-3 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((r) => (
                    <tr key={r.id} className="border-t">
                      <td className="px-3 py-2 text-slate-800">{r.id}</td>
                      <td className="px-3 py-2 capitalize">
                        {r.type === "supplies" ? "Supplies" : "Blood"}
                      </td>
                      <td className="px-3 py-2 text-slate-700">
                        {r.type === "supplies" ? (
                          <span>
                            {r.itemName} • {r.category} • Qty {r.quantity}
                          </span>
                        ) : (
                          <span>
                            {r.bloodGroup} • {r.units} units • Needed by{" "}
                            {new Date(r.neededBy).toLocaleString()}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            r.priority === "high"
                              ? "bg-rose-50 text-rose-700"
                              : r.priority === "medium"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {r.priority}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            r.status === "open"
                              ? "bg-emerald-50 text-emerald-700"
                              : r.status === "allocated"
                              ? "bg-sky-50 text-sky-700"
                              : r.status === "dispatched"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        {r.isEmergency ? (
                          <span className="rounded-full bg-red-50 px-2 py-1 text-xs text-red-700">
                            Yes
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500">No</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-xs text-slate-700">
                        {r.matchedDonationId ? `#${r.matchedDonationId}` : "—"}
                      </td>
                      <td className="px-3 py-2">
                        <button className="text-xs text-rose-600 hover:underline">
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

      {/* New Request modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                New Request
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
                onClick={() => setReqType("supplies")}
                className={`flex-1 rounded-full border px-3 py-1 ${
                  reqType === "supplies"
                    ? "bg-sky-600 text-white border-sky-600"
                    : "bg-white text-slate-700 border-slate-200"
                }`}
              >
                Supplies
              </button>
              <button
                onClick={() => setReqType("blood")}
                className={`flex-1 rounded-full border px-3 py-1 ${
                  reqType === "blood"
                    ? "bg-rose-600 text-white border-rose-600"
                    : "bg-white text-slate-700 border-slate-200"
                }`}
              >
                Blood
              </button>
            </div>

            {reqType === "supplies" ? (
              <form className="space-y-3 text-sm" onSubmit={handleSubmit}>
                <div className="space-y-1">
                  <label className="font-medium text-slate-800">Item name</label>
                  <input
                    name="itemName"
                    value={suppliesForm.itemName}
                    onChange={handleSuppliesChange}
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-800">Category</label>
                  <input
                    name="category"
                    value={suppliesForm.category}
                    onChange={handleSuppliesChange}
                    placeholder="e.g. PPE, ICU meds"
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500"
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
                      className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium text-slate-800">
                      Needed by
                    </label>
                    <input
                      name="neededBy"
                      type="date"
                      value={suppliesForm.neededBy}
                      onChange={handleSuppliesChange}
                      className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-medium text-slate-800">Priority</label>
                    <select
                      name="priority"
                      value={suppliesForm.priority}
                      onChange={handleSuppliesChange}
                      className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div className="flex items-end gap-2">
                    <input
                      id="supEmergency"
                      name="isEmergency"
                      type="checkbox"
                      checked={suppliesForm.isEmergency}
                      onChange={handleSuppliesChange}
                      className="h-4 w-4"
                    />
                    <label
                      htmlFor="supEmergency"
                      className="text-sm text-slate-800"
                    >
                      Mark as emergency
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-800">
                    Notes (optional)
                  </label>
                  <textarea
                    name="notes"
                    value={suppliesForm.notes}
                    onChange={handleSuppliesChange}
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
                    Submit Request
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
                    Needed by (date & time)
                  </label>
                  <input
                    name="neededBy"
                    type="datetime-local"
                    value={bloodForm.neededBy}
                    onChange={handleBloodChange}
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-medium text-slate-800">Priority</label>
                    <select
                      name="priority"
                      value={bloodForm.priority}
                      onChange={handleBloodChange}
                      className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div className="flex items-end gap-2">
                    <input
                      id="bloodEmergency"
                      name="isEmergency"
                      type="checkbox"
                      checked={bloodForm.isEmergency}
                      onChange={handleBloodChange}
                      className="h-4 w-4"
                    />
                    <label
                      htmlFor="bloodEmergency"
                      className="text-sm text-slate-800"
                    >
                      Mark as emergency
                    </label>
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
                    Submit Request
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
