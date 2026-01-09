'use client';

import { useEffect, useState } from 'react';

export type Role = 'donor' | 'ngo' | 'facility';

type Kpis = {
  totalDonations: number;
  activeDonations: number;
  totalRequests: number;
  activeRequests: number;
};

type Donation = {
  id: number;
  itemName: string;
  quantity: number;
  status: string;
};

type RequestItem = {
  id: number;
  facilityId: number;
  itemNameOrBloodGroup: string;
  quantityOrUnits: number;
  priority: 'low' | 'medium' | 'high';
  isEmergency: boolean;
};

type DashboardData = {
  profile?: {
    name?: string;
    bloodGroup?: string; // donor only
    address?: string;
  };
  kpis: Kpis;
  recentDonations: Donation[];
  recentRequests: RequestItem[];
};

const API_BASE = '';

export default function DashboardView({ role }: { role: Role }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [facilityId, setFacilityId] = useState('');
  const [itemNameOrBloodGroup, setItemNameOrBloodGroup] = useState('');
  const [quantityOrUnits, setQuantityOrUnits] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('high');
  const [isEmergency, setIsEmergency] = useState(true);
  const [emergencySubmitting, setEmergencySubmitting] = useState(false);
  const [emergencyMessage, setEmergencyMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/dashboard?role=${role}`, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('Failed to load dashboard');
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [role]);

  const handleEmergencySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmergencyMessage(null);

    if (!facilityId || !itemNameOrBloodGroup || !quantityOrUnits) {
      setEmergencyMessage('Please fill all required fields.');
      return;
    }

    setEmergencySubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/emergency`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facilityId: Number(facilityId),
          itemNameOrBloodGroup,
          quantityOrUnits: Number(quantityOrUnits),
          priority,
          isEmergency,
        }),
      });

      if (!res.ok) throw new Error('Failed to create emergency request');

      const created: RequestItem = await res.json();
      setEmergencyMessage(`Emergency request created with ID ${created.id}.`);

      setData((prev) =>
        prev
          ? { ...prev, recentRequests: [created, ...prev.recentRequests] }
          : prev,
      );

      setFacilityId('');
      setItemNameOrBloodGroup('');
      setQuantityOrUnits('');
      setPriority('high');
      setIsEmergency(true);
    } catch (err: any) {
      setEmergencyMessage(err.message || 'Failed to submit emergency request.');
    } finally {
      setEmergencySubmitting(false);
    }
  };

  const title =
    role === 'donor'
      ? 'Donor dashboard'
      : role === 'ngo'
      ? 'NGO dashboard'
      : 'Facility dashboard';

  return (
    <main className="min-h-screen w-full bg-white text-black flex justify-center">
      <div className="w-full max-w-6xl px-4 py-8 space-y-8">
        {/* Top bar with title and role-specific buttons */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">{title}</h1>

          {/* Donor: Donation Status + My Donations */}
          {role === 'donor' && (
            <div className="flex gap-2">
              <button className="bg-blue-600 text-white px-3 py-1.5 rounded shadow-md text-sm hover:bg-blue-700">
                Donation Status
              </button>
              <button className="bg-blue-600 text-white px-3 py-1.5 rounded shadow-md text-sm hover:bg-blue-700">
                My Donations
              </button>
            </div>
          )}

          {/* NGO: Coordinate, Request Status, Donation Status */}
          {role === 'ngo' && (
            <div className="flex gap-2">
              <button className="bg-blue-600 text-white px-3 py-1.5 rounded shadow-md text-sm hover:bg-blue-700">
                Coordinate
              </button>
              <button className="bg-blue-600 text-white px-3 py-1.5 rounded shadow-md text-sm hover:bg-blue-700">
                Request Status
              </button>
              <button className="bg-blue-600 text-white px-3 py-1.5 rounded shadow-md text-sm hover:bg-blue-700">
                Donation Status
              </button>
            </div>
          )}

          {/* Facility: Request Status + Add request */}
          {role === 'facility' && (
            <div className="flex gap-2">
              <button className="bg-blue-600 text-white px-3 py-1.5 rounded shadow-md text-sm hover:bg-blue-700">
                Request Status
              </button>
              <button className="bg-blue-600 text-white px-3 py-1.5 rounded shadow-md text-sm hover:bg-blue-700">
                Add request
              </button>
            </div>
          )}
        </div>

        {/* Profile sections */}
        {data && data.profile && role === 'donor' && (
          <section className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Donor name</p>
            <p className="text-lg font-semibold">{data.profile.name}</p>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Blood group</p>
                <p className="text-base font-medium">
                  {data.profile.bloodGroup}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="text-base font-medium">{data.profile.address}</p>
              </div>
            </div>
          </section>
        )}

        {data && data.profile && role === 'ngo' && (
          <section className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">NGO name</p>
            <p className="text-lg font-semibold">{data.profile.name}</p>

            <div className="mt-3">
              <p className="text-sm text-gray-600">NGO address</p>
              <p className="text-base font-medium">{data.profile.address}</p>
            </div>
          </section>
        )}

        {data && data.profile && role === 'facility' && (
          <section className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Facility name</p>
            <p className="text-lg font-semibold">{data.profile.name}</p>

            <div className="mt-3">
              <p className="text-sm text-gray-600">Facility address</p>
              <p className="text-base font-medium">{data.profile.address}</p>
            </div>
          </section>
        )}

        {loading && <p>Loading dashboard...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {data && (
          <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Total donations', value: data.kpis.totalDonations },
              { label: 'Active donations', value: data.kpis.activeDonations },
              { label: 'Total requests', value: data.kpis.totalRequests },
              { label: 'Active requests', value: data.kpis.activeRequests },
            ].map((card) => (
              <div
                key={card.label}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <p className="text-sm text-gray-600">{card.label}</p>
                <p className="mt-2 text-2xl font-semibold">{card.value}</p>
              </div>
            ))}
          </section>
        )}

        {data && (
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Recent donations</h2>
            <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
              {data.recentDonations.length === 0 ? (
                <p>No recent donations.</p>
              ) : (
                <table className="min-w-full border text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1 text-left">ID</th>
                      <th className="border px-2 py-1 text-left">Item</th>
                      <th className="border px-2 py-1 text-left">Quantity</th>
                      <th className="border px-2 py-1 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentDonations.map((d) => (
                      <tr key={d.id}>
                        <td className="border px-2 py-1">{d.id}</td>
                        <td className="border px-2 py-1">{d.itemName}</td>
                        <td className="border px-2 py-1">{d.quantity}</td>
                        <td className="border px-2 py-1">{d.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {/* Recent requests: hidden on donor, shown on NGO + facility */}
        {data && role !== 'donor' && (
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Recent requests</h2>
            <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
              {data.recentRequests.length === 0 ? (
                <p>No recent requests.</p>
              ) : (
                <table className="min-w-full border text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1 text-left">ID</th>
                      <th className="border px-2 py-1 text-left">Facility</th>
                      <th className="border px-2 py-1 text-left">
                        Item / Blood
                      </th>
                      <th className="border px-2 py-1 text-left">
                        Qty / Units
                      </th>
                      <th className="border px-2 py-1 text-left">Priority</th>
                      <th className="border px-2 py-1 text-left">
                        Emergency
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentRequests.map((r) => (
                      <tr key={r.id}>
                        <td className="border px-2 py-1">{r.id}</td>
                        <td className="border px-2 py-1">{r.facilityId}</td>
                        <td className="border px-2 py-1">
                          {r.itemNameOrBloodGroup}
                        </td>
                        <td className="border px-2 py-1">
                          {r.quantityOrUnits}
                        </td>
                        <td className="border px-2 py-1">
                          {r.priority.toUpperCase()}
                        </td>
                        <td className="border px-2 py-1">
                          {r.isEmergency ? 'Yes' : 'No'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {/* Emergency form only for facilities */}
        {role === 'facility' && (
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Create emergency request</h2>
            <div className="bg-white rounded-lg shadow-md p-4">
              <form onSubmit={handleEmergencySubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium">
                    Facility ID (number)
                  </label>
                  <input
                    type="number"
                    value={facilityId}
                    onChange={(e) => setFacilityId(e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Item name or blood group
                  </label>
                  <input
                    type="text"
                    value={itemNameOrBloodGroup}
                    onChange={(e) => setItemNameOrBloodGroup(e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                    placeholder="O+ blood, rice bags, blankets..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Quantity / units
                  </label>
                  <input
                    type="number"
                    value={quantityOrUnits}
                    onChange={(e) => setQuantityOrUnits(e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) =>
                      setPriority(
                        e.target.value as 'low' | 'medium' | 'high',
                      )
                    }
                    className="border rounded px-2 py-1 w-full"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="isEmergency"
                    type="checkbox"
                    checked={isEmergency}
                    onChange={(e) => setIsEmergency(e.target.checked)}
                  />
                  <label htmlFor="isEmergency" className="text-sm">
                    Mark as emergency
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={emergencySubmitting}
                  className="bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700 disabled:opacity-60"
                >
                  {emergencySubmitting
                    ? 'Submitting...'
                    : 'Submit emergency request'}
                </button>
              </form>

              {emergencyMessage && (
                <p className="text-sm mt-2">{emergencyMessage}</p>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}


