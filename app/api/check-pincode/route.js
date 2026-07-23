import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pincode = searchParams.get('pincode');

  if (!pincode || pincode.length !== 6 || !/^\d+$/.test(pincode)) {
    return NextResponse.json({ deliverable: false });
  }

  try {
    const res = await fetch(`http://www.postalpincode.in/api/pincode/${pincode}`);
    const data = await res.json();

    if (data.Status === 'Success' && data.PostOffice && data.PostOffice.length > 0) {
      const firstEntry = data.PostOffice[0];
      return NextResponse.json({
        deliverable: true,
        city: firstEntry.District,
        state: firstEntry.State
      });
    } else {
      return NextResponse.json({ deliverable: false });
    }
  } catch (error) {
    console.error('Error checking pincode:', error);
    return NextResponse.json({ deliverable: false });
  }
}
