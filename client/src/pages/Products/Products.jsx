import { useMemo, useState } from "react";
import ProductForm from "../../components/ProductForm/ProductForm";
import ProductTable from "../../components/ProductTable/ProductTable";
import "./Products.css";

function Products({ products, onCreate, onUpdate, onDelete, onStockChange }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const categories = [...new Set(products.map((product) => product.category))].sort();
  const filteredProducts = useMemo(() => products.filter((product) => {
    const searchMatches = `${product.name} ${product.sku}`.toLowerCase().includes(search.toLowerCase());
    return searchMatches && (!category || product.category === category) && (!status || product.status === status);
  }), [products, search, category, status]);

  const handleSubmit = async (product) => {
    if (editingProduct) {
      await onUpdate(editingProduct._id, product);
    } else {
      await onCreate(product);
    }
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1>Products</h1>
        </div>
        <button onClick={() => { setEditingProduct(null); setShowForm(!showForm); }}>
          {showForm ? "Close form" : "Add product"}
        </button>
      </div>

      {showForm && <ProductForm product={editingProduct} onSubmit={handleSubmit} onCancel={() => { setEditingProduct(null); setShowForm(false); }} />}

      <div className="filters">
        <input placeholder="Search by name or SKU" value={search} onChange={(event) => setSearch(event.target.value)} />
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">All categories</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All statuses</option>
          <option value="IN_STOCK">In stock</option>
          <option value="LOW_STOCK">Low stock</option>
          <option value="OUT_OF_STOCK">Out of stock</option>
        </select>
      </div>

      <ProductTable products={filteredProducts} onEdit={handleEdit} onDelete={onDelete} onStockChange={onStockChange} />
    </section>
  );
}

export default Products;
