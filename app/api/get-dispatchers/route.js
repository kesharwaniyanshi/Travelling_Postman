// File: /app/api/get-dispatchers/route.js

import db from "@/lib/db"; // Import your database connection

export async function GET() {
  try {
    // Query to fetch all dispatchers from the dispatchers table
    const result = await db.query(
      "SELECT dispatcher_id, name, email, contact, username, total_delays, mode, mode_number FROM dispatcher"
    );

    if (result.rows.length === 0) {
      // Return response with status 404 and a message if no dispatchers are found
      return new Response(
        JSON.stringify({ message: "No dispatchers found." }),
        { status: 404 }
      );
    }

    // Return response with status 200 and the list of dispatchers
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching dispatchers:", error);
    // Return response with status 500 and error message
    return new Response(
      JSON.stringify({ error: "Internal server error." }),
      { status: 500 }
    );
  }
}
