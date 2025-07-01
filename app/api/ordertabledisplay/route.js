import { NextResponse } from 'next/server';
import db from "@/lib/db";

export async function POST(req) {
  const { senderCity, receiverCity } = await req.json();

  if (!senderCity || !receiverCity) {
    return NextResponse.json({ error: "Source and Destination cities are required." }, { status: 400 });
  }

  try {
    // Query the database for orders with 'pending' status matching the source and destination cities
    const query = `
      SELECT 
        order_id,
        weight,
        volume,
        preference,
        cost
      FROM orders
      WHERE current_sender_location = $1 
        AND current_receiver_location = $2
        AND status = 'Pending';  -- Filter by status 'pending'
    `;

    const values = [senderCity, receiverCity];
    
    const result = await db.query(query, values);
    console.log(result.rows);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'No pending orders found for the specified route.' }, { status: 404 });
    }

    // Return the filtered orders
    return NextResponse.json({ orders: result.rows });

  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders." }, { status: 500 });
  }
}
