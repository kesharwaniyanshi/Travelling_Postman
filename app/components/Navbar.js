import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();
  const handleLogout = () => {
    if (!router) return; 
    // Remove token from storage (localStorage, sessionStorage, or cookies)
    localStorage.removeItem('token'); // Example for localStorage
    localStorage.removeItem('username'); // Example for localStorage
    localStorage.removeItem('role'); // Example for localStorage
    // If using cookies:
    document.cookie = 'authToken=; Max-Age=0; path=/';

    router.push('/Login');
  };
  return (
    <nav className="bg-red-700 text-white py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Navigation Links */}
        <div className="flex-1 flex justify-evenly">
          <Link
            href="/Admindashboard"
            className="text-white hover:text-yellow-400 transition-all duration-300 ease-in-out"
          >
            Home
          </Link>
          <Link
            href="/AdminAddParcel"
            className="text-white hover:text-yellow-400 transition-all duration-300 ease-in-out"
          >
            Manage Parcels
          </Link>
          {/* <Link
            href="/view-routes"
            className="text-white hover:text-yellow-400 transition-all duration-300 ease-in-out"
          >
            View Routes
          </Link> */}
          <Link
            href="/TrackShipment"
            className="text-white hover:text-yellow-400 transition-all duration-300 ease-in-out"
          >
            Track Shipments
          </Link>
          <Link
            href="/AdminPerformanceDashboard"
            className="text-white hover:text-yellow-400 transition-all duration-300 ease-in-out"
          >
            Performance Dashboard
          </Link>
        </div>

        {/* Logout Link */}
        <div className="ml-6">
          <button
            onClick={handleLogout}
            className="text-white hover:text-yellow-400 transition-all duration-300 ease-in-out"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
