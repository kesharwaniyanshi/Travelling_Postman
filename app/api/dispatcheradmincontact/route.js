import db from "@/lib/db"; // Assuming you have a database connection utility

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

    // Fetch the admin_id from Orders table
    const orderResult = await db.query(
      "SELECT admin_id FROM Orders WHERE Order_ID = $1",
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404 }
      );
    }

    const adminId = orderResult.rows[0].admin_id;

    // Fetch the email of the admin from the Admin table
    const adminResult = await db.query(
      "SELECT email FROM Admin WHERE admin_id = $1",
      [adminId]
    );

    if (adminResult.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "Admin not found" }),
        { status: 404 }
      );
    }

    const adminEmail = adminResult.rows[0].email;

    // Return the admin's email
    return new Response(
      JSON.stringify({ email: adminEmail }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching recipient email:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
