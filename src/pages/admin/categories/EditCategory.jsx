import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../../services/api";
import { toast } from "react-toastify";

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch category
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await api.get(`/categories/view.php?id=${id}`);
        if (res.data.status) {
          setForm({
            name: res.data.data.name,
            description: res.data.data.description || ""
          });
        } else {
          toast.error(res.data.message || "Category not found");
        }
      } catch {
        toast.error("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

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
      setSaving(true);

      const res = await api.post("/categories/update.php", {
        id,
        name: form.name,
        description: form.description
      });

      if (res.data.status) {
        toast.success("Category updated successfully");
        navigate("/admin/categories");
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">

        {/* Top */}
        <div className="mb-6">
          <Link
            to="/admin/categories"
            className="text-indigo-600 hover:underline"
          >
            ⬅ Back to Categories
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-6">
          Edit Category
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
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
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Description (optional)
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? "Updating..." : "Update Category"}
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
        )}
      </div>
    </div>
  );
}
