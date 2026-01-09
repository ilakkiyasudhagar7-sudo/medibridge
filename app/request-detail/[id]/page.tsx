"use client";

import React, { useState } from "react";

type Status = "open" | "allocated" | "dispatched" | "received";

interface TimelineItem {
  status: string;
  at: string;
  by: string;
}

interface RequestDetail {
  id: number;
  priority: string;
  department: string;
  facilityName: string;
  city: string;
  currentStatus: Status;
  routeFrom: string;
  routeTo: string;
  routeNote: string;
  timeline: TimelineItem[];
  notes: string[];
}

const mockData: RequestDetail = {
  id: 501,
  priority: "High priority",
  department: "ICU",
  facilityName: "City Care Hospital",
  city: "Salem",
  currentStatus: "allocated",
  routeFrom: "Donor address / blood bank",
  routeTo: "Recipient facility",
  routeNote: "Map integration can later show live route and distance.",
  timeline: [
    { status: "Open",      at: "8/1/2026, 10:00:00 am", by: "facility" },
    { status: "Allocated", at: "9/1/2026, 9:30:00 am",  by: "ngo" },
    { status: "Dispatched",at: "9/1/2026, 2:15:00 pm",  by: "ngo" },
  ],
  notes: ["Allocated to Request #501 by NGO user 10"],
};

const statusColor: Record<Status, string> = {
  open: "bg-gray-200 text-gray-700",
  allocated: "bg-green-100 text-green-700",
  dispatched: "bg-blue-100 text-blue-700",
  received: "bg-purple-100 text-purple-700",
};

export default function RequestDetailPage() {
  const [detail] = useState<RequestDetail>(mockData);
  const [confirmStatus, setConfirmStatus] = useState<Status>("dispatched");
  const [confirmNote, setConfirmNote] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      <div className="w-6" />
      <main className="flex-1 max-w-6xl mx-auto py-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-xs font-semibold tracking-wide text-gray-500">
              REQUEST DETAIL
            </p>
            <h1 className="text-3xl font-semibold mt-1">
              Request #{detail.id}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {detail.priority}, {detail.department}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-xs text-gray-500 mb-1">Current status</p>
            <span
              className={
                "px-3 py-1 rounded-full text-xs font-medium capitalize " +
                statusColor[detail.currentStatus]
              }
            >
              {detail.currentStatus}
            </span>
          </div>
        </div>

        {/* Top cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              Key info
            </h2>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Facility:</span> {detail.facilityName}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">City:</span> {detail.city}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              Route overview
            </h2>
            <p className="text-sm text-gray-600">
              <span className="font-medium">From:</span> {detail.routeFrom}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">To:</span> {detail.routeTo}
            </p>
            <p className="text-xs text-gray-400 mt-3">
              {detail.routeNote}
            </p>
          </div>
        </div>

        {/* Status timeline */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Status timeline
          </h2>
          <ul className="space-y-2">
            {detail.timeline.map((t, idx) => (
              <li key={idx} className="flex items-start text-sm">
                <span className="mt-1 mr-3">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500" />
                </span>
                <div>
                  <p className="text-gray-800">
                    {t.status}{" "}
                    <span className="text-gray-500">· {t.at}</span>
                  </p>
                  <p className="text-xs text-gray-500">By: {t.by}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Notes
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            {detail.notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>

        {/* Confirm received */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Confirm received
          </h2>
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <div className="md:w-1/3">
              <select
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={confirmStatus}
                onChange={(e) =>
                  setConfirmStatus(e.target.value as Status)
                }
              >
                <option value="dispatched">Dispatched</option>
                <option value="received">Received</option>
              </select>
            </div>

            <div className="flex-1">
              <textarea
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 bg-gray-50 resize-none h-12 md:h-10 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Optional: e.g. 'Confirmed received in ICU'"
                value={confirmNote}
                onChange={(e) => setConfirmNote(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="md:w-40 h-10 px-5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-200 transition"
              onClick={() => {
                // call your POST /timeline API here
              }}
            >
              Confirm Received
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
