"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Logo from "/public/Logo.png";
import Image from "next/image";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import IndiaMap from "../components/IndiaMap";

const TrackShipment = () => {
  const [username, setUsername] = useState("");
  const [idEnter, setIdEnter] = useState(false);
  const [reroute, setReroute] = useState(false);
  const [dispatcherId, setDispatcherId] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(null); // Track selected route
  const [mapData, setMapData] = useState(null);
  const [alternateRoutes, setAlternateRoutes] = useState([]);

  const route = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");
    if (storedRole === "Admin" && storedUsername) {
      setUsername(storedUsername);
    } else {
      route.push("/Login");
    }
  }, [route]);

  const handleInputChange = (e) => {
    setDispatcherId(e.target.value);
  };
  const displayRoute = async () => {
    if (dispatcherId.trim() === "") {
      alert("Please enter a tracking ID");
      return;
    }
    await handleConsignment();
    if (mapData?.source && mapData?.destination) {
      await handleRoute();
    }
    setIdEnter(true); // Display the table and current location
  };

  const handleConsignment = async () => {
    if (dispatcherId.trim() === "") {
      alert("Please enter a tracking ID");
    } else {
      try {
        const response = await fetch(
          `/api/getRouteDetails?dispatcherId=${dispatcherId}`
        );
        const data = await response.json();
        if (data.success) {
          const { currentAddress, source, destination } = data.routeDetails;
          setMapData({ source, destination, currentAddress });
        } else {
          alert(data.message || "Failed to fetch route details.");
        }
      } catch (error) {
        console.error("Error fetching route details:", error);
      }
    }
  };

  const handleRoute = async () => {
    if (mapData?.source && mapData?.destination) {
      try {
        const response = await fetch(
          `/api/getAlternateRoutes?source=${mapData.source}&destination=${mapData.destination}`
        );
        const data = await response.json();
        if (data.success) {
          setAlternateRoutes(data.routes);
        } else {
          alert(data.message || "Failed to fetch alternate routes.");
        }
      } catch (error) {
        console.error("Error fetching alternate routes:", error);
      }
    }
  };

  // const handleConsignment = async () => {
  //   if (dispatcherId.trim() === "") {
  //     alert("Please enter a tracking ID");
  //   } else {
  //     try {
  //       const response = await fetch(
  //         `/api/getRouteDetails?dispatcherId=${dispatcherId}`
  //       );
  //       const data = await response.json();
  //       if (data.success) {
  //         const { currentAddress, source, destination } = data.routeDetails;
  //         setMapData({ source, destination, currentAddress });
  //         setIdEnter(true);
  //       } else {
  //         alert(data.message || "Failed to fetch route details.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching route details:", error);
  //     }
  //   }
  // };

  // const handleRoute = async () => {
  //   try {
  //     const response = await fetch(
  //       `/api/getAlternateRoutes?source=${mapData.source}&destination=${mapData.destination}`
  //     );
  //     const data = await response.json();
  //     if (data.success) {
  //       setAlternateRoutes(data.routes);
  //       setIdEnter(true);
  //     } else {
  //       alert(data.message || "Failed to fetch alternate routes.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching alternate routes:", error);
  //   }
  // };

  // const displayRoute=()=>{
  //   handleConsignment();
  //   handleRoute();
  // }

  const handleCheckboxChange = (routePath) => {
    const newRoute = selectedRoute === routePath ? null : routePath;
    console.log("Selected Route:", newRoute); // Debug log
    setSelectedRoute(newRoute);
  };

  const handleUpdatedRoute = async () => {
    if (!selectedRoute || !mapData) {
      alert("Please select a route and ensure map data is loaded.");
      return;
    }

    console.log("Submitting Route Update:", {
      dispatcherId,
      currentAddress: mapData.currentAddress,
      destination: mapData.destination,
      selectedRoute, // Debug log
    });

    try {
      const response = await fetch("/api/handleUpdateRoute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dispatcherId,
          currentAddress: mapData.currentAddress,
          destination: mapData.destination,
          selectedRoute, // Send the selected route
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Route updated successfully!");
      } else {
        alert(data.error || "Failed to update the route.");
      }
    } catch (error) {
      console.error("Error updating route:", error);
      alert("An error occurred while updating the route.");
    }
  };

  return (
    <div className="bg-gray-100">
      <header className="relative bg-white">
        <div className="flex items-center justify-center px-8 py-8 relative">
          <div className="absolute left-4">
            <Image src={Logo} alt="Postman Logo" width={120} height={120} />
          </div>
          <h1 className="text-4xl font-bold text-red-700 text-center">
            Welcome {username}!
          </h1>
        </div>
      </header>
      <Navbar />

        <h2 className="flex flex-row text-3xl font-bold mt-4 mb-4 justify-center">Track the Dispatcher!</h2>
      <main className="w-full max-w-full p-4 flex flex-col space-y-8">
        <div className="flex flex-col md:flex-row w-full justify-between space-y-4 md:space-y-0">
          <div className="w-full md:w-1/2 p-4 border border-gray-300 flex flex-col items-center justify-center">
            <section className="w-full ">
              <IndiaMap
                source={mapData?.source}
                destination={mapData?.destination}
                currentAddress={mapData?.currentAddress}
              />
            </section>
          </div>

          <div className="w-full md:w-1/2 p-4 flex flex-col items-center">
            <div className="mb-4 w-full">
              <label className="block mb-2">Dispatcher ID:</label>
              <div className="flex">
                <input
                  type="text"
                  className="flex-grow p-2 border border-gray-300 rounded-l"
                  value={dispatcherId}
                  onChange={handleInputChange}
                />
                <button
                  className="w-1/4 p-2 bg-red-700 ml-2 text-white rounded hover:bg-red-600"
                  onClick={displayRoute}
                >
                  Enter
                </button>
              </div>
            </div>
            {idEnter && (
              <div className="w-full flex flex-row justify-between items-center mb-4">
                <div className="flex flex-row items-center space-x-2">
                  <h2 className="font-semibold">Current Location:</h2>
                  <p className="font-bold text-gray-800">{mapData.currentAddress}</p>
                </div>
                {/* <button
                  onClick={handleRoute}
                  className="p-2 bg-red-700 text-white rounded hover:bg-red-800 transition duration-200"
                >
                  Re-route
                </button> */}
              </div>
            )}
            {idEnter && (
              <div className="w-full flex flex-col">
                <table className="border border-gray-300 w-full text-left">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2 border-r border-gray-300">Select</th>
                      <th className="p-2 border-r border-gray-300">Route</th>
                      <th className="p-2 border-r border-gray-300">Safety</th>
                      <th className="p-2 border-r border-gray-300">Weather</th>
                      <th className="p-2 border-r border-gray-300">ETA</th>
                      <th className="p-2 border-r border-gray-300">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alternateRoutes.map((route, index) => (
                      <tr key={index}>
                        <td className="p-2 border-r border-gray-300">
                          <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={selectedRoute === route.path}
                            onChange={() => handleCheckboxChange(route.path)}
                          />
                        </td>
                        <td className="p-2 border-r border-gray-300">{route.path}</td>
                        <td className="p-2 border-r border-gray-300 text-green-600">Safe</td>
                        <td className="p-2 border-r border-gray-300">Sunny</td>
                        <td className="p-2 border-r border-gray-300">{route.duration}</td>
                        <td className="p-2 border-r border-gray-300">{route.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  className="mt-4 p-2 bg-red-700 text-white rounded w-1/4"
                  onClick={handleUpdatedRoute}
                >
                  Update Route
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TrackShipment;
