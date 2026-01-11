import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔴 DELETE CATEGORY
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      const res = await api.delete(`/categories/delete.php?id=${id}`);

      if (res.data.status) {
        toast.success("Category deleted successfully");

        // Update UI without reload
        setCategories((prev) =>
          prev.filter((category) => category.id !== id)
        );
      } else {
        toast.error(res.data.message || "Delete failed");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  // 🔵 FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories/list.php");
        if (res.data.status) {
          setCategories(res.data.data);
        } else {
          toast.error("Failed to load categories");
        }
      } catch (err) {
        toast.error("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded shadow p-6">

        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/admin/dashboard"
            className="text-indigo-600 hover:underline"
          >
            ⬅ Back to Dashboard
          </Link>

          <Link
            to="/admin/categories/add"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            ➕ Add Category
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-4">Categories</h2>

        {/* Table */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Sr No</th>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Description</th>
                <th className="border p-2 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-4">
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((cat, index) => (
                  <tr key={cat.id}>
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{cat.name}</td>
                    <td className="border p-2">
                      {cat.description || "-"}
                    </td>
                    <td className="border p-2 text-center space-x-3">
                      <Link
                        to={`/admin/categories/view/${cat.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </Link>

                      <Link
                        to={`/admin/categories/edit/${cat.id}`}
                        className="text-yellow-600 hover:underline"
                      >
                        Edit
                      </Link>

                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDelete(cat.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
