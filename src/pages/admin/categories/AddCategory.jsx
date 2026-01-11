import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../../services/api";
import { toast } from "react-toastify";

export default function AddCategory() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/categories/create.php", form);

      if (res.data.status) {
        toast.success("Category added successfully");
        navigate("/admin/categories");
      } else {
        toast.error(res.data.message || "Failed to add category");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">

        {/* Top */}
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/admin/categories"
            className="text-indigo-600 hover:underline"
          >
            ⬅ Back
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-6">
          Add Category
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Category Name *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Birthday Gifts"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description (optional) */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description (optional)
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Short description about this category"
              rows="4"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Add Category"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/categories")}
              className="border px-6 py-2 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
