"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Logo from "/public/Logo.png";
import Navbar from "../components/Navbar";
import withAuth from "@/lib/withAuth";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController,
} from "chart.js";
import { useRouter } from "next/navigation";
import DispatchersCard from "../components/DispatchersCard";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController);

const AdminDashboard = () => {
  const [username, setUsername] = useState("");
  const [delayData, setDelayData] = useState([]);
  const chartRef = useRef(null);
  const router = useRouter();
  let chartInstance = useRef(null);

  // Fetch user data and dispatchers when component mounts
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");
    if (storedRole === "Admin" && storedUsername) {
      setUsername(storedUsername);
      fetchDispatcherData();
    } else {
      router.push("/Login");
    }
  }, []);

  // Fetch dispatcher data from the API
  const fetchDispatcherData = async () => {
    try {
      const response = await fetch("/api/dispatchers");
      console.log("Response object:", response);

      if (!response.ok) {
        console.error(`HTTP Error: ${response.status}`);
        return;
      }

      const { dispatchers } = await response.json();
      console.log("Parsed Dispatchers:", dispatchers);

      setDelayData(dispatchers);
    } catch (error) {
      console.error("Error fetching dispatcher data:", error);
    }
  };

  useEffect(() => {
    if (chartRef.current && delayData?.length > 0) {
      const ctx = chartRef.current.getContext("2d");
  
      if (chartInstance.current) {
        chartInstance.current.destroy(); // Destroy previous chart instance to avoid duplicate charts
      }
  
      chartInstance.current = new ChartJS(ctx, {
        type: "bar",
        data: {
          labels: delayData.map((item) => item.name),
          datasets: [
            {
              label: "Delay in Days",
              data: delayData.map((item) => item.total_delays), // Use correct field
              backgroundColor: "rgba(54, 162, 235, 0.8)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Top 10 Dispatchers by Delay",
              font: {
                size: 18,
              },
            },
            tooltip: {
              callbacks: {
                afterBody: (tooltipItems) => {
                  const dispatcher = delayData[tooltipItems[0].dataIndex];
                  return `Phone: ${dispatcher.contact}\nEmail: ${dispatcher.email}`;
                },
              },
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              titleFont: {
                size: 14,
              },
              bodyFont: {
                size: 12,
              },
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
          onClick: (event, elements) => {
            if (elements.length > 0) {
              const index = elements[0].index;
              const selectedDispatcher = delayData[index];
              router.push(`/DispatcherMail?email=${selectedDispatcher.email}`);
            }
          },
        },
      });
    }
  }, [delayData]); // Run effect whenever delayData changes
  

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="relative bg-white">
        <div className="flex items-center justify-center px-8 py-8 relative">
          <div className="absolute left-4">
            <Image src={Logo} alt="Postman Logo" width={120} height={120} />
          </div>
          <h1 className="text-4xl font-bold text-red-700 text-center">Welcome {username}!</h1>
        </div>
      </header>
      <Navbar />
      <div className="flex-grow flex gap-6 px-8 py-4 overflow-auto">
        <div className="flex-1 bg-white shadow-xl rounded-lg p-6">
          <div className="w-full" style={{ height: "400px" }}>
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
        {/* Right Section: Stats */}
        <div className="flex-1 grid grid-cols-2 gap-6">
          {/* Card 1: Total Deliveries Completed */}
          <div className="flex flex-col justify-center bg-white shadow-xl rounded-lg p-6 text-center transform hover:scale-105 transition duration-300 ease-in-out">
            <h3 className="text-2xl font-semibold text-gray-700">Total Deliveries Completed</h3>
            <p className="text-4xl font-bold text-green-600">4357</p>
          </div>

          {/* Card 2: Pending Deliveries */}
          <div className="flex flex-col justify-center bg-white shadow-xl rounded-lg p-6 text-center transform hover:scale-105 transition duration-300 ease-in-out">
            <h3 className="text-2xl font-semibold text-gray-700">Pending Deliveries</h3>
            <p className="text-4xl font-bold text-red-600">870</p>
          </div>

          {/* Card 3: Average Delivery Time */}
          <div className="flex flex-col justify-center bg-white shadow-xl rounded-lg p-6 text-center transform hover:scale-105 transition duration-300 ease-in-out">
            <h3 className="text-2xl font-semibold text-gray-700">Average Delivery Time</h3>
            <p className="text-4xl font-bold text-purple-600">35 hours/order</p>
          </div>

          {/* Card 4: New Dispatchers */}
          <div className="flex flex-col justify-center bg-white shadow-xl rounded-lg p-6 text-center transform hover:scale-105 transition duration-300 ease-in-out">
            {/* <h3 className="text-2xl font-semibold text-gray-700">New Dispatchers</h3>
             */}
             <DispatchersCard />
            {/* <p className="text-4xl font-bold text-blue-600">12</p> */}
          </div>
        </div>
      </div>  

      {/* Footer */}
      <footer className="text-sm text-center w-full mt-4">
        <div className="mb-4">
          <p>Contact Us: +91 (719) 581-7902 || abc@gmail.com</p>
        </div>
        <div className="bg-red-700 h-4 w-full"></div>
      </footer>
    </div>
  );
};

export default withAuth(AdminDashboard);
