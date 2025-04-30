require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
const PORT = 8082;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "shriyash27@",
  database: "inventory_db"
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ Connected to MySQL");
});

// Add Product
app.post("/products", (req, res) => {
  const { user_id, product_name, quantity, price } = req.body;
  const q = `INSERT INTO products (user_id, product_name, quantity, price) VALUES (?, ?, ?, ?)`;
  db.query(q, [user_id, product_name, quantity, price], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Product added", id: result.insertId });
  });
});

// Get Products for a User
app.get("/products/:user_id", (req, res) => {
  const q = `SELECT * FROM products WHERE user_id = ? ORDER BY created_at DESC`;
  db.query(q, [req.params.user_id], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// Update Product
app.put("/products/:id", (req, res) => {
  const { product_name, quantity, price } = req.body;
  const q = `UPDATE products SET product_name=?, quantity=?, price=? WHERE id=?`;
  db.query(q, [product_name, quantity, price, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Product updated" });
  });
});

// Delete Product
app.delete("/products/:id", (req, res) => {
  db.query(`DELETE FROM products WHERE id = ?`, [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Product deleted" });
  });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
