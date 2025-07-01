// app/api/send-order-confirmation/route.js
import { SendOrderConfirmationEmail } from "@/helpers/SendOrderConfirmationEmail"; // Adjust the import path if needed

export async function POST(req) {
  const { senderEmail, sender_user_id, orderId, cost } = await req.json(); // Parse the JSON body
  console.log(senderEmail, sender_user_id, orderId, cost)
  try {
    // Call the function to send the email
    const response = await SendOrderConfirmationEmail({
      senderEmail,
      sender_user_id,
      orderId,
      cost,
    });

    // Respond back to the frontend
    if (response.success) {
      return new Response(JSON.stringify({ message: response.message }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: response.message }), { status: 500 });
    }
  } catch (error) {
    console.error("Error in sending email:", error);
    return new Response(JSON.stringify({ message: "Failed to send order confirmation email." }), { status: 500 });
  }
}
