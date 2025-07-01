import db from "@/lib/db"; // Assuming you have a database connection utility

// Handle GET and POST requests
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: "Order ID is required" }),
        { status: 400 }
      );
    }

    // Fetch order details from the database, including cost
    const result = await db.query(
      "SELECT * FROM Orders WHERE Order_ID = $1",
      [orderId]
    );

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ order: result.rows[0] }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const {
      sender_user_id,
      senderCity,
      weight,
      volume,
      preference,
      receiver_user_id,
      receiverCity,
      cost, // Add cost to the incoming request
      userId, // Get the userId from the request body
    } = await req.json();

    // Log the received data to debug
    console.log("Received data:", {
      sender_user_id,
      senderCity,
      weight,
      volume,
      preference,
      receiver_user_id,
      receiverCity,
      cost,
      userId, // Log userId for debugging
    });

    // Validate required fields, including cost and userId
    if (
      !sender_user_id ||
      !senderCity ||
      !weight ||
      !volume ||
      !preference ||
      !receiver_user_id ||
      !receiverCity ||
      !cost ||
      !userId // Ensure userId is provided
    ) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    // Insert the new parcel into the database, including userId
    const result = await db.query(
      `INSERT INTO Orders (sender_user_id, current_sender_location, weight, volume, preference, receiver_user_id, current_receiver_location, cost, admin_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING Order_ID`,
      [
        sender_user_id,
        senderCity,
        weight,
        volume, // Assuming 'volume' refers to dimensions (LxWxH)
        preference,
        receiver_user_id,
        receiverCity,
        cost, // Insert the cost value
        userId, // Insert userId here
      ]
    );

    const orderId = result.rows[0].order_id;

    return new Response(
      JSON.stringify({
        message: "Parcel added successfully",
        orderId,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding parcel:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

