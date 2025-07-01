import db from '../../../lib/db';

export async function POST(req) {
  try {
    const body = await req.json();
    const { sender_user_id } = body;

    if (!sender_user_id) {
      return new Response(JSON.stringify({ error: "Sender User ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await db.query(
      "SELECT email FROM users WHERE user_id = $1",
      [sender_user_id]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const email = result.rows[0].email;
    return new Response(JSON.stringify({ email }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Database query error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
