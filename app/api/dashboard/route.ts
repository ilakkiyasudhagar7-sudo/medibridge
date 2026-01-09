import { NextRequest, NextResponse } from 'next/server';

const baseKpis = {
  totalDonations: 10,
  activeDonations: 3,
  totalRequests: 5,
  activeRequests: 2,
};

const mockData = {
  donor: {
    profile: {
      name: 'Arun Kumar',
      bloodGroup: 'O+',
      address: '12, Main Street, Vengaivasal, Chennai',
    },
    kpis: baseKpis,
    recentDonations: [
      { id: 1, itemName: 'Rice bags', quantity: 5, status: 'Active' },
      { id: 2, itemName: 'Blankets', quantity: 10, status: 'Completed' },
    ],
    recentRequests: [
      {
        id: 101,
        facilityId: 1,
        itemNameOrBloodGroup: 'O+ blood',
        quantityOrUnits: 3,
        priority: 'high',
        isEmergency: true,
      },
    ],
  },
  ngo: {
    profile: {
      name: 'Helping Hands NGO',
      address: '23 Charity Lane, Chennai',
    },
    kpis: baseKpis,
    recentDonations: [
      { id: 3, itemName: 'Medicines', quantity: 20, status: 'Pending' },
    ],
    recentRequests: [
      {
        id: 102,
        facilityId: 2,
        itemNameOrBloodGroup: 'Food packets',
        quantityOrUnits: 50,
        priority: 'medium',
        isEmergency: false,
      },
    ],
  },
  facility: {
    profile: {
      name: 'City General Hospital',
      address: '45 Hospital Road, Chennai',
    },
    kpis: baseKpis,
    recentDonations: [
      { id: 4, itemName: 'Masks', quantity: 100, status: 'Active' },
    ],
    recentRequests: [
      {
        id: 103,
        facilityId: 3,
        itemNameOrBloodGroup: 'Sanitizer bottles',
        quantityOrUnits: 30,
        priority: 'high',
        isEmergency: true,
      },
    ],
  },
} as const;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = (searchParams.get('role') || 'donor') as
    | 'donor'
    | 'ngo'
    | 'facility';

  const data = mockData[role] || mockData.donor;
  return NextResponse.json(data);
}

