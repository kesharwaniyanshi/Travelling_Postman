// "use client";

// import React, { useState } from "react";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import { useRouter } from "next/navigation";

// export default function Login() {
//   const [role, setRole] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const router = useRouter();

//   const handleLogin = async () => {
//     try {
//       const response = await fetch("/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ username, password, role }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Store user details in localStorage
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("username", data.username);
//         localStorage.setItem("userId", data.userId); // Store userId
//         localStorage.setItem("role", role);

//         // Redirect based on role
//         if (role === "User") router.push("/Userdashboard");
//         else if (role === "Admin") router.push("/Admindashboard");
//         else if (role === "Dispatcher") router.push("/DispatcherDashboard");
//       } else {
//         alert(data.error);
//       }
//     } catch (error) {
//       console.error("Login failed", error);
//       alert("Failed to log in");
//     }
//   };

//   const navigateToSignUp = () => {
//     router.push("/SignUp");
//   };

//   return (
//     <div className="bg-white flex flex-col items-center justify-between min-h-screen">
//       <Header />

//       <div className="w-full max-w-md bg-opacity-60 bg-white p-8 rounded-xl shadow-lg mt-4">
//         <div className="mb-6">
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
//         <div className="mb-6">
//           <label htmlFor="username" className="block text-lg mb-2 font-semibold">
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
//         <div className="mb-6">
//           <label htmlFor="password" className="block text-lg mb-2 font-semibold">
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
//         <div className="flex justify-center space-x-4 mb-6">
//           <button
//             onClick={handleLogin}
//             className="bg-red-700 text-white px-6 py-2 rounded-lg text-lg"
//           >
//             Login
//           </button>
//         </div>
//         <div className="text-center">
//           <p className="text-sm">
//             Don't have an account?{" "}
//             <button onClick={navigateToSignUp} className="text-red-700 font-semibold">
//               Sign Up here
//             </button>
//           </p>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }


"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "next/navigation";

export default function Login() {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user details in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("userId", data.userId); // Store userId
        localStorage.setItem("role", role);

        // Redirect based on role
        if (role === "User") router.push("/Userdashboard");
        else if (role === "Admin") router.push("/Admindashboard");
        else if (role === "Dispatcher") router.push("/DispatcherDashboard");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("Failed to log in");
    }
  };

  const navigateToSignUp = () => {
    router.push("/SignUp");
  };

  return (
    // <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-between min-h-screen">
    //   <div className="absolute inset-0 -z-10">
    //     <div className="w-96 h-96 bg-red-500 rounded-full absolute top-10 left-1/4 animate-pulse opacity-40"></div>
    //     <div className="w-80 h-80 bg-yellow-500 rounded-full absolute bottom-20 right-1/3 animate-bounce opacity-30"></div>
    //     <div className="w-64 h-64 bg-blue-500 rounded-full absolute top-1/3 right-1/4 animate-spin-slow opacity-20"></div>
    //   </div>

    //   <Header />

    //   <div className="w-full max-w-md bg-white bg-opacity-90 p-8 rounded-xl shadow-2xl mt-8">
    //     <div>
    //       <img src="/home-delivery-service.png" alt="" />
    //     </div>
    //     <div>
    //       <h1 className="text-2xl font-bold text-center text-red-700 mb">Welcome Back</h1>
    //       <h2 className="text-lg  text-center text-gray-400 mb-3">Login to continue</h2>
    //     </div>
    //     <div className="mb-6">
    //       <label htmlFor="role" className="block text-lg mb-2 font-semibold">
    //         Choose Role
    //       </label>
    //       <select
    //         id="role"
    //         value={role}
    //         onChange={(e) => setRole(e.target.value)}
    //         className="border border-gray-300 rounded px-4 py-2 w-full focus:ring-2 focus:ring-red-500 focus:outline-none"
    //       >
    //         <option value="" disabled>
    //           Select a role
    //         </option>
    //         <option value="User">User</option>
    //         <option value="Admin">Admin</option>
    //         <option value="Dispatcher">Dispatcher</option>
    //       </select>
    //     </div>

    //     <div className="mb-6">
    //       <label htmlFor="username" className="block text-lg mb-2 font-semibold">
    //         Username
    //       </label>
    //       <input
    //         id="username"
    //         type="text"
    //         value={username}
    //         onChange={(e) => setUsername(e.target.value)}
    //         placeholder="Enter your username"
    //         className="border border-gray-300 rounded px-4 py-2 w-full focus:ring-2 focus:ring-red-500 focus:outline-none"
    //       />
    //     </div>

    //     <div className="mb-6">
    //       <label htmlFor="password" className="block text-lg mb-2 font-semibold">
    //         Password
    //       </label>
    //       <input
    //         id="password"
    //         type="password"
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //         placeholder="Enter your password"
    //         className="border border-gray-300 rounded px-4 py-2 w-full focus:ring-2 focus:ring-red-500 focus:outline-none"
    //       />
    //     </div>

    //     <div className="flex justify-center space-x-4 mb-6">
    //       <button
    //         onClick={handleLogin}
    //         className="bg-red-700 text-white px-6 py-2 rounded-lg text-lg hover:bg-red-800 transition duration-200 shadow-lg"
    //       >
    //         Login
    //       </button>
    //     </div>

    //     <div className="text-center">
    //       <p className="text-sm">
    //         Don't have an account?{" "}
    //         <button
    //           onClick={navigateToSignUp}
    //           className="text-red-700 font-semibold underline hover:text-red-800"
    //         >
    //           Sign Up here
    //         </button>
    //       </p>
    //     </div>
    //   </div>

    //   <Footer />
    // </div>
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-between min-h-screen">
      <div className="absolute inset-0 -z-10">
        <div className="w-96 h-96 bg-red-500 rounded-full absolute top-10 left-1/4 animate-pulse opacity-40"></div>
        <div className="w-80 h-80 bg-yellow-500 rounded-full absolute bottom-20 right-1/3 animate-bounce opacity-30"></div>
        <div className="w-64 h-64 bg-blue-500 rounded-full absolute top-1/3 right-1/4 animate-spin-slow opacity-20"></div>
      </div>

      <Header />

      <div className="w-full max-w-3xl bg-white bg-opacity-90 p-5 rounded-xl shadow-2xl mt-5">
        <h1 className="text-3xl font-bold text-center text-red-700 mb-2">Welcome Back!</h1>
        {/* <h2 className="text-lg text-center text-gray-400 mb-4">Login to continue</h2> */}
        <div className="flex flex-col md:flex-row items-center">
          {/* Image Section */}
          <div className="w-full md:w-1/2 p-4 flex justify-center">
            <img src="/home-delivery-service.png" alt="Home Delivery" className="w-full max-w-sm rounded-lg " />
          </div>

          {/* Form Section */}
          <div className="w-full md:w-1/2 p-4">
            

            <div className="mb-6">
              <label htmlFor="role" className="block text-lg mb-2 font-semibold">
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

            <div className="mb-6">
              <label htmlFor="username" className="block text-lg mb-2 font-semibold">
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

            <div className="mb-6">
              <label htmlFor="password" className="block text-lg mb-2 font-semibold">
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

            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={handleLogin}
                className="bg-red-700 text-white px-6 py-2 rounded-lg text-lg hover:bg-red-800 transition duration-200 shadow-lg"
              >
                Login
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm">
                Don't have an account?{" "}
                <button
                  onClick={navigateToSignUp}
                  className="text-red-700 font-semibold underline hover:text-red-800"
                >
                  Sign Up here
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

