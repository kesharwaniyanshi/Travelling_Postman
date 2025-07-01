import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password, role } = body; // Added `role` to the input

    if (!username || !password || !role) {
      return NextResponse.json(
        { error: 'Username, password, and role are required' },
        { status: 400 }
      );
    }

    // Determine the query based on the role
    let query = '';
    if (role === 'User') {
      query = `SELECT user_id AS id, username, password, 'User' AS role FROM users WHERE username = $1`;
    } else if (role === 'Admin') {
      query = `SELECT admin_id AS id, username, password, 'Admin' AS role FROM admin WHERE username = $1`;
    } else if (role === 'Dispatcher') {
      query = `SELECT dispatcher_id AS id, username, password, 'Dispatcher' AS role FROM dispatcher WHERE username = $1`;
    } else {
      return NextResponse.json({ error: 'Invalid role specified' }, { status: 400 });
    }

    // Execute the role-specific query
    const result = await db.query(query, [username]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = result.rows[0];
    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Set the cookie
    const cookieHeader = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600,
      path: '/',
    });

    // Return success response
    return NextResponse.json(
      {
        message: 'Authentication successful',
        username: user.username,
        userId: user.id, // Include userId in the response
        role: user.role,
        token, // Optional: for client-side use if necessary
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': cookieHeader,
        },
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to authenticate' }, { status: 500 });
  }
}
