"use client";

import { useParams } from "next/navigation";

type StatusEvent = {
  label: string;
  by: string;
  time: string;
};

type RequestDetail = {
  id: number;
  priority: "high" | "medium" | "low";
  unitType: string;
  facilityName: string;
  city: string;
  routeFrom: string;
  routeTo: string;
  status: "allocated" | "open" | "dispatched" | "received";
  timeline: StatusEvent[];
  notes: string[];
};

const MOCK_REQUEST: RequestDetail = {
  id: 501,
  priority: "high",
  unitType: "ICU",
  facilityName: "City Care Hospital",
  city: "Salem",
  routeFrom: "Donor address / blood bank",
  routeTo: "Recipient facility",
  status: "allocated",
  timeline: [
    {
      label: "Open",
      by: "facility",
      time: "8/1/2026, 10:00:00 am",
    },
    {
      label: "Allocated",
      by: "ngo",
      time: "9/1/2026, 9:30:00 am",
    },
    {
      label: "Dispatched",
      by: "ngo",
      time: "9/1/2026, 2:15:00 pm",
    },
  ],
  notes: ["Allocated to Request #501 by NGO user 10"],
};

export default function RequestDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  // later you can replace MOCK_REQUEST with data loaded by id
  const request = MOCK_REQUEST;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">
              Request detail
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">
              Request #{request.id}
            </h1>
            <p className="text-sm text-slate-600">
              High priority, {request.unitType}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <p className="text-xs text-slate-500">Current status</p>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              Allocated
            </span>
          </div>
        </header>

        {/* Top cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              Key info
            </h2>
            <dl className="space-y-1 text-sm text-slate-700">
              <div>
                <dt className="font-medium">Facility</dt>
                <dd>
                  {request.facilityName}
                </dd>
              </div>
              <div>
                <dt className="font-medium">City</dt>
                <dd>{request.city}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              Route overview
            </h2>
            <dl className="space-y-1 text-sm text-slate-700">
              <div>
                <dt className="font-medium">From</dt>
                <dd>{request.routeFrom}</dd>
              </div>
              <div>
                <dt className="font-medium">To</dt>
                <dd>{request.routeTo}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-slate-500">
              Map integration can later show live route and distance.
            </p>
          </div>
        </section>

        {/* Status timeline */}
        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">
            Status timeline
          </h2>
          <ul className="space-y-2 text-sm text-slate-700">
            {request.timeline.map((event, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                <div>
                  <p>
                    <span className="font-medium">{event.label}</span> ·{" "}
                    {event.time}
                  </p>
                  <p className="text-xs text-slate-500">By: {event.by}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Notes */}
        <section className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">Notes</h2>
          {request.notes.length === 0 ? (
            <p className="text-sm text-slate-500">No notes recorded.</p>
          ) : (
            <ul className="list-disc list-inside text-sm text-slate-700">
              {request.notes.map((n, idx) => (
                <li key={idx}>{n}</li>
              ))}
            </ul>
          )}
        </section>

        {/* Confirm received */}
        <section className="rounded-2xl border bg-white p-5 shadow-sm space-y-3">
          <h2 className="text-sm font-semibold text-slate-800">
            Confirm received
          </h2>
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
            <select
              className="w-full md:w-60 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-500"
              defaultValue="Dispatched"
            >
              <option value="Dispatched">Dispatched</option>
              <option value="Received">Received</option>
            </select>
            <textarea
              className="flex-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-500"
              rows={2}
              placeholder="Optional: e.g. 'Confirmed received in ICU'"
            />
            <button className="rounded-full bg-slate-700 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800">
              Confirm Received
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
