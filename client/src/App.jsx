import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard/Dashboard";
import Products from "./pages/Products/Products";
import {
  createProduct,
  deleteProduct,
  getProducts,
  stockIn,
  stockOut,
  updateProduct
} from "./services/productApi";

function App() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.data);
      } catch (error) {
        setError(error.message || "Unable to load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const refreshProducts = async (action) => {
    try {
      setError("");
      await action();
      const data = await getProducts();
      setProducts(data.data);
    } catch (error) {
      setError(error.message || "The request failed");
      throw error;
    }
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Delete ${product.name}?`)) {
      await refreshProducts(() => deleteProduct(product._id));
    }
  };

  const handleStockChange = async (product, direction) => {
    const quantity = Number(window.prompt(`Enter quantity to stock ${direction}:`, "1"));
    if (Number.isInteger(quantity) && quantity > 0) {
      await refreshProducts(() => direction === "in" ? stockIn(product._id, quantity) : stockOut(product._id, quantity));
    }
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Inventory Management</p>
          <p className="header-subtitle">Keep every unit accounted for.</p>
        </div>
        <nav>
          <button className={page === "dashboard" ? "nav-active" : "button-secondary"} onClick={() => setPage("dashboard")}>Dashboard</button>
          <button className={page === "products" ? "nav-active" : "button-secondary"} onClick={() => setPage("products")}>Products</button>
        </nav>
      </header>
      <div className="app-content">
        {error && <p className="global-error">{error}</p>}
        {loading ? <p className="loading-state">Loading products...</p> : page === "dashboard" ? (
          <Dashboard products={products} />
        ) : (
          <Products
            products={products}
            onCreate={(product) => refreshProducts(() => createProduct(product))}
            onUpdate={(id, product) => refreshProducts(() => updateProduct(id, product))}
            onDelete={handleDelete}
            onStockChange={handleStockChange}
          />
        )}
      </div>
    </main>
  );
}

export default App;
