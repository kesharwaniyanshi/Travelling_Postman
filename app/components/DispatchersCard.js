import { useState } from "react";
import ReactDOM from "react-dom"; // Import React Portal

function DispatchersCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dispatchers, setDispatchers] = useState([]);

  const handleCardClick = async () => {
    if (!isExpanded) {
      // Fetch dispatcher data from the server
      try {
        const response = await fetch("/api/get-dispatchers");
        const data = await response.json();
        setDispatchers(data); // Assuming the API returns an array of dispatchers directly
      } catch (error) {
        console.error("Error fetching dispatchers:", error);
      }
    }
    setIsExpanded(!isExpanded);
  };

  // Close the modal when clicking outside
  const handleOverlayClick = (e) => {
    if (e.target.id === "overlay") {
      setIsExpanded(false);
    }
  };

  return (
    <div>
      {/* Card for dispatchers */}
      <div
        className={`flex flex-col justify-center  rounded-lg p-6 text-center transform transition-all duration-300 ease-in-out ${
          isExpanded ? "scale-110 p-10" : "hover:scale-105"
        }`}
        onClick={handleCardClick}
      >
        <h3 className="text-2xl font-semibold text-gray-700">New Dispatchers</h3>
        <p className="text-4xl font-bold text-blue-600">{dispatchers.length || 12}</p>
      </div>

      {/* Use React Portal for the modal */}
      {isExpanded &&
        ReactDOM.createPortal(
          <div
            id="overlay"
            className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center"
            onClick={handleOverlayClick}
          >
            <div className="bg-white rounded-lg w-[70%] h-[85%] overflow-auto transform scale-110">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl justify-center font-semibold text-gray-700">Dispatchers</h2>
                <button
                  className="text-red-600 font-semibold"
                  onClick={() => setIsExpanded(false)}
                >
                  Close
                </button>
              </div>

              <div className="overflow-auto max-h-[75vh] flex flex-row justify-center">
                <table className=" w-25% text-left border-collapse border border-gray-200 ">
                  <thead className="bg-gray-100">
                    <tr>
                      {/* <th className="border border-gray-300 px-4 py-2">ID</th>*/}
                      <th className="border border-gray-300 px-4 py-2">Name</th>
                      <th className="border border-gray-300 px-4 py-2">Email</th>
                      <th className="border border-gray-300 px-4 py-2">Contact</th>
                      <th className="border border-gray-300 px-4 py-2">Username</th>
                      <th className="border border-gray-300 px-4 py-2">Delays</th>
                      <th className="border border-gray-300 px-4 py-2">Mode</th>
                      <th className="border border-gray-300 px-4 py-2">Mode Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dispatchers.map((dispatcher) => (
                      <tr key={dispatcher.dispatcher_id} className="hover:bg-gray-50">
                        {/* <td className="border border-gray-300 px-4 py-2">
                          {dispatcher.dispatcher_id}
                        </td> */}
                        <td className="border border-gray-300 px-4 py-2">{dispatcher.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{dispatcher.email}</td>
                        <td className="border border-gray-300 px-4 py-2">{dispatcher.contact}</td>
                        <td className="border border-gray-300 px-4 py-2">{dispatcher.username}</td>
                        <td className="border border-gray-300 px-4 py-2">{dispatcher.total_delays}</td>
                        <td className="border border-gray-300 px-4 py-2">{dispatcher.mode}</td>
                        <td className="border border-gray-300 px-4 py-2">{dispatcher.mode_number}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>,
          document.body // Render the modal outside the parent div
        )}
    </div>
  );
}

export default DispatchersCard;
