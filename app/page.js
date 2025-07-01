// "use client"
// import React from "react";
// import { useRouter } from "next/navigation"; 
// import IndiaMap from "./components/IndiaMap";
// // _app.js
// // import './globals.css'; // Ensure global.css is imported


// function HomePage() {
//   const router = useRouter(); 

  
//   const navigateToLogin = () => {
//     router.push("/Login"); 
//   };

  
//   const navigateToSignUp = () => {
//     router.push("/SignUp"); 
//   };

//   return (
//     <div className="flex flex-col items-center min-h-screen justify-center bg-gray-100">
//     {/* <img src="/Logo.png" alt="" width={"300px"} height={"300px"}/>
//       <h1 className="text-center text-3xl font-bold mb-6">
//         Welcome to the Travelling Postman
//       </h1>

//       <div className="flex space-x-4">
//         <button
//           onClick={navigateToLogin}
//           className="bg-red-700 text-white px-6 py-2 rounded-lg"
//         >
//           Go to Login
//         </button> */}
//         {/* <button
//           onClick={navigateToSignUp}
//           className="bg-red-700 text-white px-6 py-2 rounded-lg"
//         >
//           Go to Sign Up
//         </button> */}


//         {/* Link to Static HTML page */}
//         <div className="mt-4">
//           <a
//             href="/logistica-1.0.0/index.html"  // Link to your HTML page in the public folder
//             target="_blank" // Open in a new tab
//             className="text-blue-500 hover:text-blue-700"
//           >
//             Open the HTML Page
//           </a>
//         </div>
//     </div>
//   );
// }

// export default HomePage;
"use client"
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

function HomePage() {
  const router = useRouter();

  // Redirect the user to the HTML page when the component is mounted
  useEffect(() => {
    // Redirect to the HTML page directly
    router.push("/landing page/index.html");
  }, [router]);

  return (
    <div className="flex flex-col items-center min-h-screen justify-center bg-gray-100">
      {/* Optional: Add loading or message while redirecting */}
      <p className="text-lg">Redirecting to the Home page...</p>
    </div>
  );
}

export default HomePage;
