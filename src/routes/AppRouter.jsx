import { Routes, Route } from "react-router-dom";

import Home from "../pages/users/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import EditProduct from "../pages/admin/products/EditProduct";

import AdminRegister from "../pages/admin/AdminRegister";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Categories from "../pages/admin/Categories";
import AddCategory from "../pages/admin/categories/AddCategory";
import ViewCategory from "../pages/admin/ViewCategory";
import EditCategory from "../pages/admin/EditCategory";

import AdminRoute from "./AdminRoute";

import Products from "../pages/admin/products/Products";
import AddProduct from "../pages/admin/products/AddProduct";
import ViewProduct from "../pages/admin/products/ViewProduct";
export default function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Bootstrap (only for first admin / controlled use) */}
      <Route
        path="/__admin__/register"
        element={
          <AdminRoute>
            <AdminRegister />
          </AdminRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/categories"
        element={
          <AdminRoute>
            <Categories />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/categories/add"
        element={
          <AdminRoute>
            <AddCategory />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/categories/view/:id"
        element={
          <AdminRoute>
            <ViewCategory />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/categories/edit/:id"
        element={
          <AdminRoute>
            <EditCategory />
          </AdminRoute>
        }
      />



<Route
  path="/admin/products"
  element={
    <AdminRoute>
      <Products />
    </AdminRoute>
  }
/>

<Route
  path="/admin/products/add"
  element={
    <AdminRoute>
      <AddProduct />
    </AdminRoute>
  }
/>
<Route
  path="/admin/products/view/:id"
  element={
    <AdminRoute>
      <ViewProduct />
    </AdminRoute>
  }
/>

<Route
  path="/admin/products/edit/:id"
  element={
    <AdminRoute>
      <EditProduct />
    </AdminRoute>
  }
/>




    </Routes>
  );
}
