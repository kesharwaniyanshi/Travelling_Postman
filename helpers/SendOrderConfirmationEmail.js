// import OrderConfirmationEmail from "../../emails/OrderConfirmationEmail";
// import { ApiResponse } from '@/types/ApiResponse';

// export async function sendOrderConfirmationEmail(
    //   email,
    //   username,
    //   orderId,
    //   totalItems,
    //   totalCost
    // ) {
        //   try {
            //     await resend.emails.send({
                //       from: 'dev@hiteshchoudhary.com',
                //       to: email,
                //       subject: `Order Confirmation - Order ID: ${orderId}`,
                //       react: OrderConfirmationEmail({ username, orderId, totalItems, totalCost }),
                //     });
                //     return { success: true, message: 'Order confirmation email sent successfully.' };
                //   } catch (emailError) {
                    //     console.error('Error sending order confirmation email:', emailError);
                    //     return { success: false, message: 'Failed to send order confirmation email.' };
                    //   }
                    // }
                    
                    
// import { resend } from "@/lib/resend";
// import OrderConfirmationEmail from "@/emails/OrderConfirmationEmail";

// export async function SendOrderConfirmationEmail({ senderEmail, sender_user_id, orderId }) {
//   try {
//     await resend.emails.send({
//       from: "khandelwaltanmay76@gmail.com", // Replace with your sender email
//       to: senderEmail,
//       subject: "Order Confirmation",
//       react: OrderConfirmationEmail({ sender_user_id, orderId }),
//     });

//     return { success: true, message: "Order confirmation email sent successfully." };
//   } catch (error) {
//     console.error("Error sending order confirmation email:", error);
//     return { success: false, message: "Failed to send order confirmation email." };
//   }
// }





// lib/sendOrderConfirmationEmail.js
import { resend } from "@/lib/resend";
import OrderConfirmationEmail from "@/emails/OrderConfirmationEmail";

export async function SendOrderConfirmationEmail({ senderEmail, sender_user_id, orderId, cost }) {
    const resendApiKey = process.env.RESEND_API_KEY;
  
    try {
      const response = await resend.emails.send({
        from: "onboarding@resend.dev", // Replace with your sender email
        to: "khandelwaltanmay76@gmail.com", //can directly add sender_user_id here
        subject: "Order Confirmation",
        react: OrderConfirmationEmail({ sender_user_id, orderId, cost }),
        headers: {
          'Authorization': `Bearer ${resendApiKey}`, 
        },
      });
  
      console.log("Resend API Response:", response);
  
      return { success: true, message: "Order confirmation email sent successfully." };
    } catch (error) {
      console.error("Error sending order confirmation email:", error);
      return { success: false, message: "Failed to send order confirmation email." };
    }
  } 
// Example usage in your email sending function

  