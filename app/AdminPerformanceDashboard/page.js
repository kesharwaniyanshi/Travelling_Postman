"use client";
import React, { useState, useEffect, useRef } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import withAuth from "@/lib/withAuth";
import Logo from "/public/Logo.png";
import Image from "next/image";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
import {
  Chart as ChartJS,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useRouter } from "next/navigation";

// Register the required components
ChartJS.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const AdminPerformanceDashboard = () => {
  const [username, setUsername] = useState("");
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [randomData, setRandomData] = useState([]);
const route=useRouter();
  // Function to generate random dispatcher data
  const generateRandomData = () => {
    let data = [];
    for (let i = 0; i < 10; i++) {
      // Generate random dispatcher ID (e.g., D1, D2, ...)
      const dispatcherId = `D${Math.floor(Math.random() * 100)}`;
      // Generate a random delay value between 1 and 100
      const delay = Math.floor(Math.random() * 10) + 1;
      data.push({ dispatcherId, delay });
    }
    return data;
  };

  useEffect(() => {
    // Retrieve the username from localStorage
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");
    if (storedRole === "Admin" && storedUsername) {
      setUsername(storedUsername);
    } else {
      route.push("/Login");
    }
    // Generate and sort random data
    let data = generateRandomData();
    data = data.sort((a, b) => b.delay - a.delay); // Sort by delay in descending order
    setRandomData(data);

    // Initialize Chart.js bar chart
    const ctx = chartRef.current.getContext("2d");

    // Destroy existing chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new ChartJS(ctx, {
      type: "bar",
      data: {
        labels: data.map(item => item.dispatcherId), // Use dispatcher IDs as labels
        datasets: [
          {
            label: "Delays",
            data: data.map(item => item.delay), // Use delays for the chart data
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Number of Delays by Dispatcher ID",
          },
        },
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Fixed Header and Navbar */}
      <header className="relative bg-white">
        <div className="flex items-center justify-center px-8 py-8 relative">
          {/* Logo */}
          <div className="absolute left-4">
            <Image src={Logo} alt="Postman Logo" width={120} height={120} />
          </div>
          <h1 className="text-4xl font-bold text-red-700 text-center">
            Welcome {username}
          </h1>
        </div>
        {/* <div className="bg-red-700 h-4 w-full"></div> */}
      </header>
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6 grid grid-cols-2 gap-4">
        {/* Left Section */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <canvas ref={chartRef}></canvas>
        </div>

        {/* Right Section */}
        <div className="bg-white p-6 shadow-md rounded-lg grid grid-cols-2 gap-4">
          {/* Card 1: Total Orders Delivered */}
          <div className="flex flex-col bg-gray-100 p-6 rounded-lg shadow-md justify-center items-center">
            <h2 className="font-bold text-2xl">Total Orders Delivered</h2>
            <p className="text-4xl font-bold text-green-600">8,500</p>
          </div>

          {/* Card 2: Total Users */}
          <div className="flex flex-col bg-gray-100 p-6 rounded-lg shadow-md justify-center items-center">
            <h2 className="font-bold text-2xl">Total Users</h2>
            <p className="text-4xl font-bold text-blue-600">1,250</p>
          </div>

          {/* Card 3: Revenue Generated */}
          <div className="flex flex-col bg-gray-100 p-6 rounded-lg shadow-md justify-center items-center">
            <h2 className="font-bold text-2xl">Revenue Generated</h2>
            <p className="text-4xl font-bold text-yellow-600">$120,000</p>
          </div>

          {/* Card 4: Number of Access Points */}
          <div className="flex flex-col bg-gray-100 p-6 rounded-lg shadow-md justify-center items-center">
            <h2 className="font-bold text-2xl">Number of Access Points</h2>
            <p className="text-4xl font-bold text-red-600">42</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default withAuth(AdminPerformanceDashboard);
