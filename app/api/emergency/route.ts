import { NextRequest, NextResponse } from 'next/server';

let nextId = 1000;

export async function POST(req: NextRequest) {
  const body = await req.json();

  const newRequest = {
    id: nextId++,
    facilityId: body.facilityId,
    itemNameOrBloodGroup: body.itemNameOrBloodGroup,
    quantityOrUnits: body.quantityOrUnits,
    priority: body.priority || 'high',
    isEmergency: body.isEmergency ?? true,
  };

  return NextResponse.json(newRequest, { status: 201 });
}

