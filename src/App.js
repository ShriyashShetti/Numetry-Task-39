import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ user_id: 1, product_name: "", quantity: "", price: "" });
  const [editId, setEditId] = useState(null);

  const API = "http://localhost:8082";

  const getProducts = async () => {
    const res = await axios.get(`${API}/products/1`);
    setProducts(res.data);
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`${API}/products/${editId}`, form);
      toast.success("✅ Product updated!");
      setEditId(null);
    } else {
      await axios.post(`${API}/products`, form);
      toast.success("✅ Product added!");
    }
    setForm({ ...form, product_name: "", quantity: "", price: "" });
    getProducts();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/products/${id}`);
    toast.error("❌ Product deleted!");
    getProducts();
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditId(product.id);
  };

  const totalInventoryValue = products.reduce((acc, p) => acc + p.quantity * p.price, 0);

  return (
    <div style={{ backgroundColor: "#f0f2f5", minHeight: "100vh", padding: "30px" }}>
      <div className="container shadow p-4 rounded" style={{ backgroundColor: "#ffffff" }}>
        <h2 className="text-center mb-4 text-primary">📦 Simple Inventory Management</h2>

        {/* Total Inventory Value */}
        <div className="alert alert-success text-center fw-bold fs-5">
          Total Inventory Value: ₹{totalInventoryValue.toFixed(2)}
        </div>

        {/* Form */}
        <form className="row g-3 mb-4" onSubmit={handleSubmit}>
          <div className="col-md-3">
            <input type="text" className="form-control" placeholder="Product Name" value={form.product_name}
              onChange={e => setForm({ ...form, product_name: e.target.value })} required />
          </div>
          <div className="col-md-2">
            <input type="number" className="form-control" placeholder="Quantity" value={form.quantity}
              onChange={e => setForm({ ...form, quantity: e.target.value })} required />
          </div>
          <div className="col-md-2">
            <input type="number" className="form-control" placeholder="Price" value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })} required />
          </div>
          <div className="col-md-2">
            <button className={`btn ${editId ? "btn-warning" : "btn-primary"} w-100`}>
              {editId ? "Update" : "Add"} Product
            </button>
          </div>
          <div className="col-md-3">
            <button className="btn btn-secondary w-100" type="button" onClick={() => {
              setForm({ user_id: 1, product_name: "", quantity: "", price: "" });
              setEditId(null);
            }}>
              Clear Form
            </button>
          </div>
        </form>

        {/* Products Table */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-primary">
              <tr className="text-center">
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price (₹)</th>
                <th>Total Value (₹)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">No products available</td>
                </tr>
              ) : (
                products.map(p => (
                  <tr key={p.id} className="text-center align-middle">
                    <td>{p.product_name}</td>
                    <td className={p.quantity < 5 ? "text-danger fw-bold" : ""}>{p.quantity}</td>
                    <td>₹{p.price}</td>
                    <td>₹{(p.quantity * p.price).toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-warning me-2"
                        onClick={() => handleEdit(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(p.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      <ToastContainer />
    </div>
  );
}

export default App;
