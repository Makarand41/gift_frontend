import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { toast } from "react-toastify";

export default function Home() {
  const { user, setUser, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await api.post("/auth/logout.php");
    setUser(null);
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">
            Giftoria
          </h1>

          {!loading && (
            <div className="space-x-4">
              {user ? (
                <>
                  <span className="text-gray-700">
                    Hi, <b>{user.username}</b>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-indigo-600">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Gifts for Every Occasion 🎁
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-8">
          Discover thoughtful gifts for birthdays, anniversaries, festivals,
          and special moments — all in one place.
        </p>

        <button className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700">
          Explore Gifts
        </button>
      </section>

      <footer className="bg-white border-t py-4 text-center text-gray-500">
        © {new Date().getFullYear()} Giftoria. All rights reserved.
      </footer>
    </div>
  );
}
