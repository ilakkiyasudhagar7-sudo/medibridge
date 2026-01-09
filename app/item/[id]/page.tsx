// app/item/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

type EntityType = "donation" | "request" | "match";
type Status = "allocated" | "dispatched" | "received" | "available" | "open";

type TimelineEntry = {
  status: Status;
  at: string;
  by: string;
};

type DetailResponse = {
  id: number;
  entityType: EntityType;
  header: Record<string, any>;
  info: Record<string, any>;
  status: Status;
  timeline: TimelineEntry[];
  map?: {
    from?: { label: string };
    to?: { label: string };
  };
  notes: string[];
};

export default function ItemDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const id = Number(params.id);

  // Role & entity type can be passed via query, e.g. /item/302?type=donation&role=ngo
  const entityType = (searchParams.get("type") || "donation") as EntityType;
  const role = searchParams.get("role") || "ngo"; // "ngo" | "facility" | "donor"

  const [detail, setDetail] = useState<DetailResponse | null>(null);

  const [updateStatus, setUpdateStatus] = useState<Status>("dispatched");
  const [note, setNote] = useState("");

  // Mock "load" on mount (replace with real GET later)
  useEffect(() => {
    const loadPayload = { id, type: entityType };
    console.log("Detail load (GET) payload:", loadPayload);

    // Example mock data – in real app this would come from API
    const mock: DetailResponse = {
      id,
      entityType,
      header:
        entityType === "donation"
          ? { title: `Donation #${id}`, sub: "O+ blood, 2 units" }
          : { title: `Request #${id}`, sub: "High priority, ICU" },
      info:
        entityType === "donation"
          ? { donor: "Arun Kumar", city: "Salem", state: "Tamil Nadu" }
          : { facility: "City Care Hospital", city: "Salem" },
      status: entityType === "donation" ? "dispatched" : "allocated",
      timeline: [
        {
          status: entityType === "donation" ? "available" : "open",
          at: "2026-01-08T10:00",
          by: entityType === "donation" ? "donor" : "facility",
        },
        {
          status: "allocated",
          at: "2026-01-09T09:30",
          by: "ngo",
        },
        {
          status: "dispatched",
          at: "2026-01-09T14:15",
          by: "ngo",
        },
      ],
      map: {
        from: { label: "Donor address / blood bank" },
        to: { label: "Recipient facility" },
      },
      notes: ["Allocated to Request #501 by NGO user 10"],
    };

    setDetail(mock);
  }, [id, entityType]);

  if (!detail) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-600">Loading item #{id}…</p>
      </main>
    );
  }

  const canChangeStatus =
    role === "ngo" || (role === "facility" && updateStatus === "received");

  const handleSave = () => {
    if (!canChangeStatus) return;

    const payload = {
      entityType: detail.entityType,
      entityId: detail.id,
      newStatus: updateStatus,
      updatedBy: 10, // mock NGO user id / facility user id
      note: note || undefined,
    };

    console.log("Update status / timeline (POST) payload:", payload);

    // Update local state to simulate response
    const now = new Date().toISOString();
    setDetail((prev) =>
      prev
        ? {
            ...prev,
            status: updateStatus,
            timeline: [
              ...prev.timeline,
              {
                status: updateStatus,
                at: now,
                by: role,
              },
            ],
            notes: note ? [...prev.notes, note] : prev.notes,
          }
        : prev
    );
    setNote("");
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {detail.entityType.toUpperCase()} DETAIL
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              {detail.header.title}
            </h1>
            <p className="text-sm text-slate-600">{detail.header.sub}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-slate-500">
              Current status
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 capitalize">
              {detail.status}
            </span>
          </div>
        </header>

        {/* Info + Map */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border bg-white p-4 shadow-sm text-sm space-y-1">
            <h2 className="text-xs font-semibold text-slate-700 mb-1">
              Key info
            </h2>
            {Object.entries(detail.info).map(([k, v]) => (
              <p key={k} className="text-slate-700">
                <span className="font-medium capitalize">{k}: </span>
                {String(v)}
              </p>
            ))}
          </div>
          <div className="rounded-2xl border bg-white p-4 shadow-sm text-sm space-y-1">
            <h2 className="text-xs font-semibold text-slate-700 mb-1">
              Route overview
            </h2>
            <p className="text-slate-700">
              <span className="font-medium">From: </span>
              {detail.map?.from?.label || "TBD"}
            </p>
            <p className="text-slate-700">
              <span className="font-medium">To: </span>
              {detail.map?.to?.label || "TBD"}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              (Map integration can later show live route and distance.)
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section className="rounded-2xl border bg-white p-4 shadow-sm text-sm space-y-3">
          <h2 className="text-xs font-semibold text-slate-700">
            Status timeline
          </h2>
          {detail.timeline.length === 0 ? (
            <p className="text-xs text-slate-500">
              No timeline entries recorded yet.
            </p>
          ) : (
            <ol className="space-y-2">
              {detail.timeline.map((t, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-xs text-slate-800">
                      <span className="font-medium capitalize">
                        {t.status}
                      </span>{" "}
                      · {new Date(t.at).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">
                      By: {t.by}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>

        {/* Notes */}
        <section className="rounded-2xl border bg-white p-4 shadow-sm text-sm space-y-2">
          <h2 className="text-xs font-semibold text-slate-700">Notes</h2>
          {detail.notes.length === 0 ? (
            <p className="text-xs text-slate-500">No notes yet.</p>
          ) : (
            <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
              {detail.notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          )}
        </section>

        {/* Status update – varies by role */}
        {(role === "ngo" || role === "facility") && (
          <section className="rounded-2xl border bg-white p-4 shadow-sm text-sm space-y-3">
            <h2 className="text-xs font-semibold text-slate-700">
              {role === "ngo"
                ? "Update status / add note"
                : "Confirm received"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                value={updateStatus}
                onChange={(e) =>
                  setUpdateStatus(e.target.value as Status)
                }
                disabled={role === "facility"}
                className={`rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-sm ${
                  role === "facility" ? "bg-slate-100 text-slate-500" : ""
                }`}
              >
                <option value="allocated">Allocated</option>
                <option value="dispatched">Dispatched</option>
                <option value="received">Received</option>
              </select>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder={
                  role === "facility"
                    ? "Optional: e.g. 'Confirmed received in ICU'"
                    : "Optional note, e.g. 'Courier picked up at 14:20'"
                }
                className="md:col-span-1 rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />

              <div className="flex items-end md:justify-end">
                <button
                  onClick={handleSave}
                  className={`rounded-full px-4 py-2 text-xs font-medium ${
                    canChangeStatus
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-slate-300 text-slate-600 cursor-not-allowed"
                  }`}
                >
                  {role === "facility" ? "Confirm Received" : "Save status"}
                </button>
              </div>
            </div>
          </section>
        )}

        {role === "donor" && (
          <p className="text-xs text-slate-500">
            As a donor you have **read‑only** access to this screen; only NGOs
            and facilities can update status or add operational notes.
          </p>
        )}
      </div>
    </main>
  );
}
