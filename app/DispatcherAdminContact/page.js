"use client";
import { useState } from "react";

export default function DispatcherAdminContact() {
  const [formData, setFormData] = useState({
    recipient: "",
    subject: "",
    message: "",
  });
  const [orderId, setOrderId] = useState(""); // State to store orderId
  const [responseMessage, setResponseMessage] = useState("");

  // Handle change for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle change for orderId input
  const handleOrderIdChange = (e) => {
    setOrderId(e.target.value);
  };

  // Fetch recipient email based on orderId
  const fetchRecipientEmail = async () => {
    try {
      const response = await fetch(`/api/dispatcheradmincontact?orderId=${orderId}`);
      const data = await response.json();

      if (response.ok) {
        setFormData((prevData) => ({
          ...prevData,
          recipient: data.email, // Set the recipient email
        }));
      } else {
        setResponseMessage(data.error || "Failed to fetch recipient email.");
      }
    } catch (error) {
      console.error("Error fetching recipient email:", error);
      setResponseMessage("Failed to fetch recipient email. Please try again.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResponseMessage(data.message);
    } catch (error) {
      console.error("Error sending email:", error);
      setResponseMessage("Failed to send email. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="bg-white text-gray-800 rounded-lg shadow-2xl  p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Contact Form</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="orderId" className="block text-sm font-medium">
              Order ID
            </label>
            <input
              type="text"
              id="orderId"
              name="orderId"
              placeholder="Enter Order ID"
              value={orderId}
              onChange={handleOrderIdChange}
              required
              className="mt-1 w-full p-3 rounded-lg border border-gray-200 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="button"
              onClick={fetchRecipientEmail}
              className="mt-2 w-full py-3 px-6 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Fetch Recipient Email
            </button>
          </div>
          <div>
            <label htmlFor="recipient" className="block text-sm font-medium">
              Recipient Email
            </label>
            <input
              type="email"
              id="recipient"
              name="recipient"
              placeholder="Recipient's email"
              value={formData.recipient}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 rounded-lg border border-gray-200 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              placeholder="Enter subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 rounded-lg border border-gray-200 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Enter your message"
              value={formData.message}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 h-32 rounded-lg border border-gray-200 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Send Email
          </button>
        </form>
        {responseMessage && (
          <p className="mt-4 text-center text-sm text-gray-400">
            {responseMessage}
          </p>
        )}
      </div>
    </div>
  );
}
