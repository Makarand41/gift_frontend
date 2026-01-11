import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { toast } from "react-toastify";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    category_id: "",
    name: "",
    price: "",
    stock: "",
    status: "ACTIVE",
    description: ""
  });

  const [oldImage, setOldImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);

  /* ---------------- FETCH PRODUCT ---------------- */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/view.php?id=${id}`);
        if (res.data.status) {
          const p = res.data.data;

          setForm({
            category_id: p.category_id,
            name: p.name,
            price: p.price,
            stock: p.stock,
            status: p.status,
            description: p.description || ""
          });

          if (p.image) {
            setOldImage(
              `http://localhost/giftoria-backend/uploads/products/${p.image}`
            );
          }
        } else {
          toast.error(res.data.message);
        }
      } catch {
        toast.error("Failed to load product");
      }
    };

    fetchProduct();
  }, [id]);

  /* ---------------- FETCH CATEGORIES ---------------- */
  useEffect(() => {
    api.get("/categories/list.php").then(res => {
      if (res.data.status) {
        setCategories(res.data.data);
      }
    });
  }, []);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("id", id);
      formData.append("category_id", form.category_id);
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("status", form.status);
      formData.append("description", form.description);

      if (newImage) {
        formData.append("image", newImage); // 🔁 replace image
      }

      const res = await api.post("/products/edit.php", formData);

      if (res.data.status) {
        toast.success("Product updated successfully");
        navigate("/admin/products");
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">

        <Link
          to="/admin/products"
          className="text-indigo-600 hover:underline"
        >
          ⬅ Back to Products
        </Link>

        <h2 className="text-2xl font-bold my-6">Edit Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Category */}
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Name */}
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Product name"
          />

          {/* Price */}
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Price"
          />

          {/* Stock */}
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Stock"
          />

          {/* Status */}
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>

          {/* Image */}
          <div>
            <label className="font-semibold block mb-1">
              Replace Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {/* Preview */}
          {(preview || oldImage) && (
            <img
              src={preview || oldImage}
              alt="Preview"
              className="h-40 object-contain border rounded"
            />
          )}

          {/* Description */}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="w-full border p-2 rounded"
            placeholder="Description"
          />

          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
