import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../services/api";
import { toast } from "react-toastify";

export default function ViewCategory() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await api.get(`/categories/view.php?id=${id}`);
        if (res.data.status) {
          setCategory(res.data.data);
        } else {
          toast.error(res.data.message || "Failed to load category");
        }
      } catch {
        toast.error("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

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

        <h2 className="text-2xl font-bold mb-4">
          View Category
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : category ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Category Name
              </label>
              <p className="mt-1 text-gray-900 font-semibold">
                {category.name}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Description
              </label>
              <p className="mt-1 text-gray-900">
                {category.description || "-"}
              </p>
            </div>
          </div>
        ) : (
          <p>Category not found</p>
        )}
      </div>
    </div>
  );
}
