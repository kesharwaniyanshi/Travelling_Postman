import db from "@/lib/db";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    // Step 1: Parse Input
    const { dispatcherId, currentAddress, selectedRoute } = await req.json();

    if (!dispatcherId || !currentAddress || !selectedRoute) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Step 2: Fetch Order IDs from Assignment Table
    const assignmentQuery = `
      SELECT order_id 
      FROM assignment 
      WHERE dispatcher_id = $1
    `;
    const assignmentResult = await db.query(assignmentQuery, [dispatcherId]);

    if (assignmentResult.rows.length === 0) {
      return new Response(
        JSON.stringify({
          error: "No orders found for the given dispatcher ID in the assignment table.",
        }),
        { status: 404 }
      );
    }

    const orderIds = assignmentResult.rows.map(row => row.order_id);

    // Step 3: Fetch Sender and Receiver IDs from Orders Table
    const ordersQuery = `
      SELECT order_id, sender_user_id, receiver_user_id 
      FROM orders 
      WHERE order_id = ANY($1)
    `;
    const ordersResult = await db.query(ordersQuery, [orderIds]);

    if (ordersResult.rows.length === 0) {
      return new Response(
        JSON.stringify({
          error: "No orders found for the provided order IDs.",
        }),
        { status: 404 }
      );
    }

    const orders = ordersResult.rows;

    // Step 4: Fetch Emails for Sender and Receiver
    const emailPromises = orders.map(async (order) => {
      const { sender_user_id, receiver_user_id } = order;

      // Fetch sender email
      const senderEmailQuery = `
        SELECT email 
        FROM users 
        WHERE user_id = $1
      `;
      const senderResult = await db.query(senderEmailQuery, [sender_user_id]);
      const senderEmail = senderResult.rows[0]?.email || null;

      // Fetch receiver email
      const receiverEmailQuery = `
        SELECT email 
        FROM users 
        WHERE user_id = $1
      `;
      const receiverResult = await db.query(receiverEmailQuery, [
        receiver_user_id,
      ]);
      const receiverEmail = receiverResult.rows[0]?.email || null;

      return { senderEmail, receiverEmail };
    });

    const emails = await Promise.all(emailPromises);

    // Step 5: Update the Route in Database
    const updateRouteQuery = `
      UPDATE routes
      SET path = $1, source = $2
      WHERE dispatcher_id = $3
    `;
    const updateResult = await db.query(updateRouteQuery, [
      selectedRoute,
      currentAddress,
      dispatcherId,
    ]);

    if (updateResult.rowCount === 0) {
      return new Response(
        JSON.stringify({
          error: "No route found for the given dispatcher ID.",
        }),
        { status: 404 }
      );
    }

    // Step 6: Send Emails
    const emailSendingPromises = emails.map(
      async ({ senderEmail, receiverEmail }) => {
        if (senderEmail) {
          await sendRouteChangeEmail(senderEmail, selectedRoute);
        }
        if (receiverEmail) {
          await sendRouteChangeEmail(receiverEmail, selectedRoute);
        }
      }
    );

    await Promise.all(emailSendingPromises);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Route updated and emails sent successfully.",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Stack Trace:", error.stack);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

// Helper function to send emails
const sendRouteChangeEmail = async (userEmail, updatedRoute) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS, // Your Gmail app password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Route Change Notification",
    text: `Dear user,\n\nThe route for your delivery has been updated. The new route is as follows:\n\n${updatedRoute}\n\nThank you for using our services.\n\nBest regards,\nYour Logistics Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${userEmail}`);
  } catch (error) {
    console.error(`Error sending email to ${userEmail}:`, error);
  }
};
