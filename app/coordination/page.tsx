"use client";

import { useEffect, useRef, useState } from "react";

type TypeFilter = "supplies" | "blood" | "all";
type PriorityFilter = "all" | "emergency" | "high" | "medium" | "low";

type Priority = "high" | "medium" | "low";
type RequestType = "supplies" | "blood";

type Request =
  | {
      id: number;
      facilityName: string;
      type: "supplies";
      itemName: string;
      category: string;
      quantity: number;
      priority: Priority;
      city: string;
      state: string;
      isEmergency: boolean;
      status: "open" | "allocated" | "dispatched" | "received";
    }
  | {
      id: number;
      facilityName: string;
      type: "blood";
      bloodGroup: string;
      units: number;
      priority: Priority;
      city: string;
      state: string;
      isEmergency: boolean;
      status: "open" | "allocated" | "dispatched" | "received";
    };

type Donation =
  | {
      id: number;
      donorName: string;
      type: "supplies";
      itemName: string;
      category: string;
      quantity: number;
      city: string;
      state: string;
      status: "available" | "allocated" | "fulfilled";
    }
  | {
      id: number;
      donorName: string;
      type: "blood";
      bloodGroup: string;
      units: number;
      city: string;
      state: string;
      status: "available" | "allocated" | "fulfilled";
    };

type MatchStatus = "allocated" | "dispatched" | "received";

type Match = {
  id: number;
  requestId: number;
  donationId: number;
  status: MatchStatus;
  notes: string[];
};

export default function CoordinationPage() {
  const NGO_USER_ID = 10;

  const [filters, setFilters] = useState({
    type: "all" as TypeFilter,
    priority: "all" as PriorityFilter,
    radiusKm: 50,
    category: "",
  });

  const [openRequests, setOpenRequests] = useState<Request[]>([
    {
      id: 501,
      facilityName: "City Care Hospital",
      type: "blood",
      bloodGroup: "O+",
      units: 2,
      priority: "high",
      city: "Salem",
      state: "Tamil Nadu",
      isEmergency: true,
      status: "open",
    },
    {
      id: 502,
      facilityName: "GreenLife Clinic",
      type: "supplies",
      itemName: "N95 Masks",
      category: "PPE",
      quantity: 200,
      priority: "medium",
      city: "Salem",
      state: "Tamil Nadu",
      isEmergency: false,
      status: "open",
    },
  ]);

  const [availableDonations, setAvailableDonations] = useState<Donation[]>([
    {
      id: 302,
      donorName: "Arun Kumar",
      type: "blood",
      bloodGroup: "O+",
      units: 2,
      city: "Salem",
      state: "Tamil Nadu",
      status: "available",
    },
    {
      id: 303,
      donorName: "HealthAid NGO Store",
      type: "supplies",
      itemName: "N95 Masks",
      category: "PPE",
      quantity: 500,
      city: "Salem",
      state: "Tamil Nadu",
      status: "available",
    },
  ]);

  const [matches, setMatches] = useState<Match[]>([]);

  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null
  );
  const [selectedDonationId, setSelectedDonationId] = useState<number | null>(
    null
  );

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [statusUpdate, setStatusUpdate] = useState<{
    status: MatchStatus;
    note: string;
  }>({ status: "dispatched", note: "" });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [justCreatedMatchId, setJustCreatedMatchId] = useState<number | null>(
    null
  );

  const matchRefs = useRef<Record<number, HTMLLIElement | null>>({});

  useEffect(() => {
    if (selectedMatch && matchRefs.current[selectedMatch.id]) {
      matchRefs.current[selectedMatch.id]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedMatch]);

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 2500);
    return () => clearTimeout(t);
  }, [toastMessage]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: name === "radiusKm" ? Number(value) : value,
    }));
  };

  const filteredRequests = openRequests.filter((r) => {
    if (filters.type !== "all" && r.type !== filters.type) return false;
    if (filters.priority !== "all") {
      if (
        filters.priority === "emergency" &&
        !(r.isEmergency || r.priority === "high")
      ) {
        return false;
      }
      if (filters.priority !== "emergency" && r.priority !== filters.priority) {
        return false;
      }
    }
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

  const filteredDonations = availableDonations.filter((d) => {
    if (filters.type !== "all" && d.type !== filters.type) return false;
    if (filters.category && d.type === "supplies") {
      if (
        !("category" in d) ||
        !d.category.toLowerCase().includes(filters.category.toLowerCase())
      ) {
        return false;
      }
    }
    return true;
  });

  const handleSuggestedMatches = () => {
    const payload = {
      type: filters.type,
      priority: filters.priority,
      radiusKm: filters.radiusKm,
      category: filters.category,
    };
    console.log("Load lists (GET) payload for suggestions:", payload);
  };

  const handleAllocate = () => {
    if (!selectedRequestId || !selectedDonationId) return;

    const allocatePayload = {
      requestId: selectedRequestId,
      donationId: selectedDonationId,
      allocatedBy: NGO_USER_ID,
    };
    console.log("Allocate match payload:", allocatePayload);

    const newMatch: Match = {
      id: Date.now(),
      requestId: selectedRequestId,
      donationId: selectedDonationId,
      status: "allocated",
      notes: [`Allocated by user ${NGO_USER_ID}`],
    };

    setMatches((prev) => [newMatch, ...prev]);
    setSelectedMatch(newMatch);

    setOpenRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequestId ? { ...r, status: "allocated" } : r
      )
    );
    setAvailableDonations((prev) =>
      prev.map((d) =>
        d.id === selectedDonationId ? { ...d, status: "allocated" } : d
      )
    );

    setToastMessage(
      `Match created: Request #${selectedRequestId} ↔ Donation #${selectedDonationId}`
    );
    setJustCreatedMatchId(newMatch.id);
    setTimeout(() => setJustCreatedMatchId(null), 1500);

    // IMPORTANT: do NOT reset selectedRequestId / selectedDonationId
    // so the radios stay visually selected
  };

  const handleUpdateStatus = () => {
    if (!selectedMatch) return;

    const payload = {
      matchId: selectedMatch.id,
      status: statusUpdate.status,
      updatedBy: NGO_USER_ID,
      note: statusUpdate.note,
    };
    console.log("Update match status payload:", payload);

    setMatches((prev) =>
      prev.map((m) =>
        m.id === selectedMatch.id
          ? {
              ...m,
              status: statusUpdate.status,
              notes: statusUpdate.note ? [...m.notes, statusUpdate.note] : m.notes,
            }
          : m
      )
    );

    setSelectedMatch((prev) =>
      prev
        ? {
            ...prev,
            status: statusUpdate.status,
            notes: statusUpdate.note ? [...prev.notes, statusUpdate.note] : prev.notes,
          }
        : prev
    );

    setStatusUpdate({ status: "dispatched", note: "" });
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Coordination & Matching
            </h1>
            <p className="text-sm text-slate-600">
              NGOs can view open facility requests, available donations and
              allocate the best matches.
            </p>
          </div>
          <button
            onClick={handleSuggestedMatches}
            className="rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
          >
            Suggested matches
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
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="all">All</option>
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
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="all">All</option>
                <option value="emergency">Emergency / High</option>
                <option value="high">High only</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700">Radius (km)</label>
              <input
                name="radiusKm"
                type="number"
                min={1}
                value={filters.radiusKm}
                onChange={handleFilterChange}
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700">Category</label>
              <input
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                placeholder="e.g. PPE, ICU meds"
                className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
        </section>

        {/* Requests and Donations */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Requests */}
          <div className="rounded-2xl border bg-white p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">
                Open Requests
              </h2>
              <span className="text-xs text-slate-500">
                {filteredRequests.length} records
              </span>
            </div>
            {filteredRequests.length === 0 ? (
              <p className="text-sm text-slate-500">No open requests.</p>
            ) : (
              <div className="overflow-x-auto text-sm">
                <table className="min-w-full">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="px-3 py-2 text-left">Select</th>
                      <th className="px-3 py-2 text-left">ID</th>
                      <th className="px-3 py-2 text-left">Facility</th>
                      <th className="px-3 py-2 text-left">Details</th>
                      <th className="px-3 py-2 text-left">Priority</th>
                      <th className="px-3 py-2 text-left">Emergency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((r) => (
                      <tr key={r.id} className="border-t">
                        <td className="px-3 py-2">
                          <input
                            type="radio"
                            name="selectedRequest"
                            checked={selectedRequestId === r.id}
                            disabled={r.status === "allocated"}
                            onChange={() => setSelectedRequestId(r.id)}
                          />
                        </td>
                        <td className="px-3 py-2">{r.id}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span>{r.facilityName}</span>
                            {r.status === "allocated" && (
                              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700">
                                Matched
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-slate-700">
                          {r.type === "supplies" ? (
                            <span>
                              {r.itemName} • {r.category} • Qty {r.quantity}
                            </span>
                          ) : (
                            <span>
                              {r.bloodGroup} • {r.units} units • {r.city}
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
                          {r.isEmergency ? (
                            <span className="rounded-full bg-red-50 px-2 py-1 text-xs text-red-700">
                              Yes
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500">No</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Donations */}
          <div className="rounded-2xl border bg-white p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">
                Available Donations
              </h2>
              <span className="text-xs text-slate-500">
                {filteredDonations.length} records
              </span>
            </div>
            {filteredDonations.length === 0 ? (
              <p className="text-sm text-slate-500">No available donations.</p>
            ) : (
              <div className="overflow-x-auto text-sm">
                <table className="min-w-full">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="px-3 py-2 text-left">Select</th>
                      <th className="px-3 py-2 text-left">ID</th>
                      <th className="px-3 py-2 text-left">Donor</th>
                      <th className="px-3 py-2 text-left">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDonations.map((d) => (
                      <tr key={d.id} className="border-t">
                        <td className="px-3 py-2">
                          <input
                            type="radio"
                            name="selectedDonation"
                            checked={selectedDonationId === d.id}
                            disabled={d.status === "allocated"}
                            onChange={() => setSelectedDonationId(d.id)}
                          />
                        </td>
                        <td className="px-3 py-2">{d.id}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span>{d.donorName}</span>
                            {d.status === "allocated" && (
                              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700">
                                Matched
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-slate-700">
                          {d.type === "supplies" ? (
                            <span>
                              {d.itemName} • {d.category} • Qty {d.quantity}
                            </span>
                          ) : (
                            <span>
                              {d.bloodGroup} • {d.units} units • {d.city}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Allocate button + toast */}
        <section className="flex flex-col items-end gap-2">
          <button
            onClick={handleAllocate}
            disabled={!selectedRequestId || !selectedDonationId}
            className={`rounded-full px-5 py-2 text-sm font-medium ${
              !selectedRequestId || !selectedDonationId
                ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
          >
            Allocate selected Request + Donation
          </button>

          {toastMessage && (
            <div className="rounded-full bg-emerald-50 px-4 py-1 text-xs text-emerald-800 shadow-sm">
              {toastMessage}
            </div>
          )}
        </section>

        {/* Match detail & status updates */}
        <section className="rounded-2xl border bg-white p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">
              Match Details & Status
            </h2>
            <span className="text-xs text-slate-500">
              {matches.length} matches
            </span>
          </div>

          {matches.length === 0 ? (
            <p className="text-sm text-slate-500">
              No matches yet. Allocate a request and donation to see details
              here.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="md:col-span-1">
                <h3 className="text-xs font-semibold text-slate-700 mb-2">
                  Existing matches
                </h3>
                <ul className="space-y-1">
                  {matches.map((m) => (
                    <li
                      key={m.id}
                      ref={(el) => (matchRefs.current[m.id] = el)}
                    >
                      <button
                        onClick={() => setSelectedMatch(m)}
                        className={`w-full rounded-lg border px-3 py-2 text-left transition-colors ${
                          selectedMatch?.id === m.id
                            ? "border-emerald-500 bg-emerald-50"
                            : justCreatedMatchId === m.id
                            ? "border-emerald-400 bg-emerald-50"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex justify-between">
                          <span className="text-xs text-slate-600">
                            Match #{m.id}
                          </span>
                          <span className="text-xs capitalize">{m.status}</span>
                        </div>
                        <p className="text-xs text-slate-700">
                          Req #{m.requestId} ↔ Don #{m.donationId}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:col-span-2 space-y-3">
                {!selectedMatch ? (
                  <p className="text-sm text-slate-500">
                    Select a match on the left to update status or view notes.
                  </p>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          Match #{selectedMatch.id}
                        </p>
                        <p className="text-xs text-slate-600">
                          Request #{selectedMatch.requestId} • Donation #
                          {selectedMatch.donationId}
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700 capitalize">
                        {selectedMatch.status}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-700">
                        Update status
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <select
                          value={statusUpdate.status}
                          onChange={(e) =>
                            setStatusUpdate((prev) => ({
                              ...prev,
                              status: e.target.value as MatchStatus,
                            }))
                          }
                          className="rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                        >
                          <option value="allocated">Allocated</option>
                          <option value="dispatched">Dispatched</option>
                          <option value="received">Received</option>
                        </select>
                        <button
                          onClick={handleUpdateStatus}
                          className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-700"
                        >
                          Save status
                        </button>
                      </div>

                      <textarea
                        value={statusUpdate.note}
                        onChange={(e) =>
                          setStatusUpdate((prev) => ({
                            ...prev,
                            note: e.target.value,
                          }))
                        }
                        placeholder="Optional note, e.g. 'Courier picked up at 14:20'"
                        rows={3}
                        className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold text-slate-700">
                        Timeline notes
                      </h4>
                      {selectedMatch.notes.length === 0 ? (
                        <p className="text-xs text-slate-500">
                          No notes recorded yet.
                        </p>
                      ) : (
                        <ul className="text-xs text-slate-700 list-disc list-inside space-y-0.5">
                          {selectedMatch.notes.map((n, idx) => (
                            <li key={idx}>{n}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
