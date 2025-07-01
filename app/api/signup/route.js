import bcrypt from "bcryptjs";
import db from "../../../lib/db";

export async function POST(req) {
  try {
    const {
      role,
      name,
      email,
      contact, 
      username,
      password,
      address,
      current_location, // Changed field
    } = await req.json();

    console.log("Incoming request data:", {
      role,
      name,
      email,
      contact,
      username,
      password,
      address,
      current_location,
    });

    // Validate required fields
    if (!role || !name || !email || !contact || !username || !password) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    // Role-specific validation
    if (role === "User" && !address) {
      return new Response(
        JSON.stringify({ error: "Address is required for User role" }),
        { status: 400 }
      );
    }

    if (role === "Dispatcher" && !current_location) {
      return new Response(
        JSON.stringify({
          error: "Current location is required for Dispatcher role",
        }),
        { status: 400 }
      );
    }

    // Check if username already exists in any table
    const userExists = await db.query(
      `
      SELECT username FROM users WHERE username = $1
      UNION ALL
      SELECT username FROM admin WHERE username = $1
      UNION ALL
      SELECT username FROM dispatcher WHERE username = $1
    `,
      [username]
    );

    if (userExists.rows.length > 0) {
      return new Response(
        JSON.stringify({ error: "Username already exists" }),
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into the appropriate table
    let query = "";
    let values = [];

    if (role === "User") {
      query = `
        INSERT INTO users (name, email, contact, username, password, address) 
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      values = [name, email, contact, username, hashedPassword, address];
    } else if (role === "Admin") {
      query = `
        INSERT INTO admin (name, email, contact, username, password) 
        VALUES ($1, $2, $3, $4, $5)
      `;
      values = [name, email, contact, username, hashedPassword];
    } else if (role === "Dispatcher") {
      query = `
        INSERT INTO dispatcher (name, email, contact, username, password, current_location) 
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      values = [
        name,
        email,
        contact,
        username,
        hashedPassword,
        current_location, // Updated to include current_location
      ];
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid role specified" }),
        { status: 400 }
      );
    }

    // Execute the query
    await db.query(query, values);

    return new Response(
      JSON.stringify({ message: "User created successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during sign up:", error);
    return new Response(
      JSON.stringify({ error: "Failed to sign up" }),
      { status: 500 }
    );
  }
}
