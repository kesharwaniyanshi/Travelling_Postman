// "use client";

// import React, { useState, useEffect } from "react";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import Papa from "papaparse"; // Import Papa for CSV parsing
// import { useRouter } from "next/navigation";

// export default function SignUp() {
//   const [role, setRole] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [contact, setContact] = useState("");
//   const [address, setAddress] = useState("");
//   const [current_location, setcurrent_location] = useState("");
//   const [cities, setCities] = useState([]); // Cities state

//   const router = useRouter();

//   // Load cities dynamically from CSV
//   useEffect(() => {
//     const loadCities = async () => {
//       try {
//         const response = await fetch("/data/Indian_cities.csv");
//         const csvText = await response.text();
//         const { data } = Papa.parse(csvText, { header: true });
//         setCities(data.map((city) => city.City)); // Map to extract city names
//       } catch (error) {
//         console.error("Error reading cities file:", error);
//       }
//     };

//     loadCities();
//   }, []);

//   const handleSignUp = async () => {
//     // Check if passwords match
//     if (password !== confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }

//     try {
//       const additionalFields =
//         role === "User"
//           ? { address }
//           : role === "Dispatcher"
//           ? { current_location }
//           : {};

//       const response = await fetch("/api/signup", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           role,
//           name,
//           email,
//           contact,
//           username,
//           password,
//           ...additionalFields,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         alert("User created successfully!");
//         router.push("/Login");
//       } else {
//         alert(`Error: ${data.error}`);
//       }
//     } catch (error) {
//       console.error("Error during sign up:", error);
//       alert("Failed to sign up");
//     }
//   };

//   const navigateToLogin = () => {
//     router.push("/Login");
//   };

//   return (
//     <div className="bg-white flex flex-col items-center justify-between min-h-screen">
//       <Header />

//       <div className="w-full max-w-md bg-opacity-60 bg-white p-8 rounded-xl shadow-lg mb-5">
//         <div className="mb-5">
//           <label htmlFor="role" className="block text-lg mb-2 font-semibold">
//             Choose Role
//           </label>
//           <select
//             id="role"
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//             className="border border-gray-300 rounded px-4 py-2 w-full"
//           >
//             <option value="" disabled>
//               Select a role
//             </option>
//             <option value="User">User</option>
//             <option value="Admin">Admin</option>
//             <option value="Dispatcher">Dispatcher</option>
//           </select>
//         </div>

//         <div className="mb-5">
//           <label htmlFor="name" className="block text-lg mb-2 font-semibold">
//             Full Name
//           </label>
//           <input
//             id="name"
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Enter your full name"
//             className="border border-gray-300 rounded px-4 py-2 w-full"
//           />
//         </div>

//         <div className="mb-5">
//           <label htmlFor="email" className="block text-lg mb-2 font-semibold">
//             Email
//           </label>
//           <input
//             id="email"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Enter your email"
//             className="border border-gray-300 rounded px-4 py-2 w-full"
//           />
//         </div>

//         <div className="mb-5">
//           <label htmlFor="contact" className="block text-lg mb-2 font-semibold">
//             Contact Number
//           </label>
//           <input
//             id="contact"
//             type="text"
//             value={contact}
//             onChange={(e) => setContact(e.target.value)}
//             placeholder="Enter your contact number"
//             className="border border-gray-300 rounded px-4 py-2 w-full"
//           />
//         </div>

//         {role === "User" && (
//           <div className="mb-5">
//             <label htmlFor="address" className="block text-lg mb-2 font-semibold">
//               Address
//             </label>
//             <input
//               id="address"
//               type="text"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//               placeholder="Enter your address"
//               className="border border-gray-300 rounded px-4 py-2 w-full"
//             />
//           </div>
//         )}

//         {role === "Dispatcher" && (
//           <div className="mb-5">
//             <label htmlFor="city" className="block text-lg mb-2 font-semibold">
//               City
//             </label>
//             <select
//               id="city"
//               value={current_location}
//               onChange={(e) => setcurrent_location(e.target.value)}
//               className="border border-gray-300 rounded px-4 py-2 w-full"
//             >
//               <option value="" disabled>
//                 Select your city
//               </option>
//               {cities.map((city, index) => (
//                 <option key={index} value={city}>
//                   {city}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         <div className="mb-5">
//           <label
//             htmlFor="username"
//             className="block text-lg mb-2 font-semibold"
//           >
//             Username
//           </label>
//           <input
//             id="username"
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             placeholder="Enter your username"
//             className="border border-gray-300 rounded px-4 py-2 w-full"
//           />
//         </div>

//         <div className="mb-5">
//           <label
//             htmlFor="password"
//             className="block text-lg mb-2 font-semibold"
//           >
//             Password
//           </label>
//           <input
//             id="password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Enter your password"
//             className="border border-gray-300 rounded px-4 py-2 w-full"
//           />
//         </div>

//         <div className="mb-5">
//           <label
//             htmlFor="confirmPassword"
//             className="block text-lg mb-2 font-semibold"
//           >
//             Confirm Password
//           </label>
//           <input
//             id="confirmPassword"
//             type="password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             placeholder="Confirm your password"
//             className="border border-gray-300 rounded px-4 py-2 w-full"
//           />
//         </div>

//         <div className="flex justify-center space-x-4 mb-5">
//           <button
//             onClick={handleSignUp}
//             className="bg-red-700 text-white px-6 py-2 rounded-lg text-lg"
//           >
//             Sign Up
//           </button>
//         </div>

//         <div className="text-center">
//           <p className="text-sm">
//             Already have an account?{" "}
//             <button
//               onClick={navigateToLogin}
//               className="text-red-700 font-semibold"
//             >
//               Login here
//             </button>
//           </p>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }


"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Papa from "papaparse"; // Import Papa for CSV parsing
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [current_location, setcurrent_location] = useState("");
  const [cities, setCities] = useState([]); // Cities state

  const router = useRouter();

  // Load cities dynamically from CSV
  useEffect(() => {
    const loadCities = async () => {
      try {
        const response = await fetch("/data/Indian_cities.csv");
        const csvText = await response.text();
        const { data } = Papa.parse(csvText, { header: true });
        setCities(data.map((city) => city.City)); // Map to extract city names
      } catch (error) {
        console.error("Error reading cities file:", error);
      }
    };

    loadCities();
  }, []);

  const handleSignUp = async () => {
    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const additionalFields =
        role === "User"
          ? { address }
          : role === "Dispatcher"
            ? { current_location }
            : {};

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          name,
          email,
          contact,
          username,
          password,
          ...additionalFields,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("User created successfully!");
        router.push("/Login");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      alert("Failed to sign up");
    }
  };

  const navigateToLogin = () => {
    router.push("/Login");
  };

  return (
    <div className="relative overflow-y-auto bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-between min-h-screen">
      <div className="absolute inset-0 -z-10">
        <div className="w-96 h-96 bg-red-500 rounded-full absolute top-10 left-1/4 animate-pulse opacity-40"></div>
        <div className="w-80 h-80 bg-yellow-500 rounded-full absolute bottom-20 right-1/3 animate-bounce opacity-30"></div>
        <div className="w-64 h-64 bg-blue-500 rounded-full absolute top-1/3 right-1/4 animate-spin-slow opacity-20"></div>
      </div>

      <Header />

      <div className="w-full max-w-4xl bg-white bg-opacity-90 p-8 rounded-xl shadow-2xl mt-8">


        <h1 className="text-3xl font-bold text-center text-red-700 mb-2">Welcome!</h1>
        {/* <h2 className="text-lg text-center text-gray-400 mb-4">Login to continue</h2> */}
        <div className="flex flex-col md:flex-row items-center">
          {/* Image Section */}
          <div className="w-full md:w-1/2 p-4 flex justify-center">
            <img src="/delivery-person-holding-package2.png" alt="Home Delivery" className="w-full max-w-sm rounded-lg " />
          </div>

          {/* Form Section */}
          <div className="w-full md:w-1/2 p-4">

            {/* form */}
            <div className="w-full flex flex-row gap-1">
            <div className="w-1/2 mb-3">
              <label htmlFor="role" className="block text-md mb-2 font-semibold">
                Choose Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 w-full focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                <option value="" disabled>
                  Select a role
                </option>
                <option value="User">Customer</option>
                <option value="Admin">Sorting Hub Admin</option>
                <option value="Dispatcher">Transport Agency</option>
              </select>
            </div>

            <div className="w-1/2 mb-3">
              <label htmlFor="name" className="block text-md mb-2 font-semibold">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="border border-gray-300 rounded px-4 py-2 w-full focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
            </div>


            <div className="w-full flex flex-row gap-1">
            <div className="w-1/2 mb-3">
              <label htmlFor="email" className="block text-md mb-2 font-semibold">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="border border-gray-300 rounded px-4 py-2 w-full focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div className="w-1/2 mb-3">
              <label htmlFor="contact" className="block text-md mb-2 font-semibold">
                Contact Number
              </label>
              <input
                id="contact"
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Enter your contact number"
                className="border border-gray-300 rounded px-4 py-2 w-full focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
            </div>
            {role === "User" && (
              <div className="mb-">
                <label htmlFor="address" className="block text-md mb-2 font-semibold">
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  className="border border-gray-300 rounded px-4 py-2 w-full focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            )}

            {role === "Dispatcher" && (
              <div className="mb-">
                <label htmlFor="city" className="block text-md mb-2 font-semibold">
                  City
                </label>
                <select
                  id="city"
                  value={current_location}
                  onChange={(e) => setcurrent_location(e.target.value)}
                  className="border border-gray-300 rounded px-4 py-2 w-full focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  <option value="" disabled>
                    Select your city
                  </option>
                  {cities.map((city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="username" className="block text-md mb-2 font-semibold">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="border border-gray-300 rounded px-4 py-2 w-full focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div className="w-full flex flex-row gap-1">
            <div className="w-1/2 mb-3">
              <label htmlFor="password" className="block text-md mb-2 font-semibold">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="border border-gray-300 rounded px-4 py-2 w-full focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div className="w-1/2 mb-3">
              <label htmlFor="confirmPassword" className="block text-md mb-2 font-semibold">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="border border-gray-300 rounded px-4 py-2 w-full focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
            </div>
            <div className="flex justify-center space-x-4 mb-3">
              <button
                onClick={handleSignUp}
                className="bg-red-700 text-white px-6 py-2 rounded-lg text-lg hover:bg-red-800 transition duration-200 shadow-lg"
              >
                Sign Up
              </button>
            </div>


            <div className="text-center">
              <p className="text-sm">
                Already have an account?{" "}
                <button
                  onClick={navigateToLogin}
                  className="text-red-700 font-semibold"
                >
                  Login here
                </button>
              </p>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
