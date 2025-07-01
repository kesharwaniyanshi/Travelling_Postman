import React, { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import Papa from "papaparse"; // To parse CSV files

mapboxgl.accessToken =
  "pk.eyJ1Ijoic2F1cmFiaC12ZXJtYSIsImEiOiJjbTQ4OXpnZGwwYTQ2MmtxeDFtajNhZ2l5In0.tn-LonzCO78ByE5-rSc5mg";

const IndiaMap = ({ source, destination, currentAddress }) => {
  const [cities, setCities] = useState([]);
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Load cities from CSV file
    fetch("/data/Indian_cities.csv")
      .then((response) => response.text())
      .then((csvText) => {
        const { data } = Papa.parse(csvText, { header: true });
        setCities(data);
      });

    // Initialize Mapbox map
    const mapInstance = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [77.5946, 12.9716], // Default center (Bangalore)
      zoom: 5, // Set initial zoom to fit India view
    });

    // Restrict map view to India only (using latitude and longitude bounds)
    mapInstance.setMaxBounds([
      [68.0, 6.0], // Southwest coordinates of India
      [97.0, 37.0], // Northeast coordinates of India
    ]);

    setMap(mapInstance);

    return () => mapInstance.remove();
  }, []);

  const getCityCoordinates = (cityName) => {
    const city = cities.find((city) => city.City === cityName);
    return city ? [parseFloat(city.Longitude), parseFloat(city.Latitude)] : null;
  };

  const fetchRoute = async (startCoords, endCoords, truckLocation) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords.join(
          ","
        )};${endCoords.join(",")}?geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      const route = data.routes[0]?.geometry;

      if (!route) {
        console.error("No route found between the specified coordinates.");
        return;
      }

      // Add route to the map
      if (map.getSource("route")) {
        map.getSource("route").setData({
          type: "Feature",
          geometry: route,
        });
      } else {
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: route,
          },
        });

        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#0074D9",
            "line-width": 5,
          },
        });
      }

      // Remove existing markers
      const markers = document.getElementsByClassName("marker");
      while (markers[0]) {
        markers[0].remove();
      }

      // Add markers for start and end points with custom markers
      if (startCoords) {
        new mapboxgl.Marker({
          color: "red", // Red color for source marker
          element: createCustomMarker(
            "https://img.icons8.com/color/48/000000/marker.png"
          ),
        })
          .setLngLat(startCoords)
          .setPopup(new mapboxgl.Popup().setText("Source Location"))
          .addTo(map);
      }

      if (endCoords) {
        new mapboxgl.Marker({
          color: "blue", // Blue color for destination marker
          element: createCustomMarker(
            "https://img.icons8.com/color/48/000000/marker.png"
          ),
        })
          .setLngLat(endCoords)
          .setPopup(new mapboxgl.Popup().setText("Destination Location"))
          .addTo(map);
      }

      if (truckLocation) {
        new mapboxgl.Marker({
          element: createCustomMarker(
            "https://img.icons8.com/color/48/000000/truck.png"
          ),
        })
          .setLngLat(truckLocation)
          .setPopup(new mapboxgl.Popup().setText("Truck Location"))
          .addTo(map);
      }

      // Adjust map viewport to fit the route and markers
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend(startCoords);
      bounds.extend(endCoords);
      bounds.extend(truckLocation); // Include truck location in the bounds
      map.fitBounds(bounds, { padding: 50 }); // Add padding around the bounds
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  const createCustomMarker = (url) => {
    const markerElement = document.createElement("div");
    markerElement.style.width = "30px";
    markerElement.style.height = "30px";
    markerElement.style.backgroundImage = `url(${url})`;
    markerElement.style.backgroundSize = "cover";
    markerElement.className = "marker"; // Add a class to target them
    return markerElement;
  };

  useEffect(() => {
    if (cities.length > 0 && map) {
      const sourceCoords = getCityCoordinates(source);
      const destinationCoords = getCityCoordinates(destination);
      const currentAddressCoords = getCityCoordinates(currentAddress);

      console.log("Source Coordinates:", sourceCoords);
      console.log("Destination Coordinates:", destinationCoords);
      console.log("Truck Coordinates:", currentAddressCoords);

      if (
        sourceCoords &&
        destinationCoords &&
        currentAddressCoords
      ) {
        fetchRoute(sourceCoords, destinationCoords, currentAddressCoords); // Pass truckLocation as currentAddressCoords
      } else {
        console.error("City coordinates could not be found.");
      }
    }
  }, [source, destination, currentAddress, cities, map]);

  return (
    <div className="flex flex-col h-screen">
      {/* Controls Section */}
      <div className="flex items-center justify-center gap-4 p-4 bg-gray-100 shadow-md z-10">
        {/* <button
          onClick={() =>
            fetchRoute(
              getCityCoordinates(source),
              getCityCoordinates(destination),
              getCityCoordinates(currentAddress)
            )
          }
          className="w-1/4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
        >
          Get Route
        </button> */}
      </div>

      {/* Map Section */}
      <div
        id="map"
        className="map-container"
        style={{ width: "100%", height: "100%" }}
      ></div>
    </div>
  );
};

export default IndiaMap;
