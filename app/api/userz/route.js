import db from '../../../lib/db';
import nodemailer from 'nodemailer';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orderIdsParam = searchParams.get("orderIds");

    if (!orderIdsParam) {
      return new Response(JSON.stringify({ error: "Order IDs are required" }), {
        status: 400,
      });
    }

    // Convert `orderIds` to an array
    const orderIdsArray = orderIdsParam.split(',');

    // Fetch order details for the provided order IDs
    const orderQuery = `
      SELECT order_id, sender_user_id, receiver_user_id 
      FROM orders 
      WHERE order_id = ANY($1)
    `;
    const orderResult = await db.query(orderQuery, [orderIdsArray]);

    if (orderResult.rows.length === 0) {
      return new Response(JSON.stringify({ error: "No orders found" }), {
        status: 404,
      });
    }

    // Prepare emails for the users associated with each order
    const ordersWithUserEmails = await Promise.all(
      orderResult.rows.map(async (order) => {
        const { sender_user_id, receiver_user_id } = order;

        // Fetch sender email
        const senderEmail = await fetchUserEmail(sender_user_id);

        // Fetch receiver email
        const receiverEmail = await fetchUserEmail(receiver_user_id);

        // Send appreciation emails
        if (senderEmail) await sendAppreciationEmail(senderEmail);
        if (receiverEmail) await sendAppreciationEmail(receiverEmail);

        return {
          order_id: order.order_id,
          sender_email: senderEmail || "Sender email not found",
          receiver_email: receiverEmail || "Receiver email not found",
        };
      })
    );

    return new Response(JSON.stringify(ordersWithUserEmails), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching order or user data:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

const fetchUserEmail = async (userId) => {
  try {
    const userQuery = `
      SELECT email 
      FROM users 
      WHERE user_id = $1
    `;
    const result = await db.query(userQuery, [userId]);
    return result.rows[0]?.email || null;
  } catch (error) {
    console.error(`Error fetching email for user ID ${userId}:`, error);
    return null;
  }
};

const sendAppreciationEmail = async (userEmail) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER, 
    to: userEmail, 
    subject: 'Thank You for Using Travelling Postman',
    text: `Dear user,\n\nThank you for using our Travelling Postman. We appreciate your business and look forward to serving you again in the future.\n\nBest regards,\nYour Travelling Postman`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Appreciation email sent to ${userEmail}`);
  } catch (error) {
    console.error(`Error sending email to ${userEmail}:`, error);
  }
};
