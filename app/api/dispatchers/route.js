import db from '../../../lib/db'; // Adjust the path based on your project structure
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log("Starting GET request for top 10 dispatchers...");

    // Query to fetch the top 10 dispatchers sorted by total_delays in descending order
    const query = `
      SELECT name, email, contact, total_delays 
      FROM dispatcher 
      ORDER BY total_delays DESC 
      LIMIT 10
    `;

    console.log("Executing query:", query);
    const result = await db.query(query);
    console.log("Query executed successfully. Result:", result.rows);

    // If no data is found, return an empty array
    if (result.rows.length === 0) {
      console.log("No dispatchers found in the database.");
      return NextResponse.json({ dispatchers: [] }, { status: 200 });
    }

    // Return the top 10 dispatchers
    console.log("Returning top 10 dispatchers...");
    console.log(result)
    return NextResponse.json({ dispatchers: result.rows }, { status: 200 });

  } catch (error) {
    console.error("Error occurred while fetching top 10 dispatchers:", error.message);
    console.error("Stack trace:", error.stack);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
