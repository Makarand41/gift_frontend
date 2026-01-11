import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  // 🔁 Session ping for inactivity logout
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await api.get("/admin/ping.php");
      } catch (err) {
        setUser(null);
        toast.error("Session expired. Please login again.");
        navigate("/login");
      }
    }, 20000); // 20 seconds

    return () => clearInterval(interval);
  }, [navigate, setUser]);

  const handleLogout = async () => {
    await api.post("/auth/logout.php");
    setUser(null);
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">
            Giftoria Admin
          </h1>

          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              Hi, <b>{user?.username}</b>
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Categories */}
          <Link
            to="/admin/categories"
            className="bg-indigo-600 text-white p-6 rounded shadow hover:bg-indigo-700 text-center"
          >
            <h3 className="text-xl font-semibold mb-2">Categories</h3>
            <p className="text-sm opacity-90">
              Manage product categories
            </p>
          </Link>

          {/* Products ✅ */}
          <Link
            to="/admin/products"
            className="bg-indigo-600 text-white p-6 rounded shadow hover:bg-indigo-700 text-center"
          >
            <h3 className="text-xl font-semibold mb-2">Products</h3>
            <p className="text-sm opacity-90">
              Manage products
            </p>
          </Link>

          {/* Orders (later) */}
          <div
            className="bg-gray-400 text-white p-6 rounded shadow text-center cursor-not-allowed"
          >
            <h3 className="text-xl font-semibold mb-2">Orders</h3>
            <p className="text-sm opacity-90">
              Coming soon
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
