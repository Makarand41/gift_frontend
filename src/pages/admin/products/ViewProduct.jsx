import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../services/api";
import { toast } from "react-toastify";

const BACKEND_URL = "http://localhost/giftoria-backend";

export default function ViewProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/view.php?id=${id}`);

        if (res.data.status) {
          setProduct(res.data.data);
        } else {
          toast.error(res.data.message || "Failed to load product");
        }
      } catch {
        toast.error("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  if (!product) {
    return <p className="p-6">Product not found</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded shadow p-6">

        {/* Top Bar */}
        <div className="mb-6">
          <Link
            to="/admin/products"
            className="text-indigo-600 hover:underline"
          >
            ⬅ Back to Products
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-6">View Product</h2>

        {/* IMAGE */}
        <div className="mb-6">
          <span className="font-semibold block mb-2">Image:</span>

          {product.image ? (
            <img
              src={`${BACKEND_URL}/uploads/products/${product.image}`}
              alt={product.name}
              className="h-48 object-contain border rounded"
            />
          ) : (
            <p className="text-gray-500">No image available</p>
          )}
        </div>

        {/* DETAILS */}
        <div className="space-y-3">
          <div><b>Name:</b> {product.name}</div>
          <div><b>Category:</b> {product.category_name || "-"}</div>
          <div><b>Price:</b> ₹ {product.price}</div>
          <div><b>Stock:</b> {product.stock}</div>
          <div><b>Status:</b> {product.status}</div>

          <div>
            <b>Description:</b>
            <p className="mt-1 text-gray-700">
              {product.description || "—"}
            </p>
          </div>

          <div>
            <b>Created At:</b> {product.created_at}
          </div>
        </div>

      </div>
    </div>
  );
}
