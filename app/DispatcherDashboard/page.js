"use client";
import React, { useState, useEffect } from "react";
import withAuth from "@/lib/withAuth";
import DispatcherNavbar from "../components/DispatcherNavbar";
import Footer from "../components/Footer";

const DispatcherDashboard = () => {
  const [username, setUsername] = useState("");
  const [orderDetails, setOrderDetails] = useState([]);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    if (role === "Dispatcher") {
      setUsername(storedUsername);
      const dispatcherId = localStorage.getItem("userId");

      fetch(`/api/dispatchertrack?dispatcherId=${dispatcherId}`)
        .then((response) => response.json())
        .then((data) => {
          const updatedOrders = data.map((order) => {
            const currentTime = new Date();
            const dropTime = new Date(order.expectedDropTime);
            const delay = Math.max(
              0,
              Math.ceil((currentTime - dropTime) / (1000 * 60 * 60 * 24))
            );
            const status = delay > 0 ? "Delayed" : "On Time";
            return { ...order, delay, status };
          });
          setOrderDetails(updatedOrders);
        })
        .catch((error) => console.error("Error fetching orders:", error));
    } else {
      window.location.href = "/Login";
    }
  }, []);

  const handleDeliveredClick = (orderId) => {
    setOrderDetails((prevOrders) =>
      prevOrders.filter((order) => order.orderId !== orderId)
    );

    fetch(`/api/deleteOrder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    })
      .then((response) => response.json())
      .catch((error) => console.error("Error deleting order:", error));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="relative bg-white shadow-md">
        <div className="flex items-center justify-center px-8 py-4">
          <h1 className="text-4xl font-bold text-red-700 text-center">
            Welcome {username}!
          </h1>
        </div>
        <div className="bg-red-700 h-4 w-full"></div>
      </header>
      <DispatcherNavbar />
      <div className="flex-grow flex flex-col items-center px-8 py-6 overflow-auto">
        <div className="h-screen bg-white shadow-xl rounded-lg w-full max-w-6xl p-6">
          <h2 className="text-3xl font-semibold text-center mb-6 text-gray-700">
            Order Details
          </h2>
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                {/* <th className="px-4 py-2 border font-semibold text-gray-600">Order ID</th> */}
                <th className="px-4 py-2 border font-semibold text-gray-600">Status</th>
                <th className="px-4 py-2 border font-semibold text-gray-600">Delay (Days)</th>
                <th className="px-4 py-2 border font-semibold text-gray-600">Drop Time</th>
                <th className="px-4 py-2 border font-semibold text-gray-600">Source Location</th>
                <th className="px-4 py-2 border font-semibold text-gray-600">Destination Location</th>
                <th className="px-4 py-2 border font-semibold text-gray-600">Current Location</th>
                <th className="px-4 py-2 border font-semibold text-gray-600">Delivered</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50 text-sm">
                  {/* <td className="px-4 py-2 border text-gray-800">{order.orderId}</td> */}
                  <td className="px-4 py-2 border text-gray-800">
                    <span
                      className={`font-semibold ${
                        order.status === "Delayed" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border text-gray-800">{order.delay}</td>
                  <td className="px-4 py-2 border text-gray-800">
                    {new Date(order.expectedDropTime).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border text-gray-800">{order.source}</td>
                  <td className="px-4 py-2 border text-gray-800">{order.destination}</td>
                  <td className="px-4 py-2 border text-gray-800">{order.currentAddress}</td>
                  <td className="px-4 py-2 border text-gray-800">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-4 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                      onClick={() => handleDeliveredClick(order.orderId)}
                      disabled={!order.canDelete}
                    >
                      Yes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* <footer className="text-sm text-center w-full mt-12 pb-6">
        <p>Contact Admin: +91 (719) 581-7902 || abc@gmail.com</p>
      </footer> */}
      <Footer/>
    </div>
  );
};

export default withAuth(DispatcherDashboard);
