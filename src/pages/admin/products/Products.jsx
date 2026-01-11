import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api";
import { toast } from "react-toastify";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products/list.php");

        if (res.data.status) {
          setProducts(res.data.data);
        } else {
          toast.error("Failed to load products");
        }
      } catch {
        toast.error("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ---------------- DELETE PRODUCT ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const res = await api.delete(`/products/delete.php?id=${id}`);

      if (res.data.status) {
        toast.success("Product deleted successfully");

        // Remove product from UI
        setProducts((prev) =>
          prev.filter((product) => product.id !== id)
        );
      } else {
        toast.error(res.data.message || "Delete failed");
      }
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded shadow p-6">

        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <Link to="/admin/dashboard" className="text-indigo-600 hover:underline">
            ⬅ Back to Dashboard
          </Link>

          <Link
            to="/admin/products/add"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            ➕ Add Product
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-4">Products</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Sr No</th>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Category</th>
                <th className="border p-2 text-left">Price</th>
                <th className="border p-2 text-left">Stock</th>
                <th className="border p-2 text-left">Status</th>
                <th className="border p-2 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-4">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((prod, index) => (
                  <tr key={prod.id}>
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{prod.name}</td>
                    <td className="border p-2">
                      {prod.category_name || "-"}
                    </td>
                    <td className="border p-2">₹ {prod.price}</td>
                    <td className="border p-2">{prod.stock}</td>
                    <td className="border p-2">
                      {prod.status === "ACTIVE" ? "Active" : "Inactive"}
                    </td>
                    <td className="border p-2 text-center space-x-3">
                      <Link
                        to={`/admin/products/view/${prod.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </Link>

                      <Link
                        to={`/admin/products/edit/${prod.id}`}
                        className="text-yellow-600 hover:underline"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="text-red-600 hover:underline"
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
