import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { toast } from "react-toastify";

export default function AddProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    category_id: "",
    name: "",
    price: "",
    description: "",
    stock: ""
  });

  // 🔹 Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories/list.php");
        if (res.data.status) {
          setCategories(res.data.data);
        } else {
          toast.error("Failed to load categories");
        }
      } catch {
        toast.error("Server error");
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.category_id || !form.name || !form.price) {
      toast.error("Category, Name and Price are required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("category_id", form.category_id);
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("stock", form.stock || 0);

      if (image) {
        formData.append("image", image);
      }

      const res = await api.post("/products/add.php", formData);


      if (res.data.status) {
        toast.success("Product added successfully");
        navigate("/admin/products");
      } else {
        toast.error(res.data.message || "Failed to add product");
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

        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/admin/products"
            className="text-indigo-600 hover:underline"
          >
            ⬅ Back to Products
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-6">Add Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Category */}
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          {/* Price */}
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          {/* Stock */}
          <input
            type="number"
            name="stock"
            placeholder="Stock (optional)"
            value={form.stock}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          {/* Image */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border p-2 rounded"
          />

          {/* Image Preview */}
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="h-32 object-contain border rounded"
            />
          )}

          {/* Description */}
          <textarea
            name="description"
            placeholder="Description (optional)"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows="4"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
